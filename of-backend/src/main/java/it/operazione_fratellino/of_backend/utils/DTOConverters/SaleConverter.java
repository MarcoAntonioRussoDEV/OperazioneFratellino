package it.operazione_fratellino.of_backend.utils.DTOConverters;

import it.operazione_fratellino.of_backend.DTOs.SaleDTO;
import it.operazione_fratellino.of_backend.entities.Product;
import it.operazione_fratellino.of_backend.entities.ProductSale;
import it.operazione_fratellino.of_backend.entities.Sale;
import it.operazione_fratellino.of_backend.repositories.ProductRepository;
import it.operazione_fratellino.of_backend.repositories.ProductSaleRepository;
import it.operazione_fratellino.of_backend.services.ClientService;
import it.operazione_fratellino.of_backend.services.ProductSaleService;
import it.operazione_fratellino.of_backend.services.ProductService;
import it.operazione_fratellino.of_backend.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class SaleConverter {

    @Autowired
    ProductService productService;
    @Autowired
    UserService userService;
    @Autowired
    ProductSaleService productSaleService;
    @Autowired
    ProductSaleConverter productSaleConverter;
    @Autowired
    ClientService clientService;

    public SaleDTO toDTO(Sale sale){
        SaleDTO dto = new SaleDTO();
        dto.setId(sale.getId());
        dto.setUser(sale.getUser().getEmail());
        dto.setSellingPrice(sale.getTotal_price());
        dto.setProfit(sale.getProfit());
        dto.setCreatedAt(sale.getCreatedAt());
        dto.setClient(sale.getClient().getEmail());

        dto.setProducts(sale.getProductSale().stream().map(productSaleConverter::toDTO).toList()); //TODO


        return dto;
    }

    public Sale toEntity(SaleDTO dto){
        Sale sale = new Sale();

        sale.setId(dto.getId());
        sale.setProductSale(dto.getProducts().stream().map(productSaleConverter::toEntity).toList());
        sale.setUser(userService.findByEmail(dto.getUser()));
        sale.setTotal_price(dto.getSellingPrice());
        sale.setProfit(dto.getProfit());
        sale.setCreatedAt(dto.getCreatedAt());
        sale.setClient(clientService.findByEmail(dto.getClient()));


        return sale;
    }
}
