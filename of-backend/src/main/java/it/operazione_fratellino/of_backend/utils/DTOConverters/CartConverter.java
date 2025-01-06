package it.operazione_fratellino.of_backend.utils.DTOConverters;

import it.operazione_fratellino.of_backend.DTOs.CartDTO;
import it.operazione_fratellino.of_backend.DTOs.ProductCartDTO;
import it.operazione_fratellino.of_backend.DTOs.SellCartDTO;
import it.operazione_fratellino.of_backend.entities.Cart;
import it.operazione_fratellino.of_backend.entities.ProductCart;
import it.operazione_fratellino.of_backend.services.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class CartConverter {

    @Autowired
    private CartService cartService;

    public Cart toEntity(CartDTO dto){
        return cartService.findById(dto.getId());

    }

    public CartDTO toDTO(Cart cart){
        CartDTO dto = new CartDTO();

        dto.setId(cart.getId());
        dto.setUser(cart.getUser().getId());
        dto.setTotalPrice(cart.getTotalPrice());
        dto.setCreatedAt(cart.getCreatedAt());
        dto.setUpdatedAt(cart.getUpdatedAt());


        List<ProductCartDTO> productCartDTOList = new ArrayList<>();
        for(ProductCart productCart : cart.getProductCarts()){
            ProductCartDTO productCartDTO = new ProductCartDTO();
            productCartDTO.setId(productCart.getId());
            productCartDTO.setQuantity(productCart.getQuantity());
            productCartDTO.setProduct(productCart.getProduct().getCode());
            productCartDTO.setCart(productCart.getCart().getId());
            productCartDTO.setPrice(productCart.getProduct().getSellingPrice());

            productCartDTOList.add(productCartDTO);
        }
        dto.setProducts(productCartDTOList);

        return dto;
    }

}
