package it.operazione_fratellino.of_backend.services;

import it.operazione_fratellino.of_backend.entities.Role;

import java.util.List;

public interface RoleService {
    boolean exists(String role);

    Role save(Role role);

    Role findByName(String name);

    List<Role> findAll();
}
