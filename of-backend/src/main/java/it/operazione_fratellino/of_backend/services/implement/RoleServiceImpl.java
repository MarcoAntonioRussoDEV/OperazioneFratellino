package it.operazione_fratellino.of_backend.services.implement;

import it.operazione_fratellino.of_backend.entities.Role;
import it.operazione_fratellino.of_backend.repositories.RoleRepository;
import it.operazione_fratellino.of_backend.services.RoleService;
import it.operazione_fratellino.of_backend.utils.LogUtils;
import it.operazione_fratellino.of_backend.utils.SeverityEnum;
import lombok.extern.java.Log;
import org.fusesource.jansi.Ansi;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Log
@Service
public class RoleServiceImpl implements RoleService {

    @Autowired
    private RoleRepository roleRepository;

    @Override
    public boolean exists(String role){
        return roleRepository.findByName(role).isPresent();
    }

    @Override
    public Role save(Role role){
        try {
            role = roleRepository.save(role);
            LogUtils.log(String.format("ROLE.SERVICE: created role %s",role.getName()), SeverityEnum.INFO);
            return role;
        } catch (Exception e) {
           LogUtils.log(String.format("ROLE.SERVICE: error creating role %s",role.getName()),SeverityEnum.ERROR);
            throw new RuntimeException(e);
        }
    }

    @Override
    public Role findByName(String name) {
        return roleRepository.findByName(name).orElseThrow();
    }

    @Override
    public List<Role> findAll(){
        return roleRepository.findAll();
    }


}
