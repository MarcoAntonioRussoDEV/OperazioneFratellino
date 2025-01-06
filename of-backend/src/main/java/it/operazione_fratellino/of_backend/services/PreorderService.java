package it.operazione_fratellino.of_backend.services;

import it.operazione_fratellino.of_backend.DTOs.RequestPreorderDTO;
import it.operazione_fratellino.of_backend.entities.Preorder;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface PreorderService {
    List<Preorder> findAll();

    Page<Preorder> findAll(PageRequest pageRequest);

    List<Preorder> findByUserEmail(String userEmail);

    Long countByStatus(String status);

    Preorder findById(Integer id);

    Preorder saveAndGet(Preorder preorder);

    ResponseEntity<String> updateStatus(Preorder preorder, String status);

    ResponseEntity<String> save(RequestPreorderDTO requestPreorderDTO);

    ResponseEntity<String> delete(Preorder preorder);

    @Transactional
    ResponseEntity<String> preorderToSale(Preorder preorder);
}
