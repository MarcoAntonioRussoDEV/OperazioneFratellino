package it.operazione_fratellino.of_backend.utils.DTOConverters;

import it.operazione_fratellino.of_backend.DTOs.UserDTO;
import it.operazione_fratellino.of_backend.entities.User;
import it.operazione_fratellino.of_backend.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class UserConverter {

    @Autowired
    UserService userService;

    public UserDTO toDTO(User user){
        UserDTO dto = new UserDTO();
            dto.setName(user.getName());
            dto.setEmail(user.getEmail());
            dto.setCity(user.getCity().getName());
            dto.setRole(user.getRole().getName());
            dto.setAvatar(user.getAvatar());
        return dto;
    }

    public User toEntity(UserDTO dto){
        return userService.findByEmail(dto.getEmail());
    }
}
