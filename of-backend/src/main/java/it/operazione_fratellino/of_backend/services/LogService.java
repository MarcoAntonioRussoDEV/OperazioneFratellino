package it.operazione_fratellino.of_backend.services;

import it.operazione_fratellino.of_backend.entities.Log;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;

import java.util.Date;
import java.util.List;

public interface LogService {

    List<Log> findAll();
    Page<Log> findAll(PageRequest pageRequest);
    List<Log> findBySeverity(String severity);
    List<Log> findByCaller(String caller);
    List<Log> findByCreatedAt(Date date);
    List<Log> findByMessage(String message);
    List<Log> findBySeverityAndCaller(String severity, String caller);
    List<Log> findBySeverityAndCreatedAt(String severity, Date date);
    List<Log> findBySeverityAndMessage(String severity, String message);
    List<Log> findByCallerAndCreatedAt(String caller, Date date);
    List<Log> findByCallerAndMessage(String caller, String message);
    List<Log> findByCreatedAtAndMessage(Date date, String message);
    List<Log> findBySeverityAndCallerAndCreatedAt(String severity, String caller, Date date);
    List<Log> findBySeverityAndCallerAndMessage(String severity, String caller, String message);
    List<Log> findBySeverityAndCreatedAtAndMessage(String severity, Date date, String message);
    List<Log> findByCallerAndCreatedAtAndMessage(String caller, Date date, String message);
    List<Log> findBySeverityAndCallerAndCreatedAtAndMessage(String severity, String caller, Date date, String message);
    Log findById(Long id);
    void save(Log log);
    void delete(Log log);


}
