package it.operazione_fratellino.of_backend.services;

import it.operazione_fratellino.of_backend.entities.User;

public interface UserService {
    User findByEmail(String  email);
    User save(User user);
}
