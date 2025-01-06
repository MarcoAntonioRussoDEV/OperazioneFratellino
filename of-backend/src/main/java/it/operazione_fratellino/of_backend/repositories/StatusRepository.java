package it.operazione_fratellino.of_backend.repositories;

import it.operazione_fratellino.of_backend.entities.Status;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface StatusRepository extends JpaRepository<Status, Integer> {

    Optional<Status> findByValue(String value);
}
