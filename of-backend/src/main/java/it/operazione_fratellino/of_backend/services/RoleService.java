package it.operazione_fratellino.of_backend.services;

import it.operazione_fratellino.of_backend.entities.Role;

public interface RoleService {
    Role findByName(String name);
}
