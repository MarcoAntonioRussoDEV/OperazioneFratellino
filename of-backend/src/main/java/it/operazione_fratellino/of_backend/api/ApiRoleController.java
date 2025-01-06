package it.operazione_fratellino.of_backend.api;

import it.operazione_fratellino.of_backend.DTOs.RoleDTO;
import it.operazione_fratellino.of_backend.services.RoleService;
import it.operazione_fratellino.of_backend.utils.DTOConverters.RoleConverter;
import lombok.extern.java.Log;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@Log
@RequestMapping("/api/roles")
public class ApiRoleController {

    @Autowired
    private RoleService roleService;
    @Autowired
    private RoleConverter roleConverter;


    @GetMapping("/all")
    public List<RoleDTO> getAllRoles(){
        return roleService.findAll().stream().map(roleConverter::toDTO).toList();
    }

    @GetMapping("/by-name/{roleName}")
    public RoleDTO findRoleByName(@PathVariable String roleName){
        return roleConverter.toDTO(roleService.findByName(roleName));
    }

}
