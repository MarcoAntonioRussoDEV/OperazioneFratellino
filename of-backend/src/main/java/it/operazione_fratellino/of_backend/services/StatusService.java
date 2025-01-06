package it.operazione_fratellino.of_backend.services;

import it.operazione_fratellino.of_backend.entities.Status;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;

import java.util.List;
import java.util.Optional;

public interface StatusService {
    Status findByValue(String value);

    List<Status> findAll();

    Page<Status> findAll(PageRequest pageRequest);

    boolean exists(String status);

    Status save(Status status);
}
