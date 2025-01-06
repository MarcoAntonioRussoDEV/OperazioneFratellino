package it.operazione_fratellino.of_backend.services.implement;

import it.operazione_fratellino.of_backend.entities.ProductCart;
import it.operazione_fratellino.of_backend.repositories.ProductCartRepository;
import it.operazione_fratellino.of_backend.services.ProductCartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ProductCartServiceImpl implements ProductCartService {
    @Autowired
    ProductCartRepository productCartRepository;

    @Override
    public ProductCart save(ProductCart productCart) {
        return productCartRepository.save(productCart);
    }

    @Override
    public void delete(ProductCart productCart){
        productCartRepository.delete(productCart);
    }
}
