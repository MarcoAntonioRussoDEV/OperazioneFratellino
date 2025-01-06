package it.operazione_fratellino.of_backend.api;

import it.operazione_fratellino.of_backend.DTOs.UserDTO;
import it.operazione_fratellino.of_backend.entities.User;
import it.operazione_fratellino.of_backend.services.UserService;
import it.operazione_fratellino.of_backend.utils.DTOConverters.UserConverter;
import it.operazione_fratellino.of_backend.utils.LogUtils;
import it.operazione_fratellino.of_backend.utils.PaginateResponse;
import it.operazione_fratellino.of_backend.utils.PaginationUtils;
import it.operazione_fratellino.of_backend.utils.SeverityEnum;
import lombok.extern.java.Log;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Log
@RestController
@RequestMapping("/api/admin")
public class ApiAdminController {

    @Autowired
    private UserService userService;
    @Autowired
    private UserConverter userConverter;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private Environment env;

    @GetMapping("/users/all")
    public PaginateResponse<UserDTO> getAllUsers(@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size){
        return PaginationUtils.getAllEntities(page, size, userService::findAll, userConverter::toDTO);
    }

    @PatchMapping("/users/delete/{userEmail}")
    public ResponseEntity<String> deleteUser(@PathVariable String userEmail){
        User user;
        user = userService.findByEmail(userEmail);
        user.setIsDeleted(true);
        userService.patch(user);
        LogUtils.log("ADMIN.CONTROLLER: deleted user: " + user.getEmail(), SeverityEnum.WARNING);
        return new ResponseEntity<>("userDeleted",HttpStatus.OK);
    }

    @PatchMapping("/users/enable/{userEmail}")
    public ResponseEntity<String> enableUser(@PathVariable String userEmail){
        User user;
        user = userService.findByEmail(userEmail);
        user.setIsDeleted(false);
        userService.patch(user);
        LogUtils.log("ADMIN.CONTROLLER: enabled user: " + user.getEmail(), SeverityEnum.WARNING);
        return new ResponseEntity<>("userEnabled",HttpStatus.OK);
    }

    @PatchMapping("/users/reset-password/{userEmail}")
    public ResponseEntity<String> resetUserPassword(@PathVariable String userEmail){
        User user;
        user = userService.findByEmail(userEmail);
        user.setPassword(passwordEncoder.encode(env.getProperty("default.password")));
        user.setIsFirstAccess(true);
        userService.patch(user);
        LogUtils.log("ADMIN.CONTROLLER: reset password for user: " + user.getEmail(), SeverityEnum.WARNING);
        return new ResponseEntity<>("userPasswordReset",HttpStatus.OK);
    }



}
