package it.operazione_fratellino.of_backend.services;

import it.operazione_fratellino.of_backend.DTOs.RequestSaleDTO;
import it.operazione_fratellino.of_backend.entities.Sale;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface SaleService {

    List<Sale> getAll();
    Sale findById(Integer id);
    ResponseEntity<String> save(RequestSaleDTO sale);
    ResponseEntity<String> delete(Sale sale);

}
