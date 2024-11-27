package it.operazione_fratellino.of_backend.api;

import it.operazione_fratellino.of_backend.entities.User;
import it.operazione_fratellino.of_backend.repositories.UserRepository;
import it.operazione_fratellino.of_backend.services.UserService;
import it.operazione_fratellino.of_backend.services.implement.FileStoreService;
import jakarta.servlet.annotation.MultipartConfig;
import lombok.extern.java.Log;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

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


    @PostMapping("/set-avatar")
    public ResponseEntity<String> setAvatar(@RequestParam("avatar") MultipartFile file,
                                            @RequestParam("userEmail") String userEmail) throws IOException {
        User user = userService.findByEmail(userEmail);
        Integer userID = user.getId();
        String avatarPath = fileStoreService.saveAvatar(file, userID);
        user.setAvatar(avatarPath);
        userRepository.save(user);


        return new ResponseEntity<String>("Immagine caricata",HttpStatus.OK);
    }

    @GetMapping("/get-avatar/{userEmail}")
    @ResponseBody
    public ResponseEntity<Resource> getAvatar(@PathVariable String userEmail) {
        try {
            // Percorso della directory di upload
            Path filePath = Paths.get(userService.findByEmail(userEmail).getAvatar());

            Resource resource = new UrlResource(filePath.toUri());
            if (!resource.exists()) {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }

            // Determina il tipo di contenuto
            String contentType = Files.probeContentType(filePath);

            return ResponseEntity.ok()
                    .header("Content-Type", contentType != null ? contentType : "application/octet-stream")
                    .body(resource);
        } catch (IOException e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
