package it.operazione_fratellino.of_backend.api;

import it.operazione_fratellino.of_backend.DTOs.RequestUserDTO;
import it.operazione_fratellino.of_backend.DTOs.UserDTO;
import it.operazione_fratellino.of_backend.entities.User;
import it.operazione_fratellino.of_backend.exceptions.InvalidOldPasswordException;
import it.operazione_fratellino.of_backend.repositories.UserRepository;
import it.operazione_fratellino.of_backend.services.UserService;
import it.operazione_fratellino.of_backend.services.implement.FileStoreService;
import it.operazione_fratellino.of_backend.utils.DTOConverters.UserConverter;
import it.operazione_fratellino.of_backend.utils.ResponseUtils;
import lombok.extern.java.Log;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@Log
@RequestMapping("/api/user")
public class UserController {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    FileStoreService fileStoreService;
    @Autowired
    UserService userService;
    @Autowired
    Environment env;
    @Autowired
    UserConverter userConverter;
    @Autowired
    ResponseUtils responseUtils;


    @PostMapping("/set-avatar")
    public ResponseEntity<String> setAvatarBlob(@RequestParam("avatar") MultipartFile file,
                                                @RequestParam("userEmail") String userEmail) throws IOException {
        User user = userService.findByEmail(userEmail);
        user.setAvatar(file.getBytes());
        userRepository.save(user);


        return new ResponseEntity<String>("Immagine caricata", HttpStatus.OK);
    }


    @GetMapping("/by-email/{email}")
    public UserDTO getUserByEmail(@PathVariable String email) {
        return userConverter.toDTO(userRepository.findByEmail(email).orElseThrow());
    }

    /**
     * Edit an existing user
     *
     * @param user Request from frontend of type RequestUserDTO
     * @return Response of type string to be visualized in a toast from frontend
     * @author Marco Antonio Russo
     * @see RequestUserDTO
     * @see UserService {@link UserService#patch(RequestUserDTO, User)}
     * @since 20/12/2024
     */
    @PatchMapping("/edit-user")
    public ResponseEntity<String> editUser(@RequestBody RequestUserDTO user) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User loggedUser = null;

        if (authentication != null && authentication.getPrincipal() instanceof UserDetails userDetails) {
            loggedUser = userService.findByEmail(userDetails.getUsername());
        }
        try {
            userService.patch(user, loggedUser);
            return ResponseEntity.ok("Utente modificato");
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @ExceptionHandler(UsernameNotFoundException.class)
    public ResponseEntity<String> handleUsernameNotFoundException(UsernameNotFoundException usernameNotFoundException) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(usernameNotFoundException.getLocalizedMessage());
    }

    @ExceptionHandler(InvalidOldPasswordException.class)
    public ResponseEntity<String> handleInvalidOldPasswordException(InvalidOldPasswordException invalidOldPasswordException) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(invalidOldPasswordException.getLocalizedMessage());
    }


}
