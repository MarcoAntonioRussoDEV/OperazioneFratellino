package it.operazione_fratellino.of_backend.utils.DTOConverters;

import it.operazione_fratellino.of_backend.DTOs.SellDTO;
import it.operazione_fratellino.of_backend.entities.Sell;
import it.operazione_fratellino.of_backend.repositories.ProductRepository;
import it.operazione_fratellino.of_backend.services.ProductService;
import it.operazione_fratellino.of_backend.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class SellConverter {

    @Autowired
    ProductService productService;
    @Autowired
    UserService userService;


    public SellDTO toDTO(Sell sell){
        SellDTO dto = new SellDTO();
        dto.setId(sell.getId());
        dto.setProduct_code(sell.getProduct().getCode());
        dto.setUser_email(sell.getUser().getEmail());
        dto.setQuantity(sell.getQuantity());
        dto.setTotal_price(sell.getTotal_price());
        dto.setCreated_at(sell.getCreated_at());


        return dto;
    }

    public Sell toEntity(SellDTO dto){
        Sell sell = new Sell();

        sell.setId(dto.getId());
        sell.setProduct(productService.findByCode(dto.getProduct_code()));
        sell.setUser(userService.findByEmail(dto.getUser_email()));
        sell.setQuantity(dto.getQuantity());
        sell.setTotal_price(dto.getTotal_price());
        sell.setCreated_at(dto.getCreated_at());


        return sell;
    }
}
