package it.operazione_fratellino.of_backend.utils.DTOConverters;

import it.operazione_fratellino.of_backend.DTOs.PublicUserDTO;
import it.operazione_fratellino.of_backend.DTOs.RequestUserDTO;
import it.operazione_fratellino.of_backend.DTOs.UserDTO;
import it.operazione_fratellino.of_backend.entities.User;
import it.operazione_fratellino.of_backend.services.CityService;
import it.operazione_fratellino.of_backend.services.RoleService;
import it.operazione_fratellino.of_backend.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class UserConverter {

    @Autowired
    UserService userService;
    @Autowired
    CityService cityService;
    @Autowired
    RoleService roleService;
    @Autowired
    PasswordEncoder passwordEncoder;

    public UserDTO toDTO(User user){
        UserDTO dto = new UserDTO();
            dto.setId(user.getId());
            dto.setName(user.getName());
            dto.setEmail(user.getEmail());
            dto.setCity(user.getCity().getName());
            dto.setRole(user.getRole().getName());
            dto.setAvatar(user.getAvatar());
            dto.setCreatedAt(user.getCreatedAt());
            dto.setIsDeleted(user.getIsDeleted());
            dto.setIsFirstAccess(user.getIsFirstAccess());
            dto.setPhone(user.getPhone());
            dto.setCart(user.getCart().getId());
        return dto;
    }

    public User toEntity(UserDTO dto){
        return userService.findByEmail(dto.getEmail());
    }

    public PublicUserDTO toPublicDTO(User user){
        PublicUserDTO dto = new PublicUserDTO();
            dto.setName(user.getName());
            dto.setEmail(user.getEmail());

        return dto;
    }
}
