package it.operazione_fratellino.of_backend.utils.DTOConverters;

import it.operazione_fratellino.of_backend.DTOs.PreorderDTO;
import it.operazione_fratellino.of_backend.DTOs.ProductPreorderDTO;
import it.operazione_fratellino.of_backend.entities.Preorder;
import it.operazione_fratellino.of_backend.entities.ProductPreorder;
import it.operazione_fratellino.of_backend.services.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class PreorderConverter {

    @Autowired
    UserService userService;
    @Autowired
    ClientService clientService;
    @Autowired
    StatusService statusService;
    @Autowired
    PreorderService preorderService;
    @Autowired
    ProductService productService;

    public Preorder toEntity(PreorderDTO dto){
        Preorder preorder = new Preorder();
        preorder.setId(dto.getId());
        preorder.setUser(userService.findByEmail(dto.getUser()));
        preorder.setClient(clientService.findByEmail(dto.getClient()));
        preorder.setStatus(statusService.findByValue(dto.getStatus()));
        preorder.setCreatedAt(dto.getCreatedAt());
        preorder.setTotalPrice(dto.getTotalPrice());

        List<ProductPreorder> productPreorderList = new ArrayList<>();
        for(ProductPreorderDTO ppDTO : dto.getProducts()){
            ProductPreorder pp = new ProductPreorder();
            pp.setId(ppDTO.getId());
            pp.setQuantity(ppDTO.getQuantity());
            pp.setProduct(productService.findByCode(ppDTO.getProduct()));
            pp.setPreorder(preorderService.findById(ppDTO.getPreorderId()));

            productPreorderList.add(pp);
        }
        preorder.setProductPreorders(productPreorderList);

        return preorder;
    }

    public PreorderDTO toDTO(Preorder preorder){
        PreorderDTO dto = new PreorderDTO();
        dto.setId(preorder.getId());
        dto.setClient(preorder.getClient().getEmail());
        dto.setUser(preorder.getUser().getEmail());
        dto.setStatus(preorder.getStatus().getValue());
        dto.setTotalPrice(preorder.getTotalPrice());
        dto.setCreatedAt(preorder.getCreatedAt());

        List<ProductPreorderDTO> productPreorderDTOList = new ArrayList<>();
        for(ProductPreorder pp : preorder.getProductPreorders()){
            ProductPreorderDTO ppDTO = new ProductPreorderDTO();
            ppDTO.setId(pp.getId());
            ppDTO.setPreorderId(pp.getPreorder().getId());
            ppDTO.setQuantity(pp.getQuantity());
            ppDTO.setProduct(pp.getProduct().getCode());

            productPreorderDTOList.add(ppDTO);
        }
        dto.setProducts(productPreorderDTOList);

        return dto;

    }

}
