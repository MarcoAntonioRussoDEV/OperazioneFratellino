package it.operazione_fratellino.of_backend.services.implement;

import it.operazione_fratellino.of_backend.entities.Status;
import it.operazione_fratellino.of_backend.repositories.StatusRepository;
import it.operazione_fratellino.of_backend.services.StatusService;
import it.operazione_fratellino.of_backend.utils.LogUtils;
import it.operazione_fratellino.of_backend.utils.SeverityEnum;
import lombok.extern.java.Log;
import org.fusesource.jansi.Ansi;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;

@Log
@Service
public class StatusServiceImpl implements StatusService {

    @Autowired
    StatusRepository statusRepository;

    @Override
    public Status findByValue(String value){
        return statusRepository.findByValue(value).orElseThrow();
    }

    @Override
    public List<Status> findAll(){
        return statusRepository.findAll();
    }

    @Override
    public Page<Status> findAll(PageRequest pageRequest) {
        try {
            return statusRepository.findAll(pageRequest);
        } catch (Exception e) {
            LogUtils.log("Errore durante il recupero dello status paginato: " + e.getMessage(), SeverityEnum.ERROR);
            throw new RuntimeException("Errore durante il recupero dello status paginato", e);
        }
    }

    @Override
    public boolean exists(String status){
        return statusRepository.findByValue(status).isPresent();
    }

    @Override
    public Status save(Status status){
        try {
            log.info(Ansi.ansi().fg(Ansi.Color.BLUE.value()).a(String.format("STATUS.SERVICE: created status %s", status.getValue())).reset().toString());
            return statusRepository.save(status);
        } catch (Exception e) {
            log.severe(Ansi.ansi().fg(Ansi.Color.RED.value()).a(String.format("STATUS.SERVICE: error creating status %s",status.getValue())).reset().toString());
            throw new RuntimeException(e);
        }
    }
}
