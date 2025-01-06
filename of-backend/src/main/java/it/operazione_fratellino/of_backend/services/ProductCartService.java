package it.operazione_fratellino.of_backend.services;

import it.operazione_fratellino.of_backend.entities.ProductCart;

public interface ProductCartService {
    ProductCart save(ProductCart productCart);

    void delete(ProductCart productCart);
}
