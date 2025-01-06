package it.operazione_fratellino.of_backend.services;

import it.operazione_fratellino.of_backend.DTOs.RequestUserDTO;
import it.operazione_fratellino.of_backend.entities.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;

import java.util.List;

public interface UserService {
    User findByEmail(String  email);

    User findById(Integer id);

    User save(User user);
    List<User> findAll();




    void createAdmin(String email, String password, String role, String city, String phone);

    boolean exists(String email);

    Page<User> findAll(PageRequest pageRequest);


    User patch(RequestUserDTO user, User loggedUser);

    User patch(User user);
}
