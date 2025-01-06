package it.operazione_fratellino.of_backend.utils;

import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;

@Component
public class ResponseUtils {

    public ResponseEntity<?> customResponse(Integer status, String message){
       return ResponseEntity.status(status)
                .contentType(MediaType.APPLICATION_JSON)
                .body("{\"message\": \"" + message + "\"}");
    }

    public ResponseEntity<?> firstAccess(Boolean isFirstAccess, String jwt){
       return ResponseEntity.status(HttpStatus.OK)
                .contentType(MediaType.APPLICATION_JSON)
                .body("{\"isFirstAccess\": \"" + isFirstAccess + "\", \"jwt\": \"" + jwt + "\"}");
    }
}
