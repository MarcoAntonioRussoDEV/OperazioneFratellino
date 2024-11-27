package it.operazione_fratellino.of_backend.services.implement;

import it.operazione_fratellino.of_backend.components.ExceptionHandlerService;
import it.operazione_fratellino.of_backend.entities.Sell;
import it.operazione_fratellino.of_backend.repositories.SellRepository;
import it.operazione_fratellino.of_backend.services.SellService;
import lombok.extern.java.Log;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Log
@Service
public class SellServiceImpl implements SellService {

    @Autowired
    private SellRepository sellRepository;
    @Autowired
    ExceptionHandlerService exceptionHandlerService;

    @Override
    public List<Sell> getAll() {
        return sellRepository.findAll();
    }

    @Override
    public ResponseEntity<String> save(Sell sell) {
        try {
            sellRepository.save(sell);
            log.info("LOG: Creata vendita: " + sell.getProduct().getName());
            return new ResponseEntity<String>("vendita salvata con successo", HttpStatus.CREATED);
        }catch(Exception e){
            log.info("LOG: Errore creazione vendita: " + sell.getProduct().getName());
            return exceptionHandlerService.handleException( e, sell.getProduct().getName());
        }
    }

    @Override
    public Sell saveAndGet(Sell sell) {
        Sell savedSell = sellRepository.save(sell);
        return savedSell;
    }
}
