package it.operazione_fratellino.of_backend.utils.DTOConverters;

import it.operazione_fratellino.of_backend.DTOs.RoleDTO;
import it.operazione_fratellino.of_backend.entities.Role;
import it.operazione_fratellino.of_backend.repositories.RoleRepository;
import it.operazione_fratellino.of_backend.services.RoleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class RoleConverter {

    @Autowired
    UserConverter userConverter;
    @Autowired
    RoleService roleService;

    public RoleDTO toDTO(Role role){
        if(role == null){
            return null;
        }

        RoleDTO dto = new RoleDTO();
            dto.setName(role.getName());
            dto.setUsers(role.getUsers().stream().map(userConverter::toDTO).toList());

        return dto;
    }


    public Role toEntity(RoleDTO dto){
        if(roleService.findByName(dto.getName()) != null){
            return roleService.findByName(dto.getName());
        }

        Role role = new Role();
            role.setName(dto.getName());
            role.setUsers(dto.getUsers().stream().map(userConverter::toEntity).toList());
        return role;
    }
}
