package it.operazione_fratellino.of_backend.DTOs;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.stereotype.Service;

import java.util.Date;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class UserDTO {
    private Integer id;
    private String name;
    private String email;
    private String city;
    private String role;
    private String phone;
    private byte[] avatar;
    private Integer cart;
    private Date createdAt;
    private Boolean isDeleted;
    private Boolean isFirstAccess;

}
