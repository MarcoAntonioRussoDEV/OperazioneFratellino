package it.operazione_fratellino.of_backend.repositories;

import it.operazione_fratellino.of_backend.entities.Log;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

@Repository

public interface LogRepository extends JpaRepository<Log, Long> {

    public List<Log> findByMessage(String message);
    public List<Log> findBySeverity(String severity);
    public List<Log> findByCreatedAt(Date date);
    public List<Log> findByCaller(String caller);

}
