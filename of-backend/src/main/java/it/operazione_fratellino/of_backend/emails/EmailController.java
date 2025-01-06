package it.operazione_fratellino.of_backend.emails;

import jakarta.mail.MessagingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/email")
public class EmailController {

    @Autowired
    private EmailService emailService;

    @PostMapping("/send")
    public ResponseEntity<String> sendEmail(@RequestParam("file") MultipartFile file,
                                    @RequestParam("to") String to,
                                    @RequestParam("subject") String subject,
                                    @RequestParam("text") String text
    ){
        try {
            emailService.sendEmailWithAttachment(to, subject, text, file);
            return new ResponseEntity<>("Email sent successfully", HttpStatus.OK);
        } catch (MessagingException | IOException e){
             e.printStackTrace();
            return new ResponseEntity<>("Failed to send email", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
