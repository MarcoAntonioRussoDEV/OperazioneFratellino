package it.operazione_fratellino.of_backend.DTOs;

import it.operazione_fratellino.of_backend.entities.User;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class RoleDTO {
    private String name;
    private List<UserDTO> users;
}
