package it.operazione_fratellino.of_backend.utils.DTOConverters;


import it.operazione_fratellino.of_backend.DTOs.ProductSaleDTO;
import it.operazione_fratellino.of_backend.entities.ProductSale;
import it.operazione_fratellino.of_backend.services.ProductService;
import it.operazione_fratellino.of_backend.services.SaleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ProductSaleConverter {

    @Autowired
    ProductService productService;
    @Autowired
    SaleService saleService;

    public ProductSaleDTO toDTO(ProductSale productSale){
        ProductSaleDTO dto = new ProductSaleDTO();

        dto.setId(productSale.getId());
        dto.setProduct(productSale.getProduct().getCode());
        dto.setQuantity(productSale.getQuantity());
        dto.setSale_id(productSale.getSale().getId());

        return dto;
    }

    public ProductSale toEntity(ProductSaleDTO dto){
        ProductSale productSale = new ProductSale();

        productSale.setId(dto.getId());
        productSale.setProduct(productService.findByCode(dto.getProduct()));
        productSale.setQuantity(dto.getQuantity());
        productSale.setSale(saleService.findById(dto.getSale_id()));

        return productSale;
    }
}
