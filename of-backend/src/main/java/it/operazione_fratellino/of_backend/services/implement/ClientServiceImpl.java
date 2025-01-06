package it.operazione_fratellino.of_backend.services.implement;

import it.operazione_fratellino.of_backend.components.ExceptionHandlerService;
import it.operazione_fratellino.of_backend.entities.Client;
import it.operazione_fratellino.of_backend.entities.User;
import it.operazione_fratellino.of_backend.repositories.ClientRepository;
import it.operazione_fratellino.of_backend.services.ClientService;
import it.operazione_fratellino.of_backend.utils.LogUtils;
import it.operazione_fratellino.of_backend.utils.SeverityEnum;
import lombok.extern.java.Log;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Log
@Service
public class ClientServiceImpl implements ClientService {

    @Autowired
    ClientRepository clientRepository;

    @Autowired
    ExceptionHandlerService exceptionHandlerService;

    @Override
    public Page<Client> findAll(PageRequest pageRequest) {
        try {
            return clientRepository.findAll(pageRequest);
        } catch (Exception e) {
            LogUtils.log("Errore durante il recupero dei clienti paginato: " + e.getMessage(), SeverityEnum.ERROR);
            throw new RuntimeException("Errore durante il recupero dei clienti paginato", e);
        }
    }

    @Override
    public Client findByEmail(String email) {
        return clientRepository.findByEmail(email).orElseGet(()->null);
    }

    @Override
    public Client findOrNew(User user){
        return clientRepository.findByEmail(user.getEmail()).orElseGet(()->clientRepository.save(new Client(user)));
    }

    @Override
    public ResponseEntity<String> save(Client client) {

        try {
            clientRepository.save(client);
            log.info("LOG: Creato cliente: " + client.getName());
            return new ResponseEntity<String>("Cliente salvato con successo", HttpStatus.CREATED);
        }catch(Exception e){
            log.info("LOG: Errore creazione cliente: " + client.getName());
            return exceptionHandlerService.handleException( e, client.getName());
        }
    }


    @Override
    public Client saveAndGet(Client client) {

        return clientRepository.save(client);
    }

    @Override
    public List<Client> findAll() {
        return clientRepository.findAll();
    }

    @Override
    public Client findById(Integer id){
        return clientRepository.findById(id).orElseThrow();
    }
}
