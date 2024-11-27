package it.operazione_fratellino.of_backend.security;

import it.operazione_fratellino.of_backend.DTOs.UserDTO;
import it.operazione_fratellino.of_backend.entities.User;
import it.operazione_fratellino.of_backend.services.UserService;
import it.operazione_fratellino.of_backend.utils.DTOConverters.UserConverter;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.web.bind.annotation.*;

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


    @PostMapping("/register")
    public String register(@RequestBody User user) {
        User existingUser = userService.findByEmail(user.getEmail());
        if (existingUser != null) {
            return "Email already exists";
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userService.save(user);
        return "User registered successfully";
    }

    @PostMapping("/login")
    public String login(@RequestBody User user, HttpSession session) {
        try {
            Authentication authentication =
                    authenticationManager.authenticate(
                            new UsernamePasswordAuthenticationToken(
                                user.getEmail(),
                                user.getPassword()));
            SecurityContextHolder.getContext().setAuthentication(authentication);
            session.setAttribute(HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY, SecurityContextHolder.getContext());
            session.setAttribute("user", user.getEmail());
            System.out.println("User authenticated: " + authentication.getName());
            // Verifica manuale dell'autenticazione
            Authentication currentAuth = SecurityContextHolder.getContext().getAuthentication();
            System.out.println("Current Authentication: " + currentAuth.isAuthenticated());
            return "Login successful";
        } catch (AuthenticationException e) {
            return "Invalid credentials";
        }
    }

    @GetMapping("/me")
    public ResponseEntity<UserDTO> getCurrentUser(HttpSession session) {
        String email = (String) session.getAttribute("user");
        if (email != null) {
            User user = userService.findByEmail(email);
            return ResponseEntity.ok(userConverter.toDTO(user));
        } else {
            return ResponseEntity.status(401).body(null);
        }
    }

    @PostMapping("/logout")
    public String logout(HttpSession session) {
        session.invalidate();
        return "Logout successful";
    }

}
