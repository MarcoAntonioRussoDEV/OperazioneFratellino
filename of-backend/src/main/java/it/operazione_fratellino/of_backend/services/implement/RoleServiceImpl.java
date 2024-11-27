package it.operazione_fratellino.of_backend.services.implement;

import it.operazione_fratellino.of_backend.entities.Role;
import it.operazione_fratellino.of_backend.repositories.RoleRepository;
import it.operazione_fratellino.of_backend.services.RoleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class RoleServiceImpl implements RoleService {

    @Autowired
    private RoleRepository roleRepository;

    @Override
    public Role findByName(String name) {
        return roleRepository.findByName(name);
    }
}
