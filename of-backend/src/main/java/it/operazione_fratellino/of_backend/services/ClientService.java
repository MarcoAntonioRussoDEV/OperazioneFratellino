package it.operazione_fratellino.of_backend.services;


import it.operazione_fratellino.of_backend.entities.Client;
import it.operazione_fratellino.of_backend.entities.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface ClientService {


    Client findOrNew(User user);

    ResponseEntity<String> save(Client client);

    Client saveAndGet(Client client);

    List<Client> findAll();

    Page<Client> findAll(PageRequest pageRequest);

    Client findByEmail(String email);

    Client findById(Integer id);
}
