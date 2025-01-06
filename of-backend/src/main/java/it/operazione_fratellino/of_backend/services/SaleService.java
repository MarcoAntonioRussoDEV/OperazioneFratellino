package it.operazione_fratellino.of_backend.services;

import it.operazione_fratellino.of_backend.DTOs.RequestSaleDTO;
import it.operazione_fratellino.of_backend.entities.Sale;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface SaleService {

    List<Sale> findAll();

    Page<Sale> findAll(PageRequest pageRequest);

    Sale findById(Integer id);
    ResponseEntity<String> save(RequestSaleDTO sale);
    ResponseEntity<String> delete(Sale sale);

}
