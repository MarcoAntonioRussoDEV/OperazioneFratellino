package it.operazione_fratellino.of_backend.services.implement;

import it.operazione_fratellino.of_backend.entities.Log;
import it.operazione_fratellino.of_backend.repositories.LogRepository;
import it.operazione_fratellino.of_backend.services.LogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
public class LogServiceImpl implements LogService {


    @Autowired
    private LogRepository logRepository;


    @Override
    public void delete(Log log) {

    }

    @Override
    public List<Log> findAll() {
        return logRepository.findAll();
    }

    @Override
    public Page<Log> findAll(PageRequest pageRequest) {
        return logRepository.findAll(pageRequest);
    }

    @Override
    public List<Log> findBySeverity(String severity) {
        return List.of();
    }

    @Override
    public List<Log> findByCaller(String caller) {
        return List.of();
    }

    @Override
    public List<Log> findByCreatedAt(Date date) {
        return List.of();
    }

    @Override
    public List<Log> findByMessage(String message) {
        return List.of();
    }

    @Override
    public List<Log> findBySeverityAndCaller(String severity, String caller) {
        return List.of();
    }

    @Override
    public List<Log> findBySeverityAndCreatedAt(String severity, Date date) {
        return List.of();
    }

    @Override
    public List<Log> findBySeverityAndMessage(String severity, String message) {
        return List.of();
    }

    @Override
    public List<Log> findByCallerAndCreatedAt(String caller, Date date) {
        return List.of();
    }

    @Override
    public List<Log> findByCallerAndMessage(String caller, String message) {
        return List.of();
    }

    @Override
    public List<Log> findByCreatedAtAndMessage(Date date, String message) {
        return List.of();
    }

    @Override
    public List<Log> findBySeverityAndCallerAndCreatedAt(String severity, String caller, Date date) {
        return List.of();
    }

    @Override
    public List<Log> findBySeverityAndCallerAndMessage(String severity, String caller, String message) {
        return List.of();
    }

    @Override
    public List<Log> findBySeverityAndCreatedAtAndMessage(String severity, Date date, String message) {
        return List.of();
    }

    @Override
    public List<Log> findByCallerAndCreatedAtAndMessage(String caller, Date date, String message) {
        return List.of();
    }

    @Override
    public List<Log> findBySeverityAndCallerAndCreatedAtAndMessage(String severity, String caller, Date date, String message) {
        return List.of();
    }

    @Override
    public Log findById(Long id) {
        return null;
    }

    @Override
    public void save(Log log) {
        logRepository.save(log);
    }
}
