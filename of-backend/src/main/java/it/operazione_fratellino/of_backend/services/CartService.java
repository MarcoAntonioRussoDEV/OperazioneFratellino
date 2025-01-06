package it.operazione_fratellino.of_backend.services;


import it.operazione_fratellino.of_backend.DTOs.RequestCartToPreorderDTO;
import it.operazione_fratellino.of_backend.entities.Attribute;
import it.operazione_fratellino.of_backend.entities.Cart;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface CartService {
    List<Cart> findAll();

    Page<Cart> findAll(PageRequest pageRequest);

    Cart findById(Integer id);
    Cart saveAndGet(Cart cart);


    void clear(Cart cart);

    ResponseEntity<String> addItem(String productCode, String userEmail);

    ResponseEntity<String> deleteItem(String productCode, String userEmail);

    ResponseEntity<String> increaseItem(String productCode, String userEmail);

    ResponseEntity<String> decreaseItem(String productCode, String userEmail);

    ResponseEntity<String> toPreorder(RequestCartToPreorderDTO request);
}
