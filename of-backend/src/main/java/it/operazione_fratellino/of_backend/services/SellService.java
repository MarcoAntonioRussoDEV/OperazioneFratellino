package it.operazione_fratellino.of_backend.services;

import it.operazione_fratellino.of_backend.entities.Sell;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

public interface SellService {

    List<Sell> getAll();
    ResponseEntity<String> save(Sell sell);
    Sell saveAndGet(Sell sell);

}
