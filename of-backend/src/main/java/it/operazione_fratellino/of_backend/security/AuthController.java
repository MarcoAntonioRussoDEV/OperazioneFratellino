package it.operazione_fratellino.of_backend.security;

import io.jsonwebtoken.JwtException;
import it.operazione_fratellino.of_backend.DTOs.RequestUserDTO;
import it.operazione_fratellino.of_backend.DTOs.UserDTO;
import it.operazione_fratellino.of_backend.entities.City;
import it.operazione_fratellino.of_backend.entities.Client;
import it.operazione_fratellino.of_backend.entities.User;
import it.operazione_fratellino.of_backend.services.CityService;
import it.operazione_fratellino.of_backend.services.ClientService;
import it.operazione_fratellino.of_backend.services.RoleService;
import it.operazione_fratellino.of_backend.services.UserService;
import it.operazione_fratellino.of_backend.utils.DTOConverters.UserConverter;
import it.operazione_fratellino.of_backend.utils.LogUtils;
import it.operazione_fratellino.of_backend.utils.ResponseUtils;
import it.operazione_fratellino.of_backend.utils.SeverityEnum;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.Objects;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserService userService;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private UserConverter userConverter;
    @Autowired
    private JwtUtil jwtUtil;
    @Autowired
    private JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;
    @Autowired
    private ResponseUtils responseUtils;
    @Autowired
    private ClientService clientService;
    @Autowired
    private CityService cityService;
    @Autowired
    private RoleService roleService;


    @Transactional
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RequestUserDTO requesUser) {

        if (userService.exists(requesUser.getEmail())) {
            return responseUtils.customResponse(409, "emailTaken");
        }

        User user = new User();
            user.setName(requesUser.getName());
            user.setPassword(passwordEncoder.encode(requesUser.getPassword()));
            user.setCity(cityService.findOrNew(requesUser.getCity()));
            user.setEmail(requesUser.getEmail());
            user.setRole(roleService.findByName(requesUser.getRole()));
            user.setPhone(requesUser.getPhone());
            user.setIsFirstAccess(true);
        user = userService.save(user);

        return responseUtils.customResponse(200, "userCreated");
    }





    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User user, HttpSession session) {
        User foundUser = userService.findByEmail(user.getEmail());

        if(Objects.isNull(foundUser.getUsername())){
            return responseUtils.customResponse(HttpServletResponse.SC_UNAUTHORIZED, "userNotFound");
        } else if (foundUser.getIsDeleted()) {
            return responseUtils.customResponse(HttpServletResponse.SC_UNAUTHORIZED, "userDeleted");

        }
        try {
            Authentication authentication =
                    authenticationManager.authenticate(
                            new UsernamePasswordAuthenticationToken(
                                user.getEmail(),
                                user.getPassword()));
            SecurityContextHolder.getContext().setAuthentication(authentication);

            final String jwt = jwtUtil.generateToken(user.getEmail());
            session.setAttribute(HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY, SecurityContextHolder.getContext());
            session.setAttribute("user", user.getEmail());
            LogUtils.log("User authenticated: " + authentication.getName(), SeverityEnum.INFO);

            Authentication currentAuth = SecurityContextHolder.getContext().getAuthentication();

        if(foundUser.getIsFirstAccess()){
            return responseUtils.firstAccess(true,jwt);
        }
            return ResponseEntity.ok(new AuthenticationResponse(jwt));
        } catch (AuthenticationException e) {
            return responseUtils.customResponse(HttpServletResponse.SC_UNAUTHORIZED, "invalidCredentials");
        }
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(HttpSession session) {
        String email = (String) session.getAttribute("user");
        if (email != null) {
            User user = userService.findByEmail(email);
            return ResponseEntity.ok(userConverter.toDTO(user));
        } else {
            return ResponseEntity.status(HttpServletResponse.SC_UNAUTHORIZED)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body("{\"message\": \"TokenError\"}");
        }


    }

    @PostMapping("/logout")
    public String logout(HttpSession session) {
        String email = (String) session.getAttribute("user");
        LogUtils.log("User disconnected: " + email,SeverityEnum.INFO );
        session.invalidate();
        return "Logout successful";
    }


}
