package it.operazione_fratellino.of_backend.services.implement;

import it.operazione_fratellino.of_backend.entities.ProductSale;
import it.operazione_fratellino.of_backend.repositories.ProductSaleRepository;
import it.operazione_fratellino.of_backend.services.ProductSaleService;
import it.operazione_fratellino.of_backend.services.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ProductSaleServiceImpl implements ProductSaleService {

    @Autowired
    ProductSaleRepository productSaleRepository;

    @Override
    public ProductSale findById(Integer id) {
        return productSaleRepository.findById(id);
    }
}
