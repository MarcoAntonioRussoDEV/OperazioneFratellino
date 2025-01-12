package it.operazione_fratellino.of_backend.services.implement;

import it.operazione_fratellino.of_backend.entities.ProductPreorder;
import it.operazione_fratellino.of_backend.repositories.ProductPreorderRepository;
import it.operazione_fratellino.of_backend.services.LogService;
import it.operazione_fratellino.of_backend.services.ProductPreorderService;
import it.operazione_fratellino.of_backend.utils.LogUtils;
import it.operazione_fratellino.of_backend.utils.SeverityEnum;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductPreorderServiceImpl implements ProductPreorderService {
    @Autowired
    ProductPreorderRepository productPreorderRepository;
    @Autowired
    private LogService logService;

    @Override
    public List<ProductPreorder> findAll(){
        return productPreorderRepository.findAll();
    }

    @Override
    public Page<ProductPreorder> findAll(PageRequest pageRequest) {
        try {
            return productPreorderRepository.findAll(pageRequest);
        } catch (Exception e) {
            LogUtils.log("Errore durante il recupero del product_preorder paginato: " + e.getMessage(), SeverityEnum.ERROR, logService, "ProductPreorderServiceImpl");
            throw new RuntimeException("Errore durante il recupero del product_preorder paginato", e);
        }
    }

    @Override
    public ProductPreorder findById(Integer id){
        return productPreorderRepository.findById(id).orElseThrow();
    }

    @Override
    public ProductPreorder saveAndGet(ProductPreorder productPreorder){
        return productPreorderRepository.save(productPreorder);
    }

}
