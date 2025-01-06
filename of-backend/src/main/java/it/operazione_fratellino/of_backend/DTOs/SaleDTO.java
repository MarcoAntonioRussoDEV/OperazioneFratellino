package it.operazione_fratellino.of_backend.DTOs;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class SaleDTO {

    private Integer id;
    private List<ProductSaleDTO> products;
    private String user;
    private Double sellingPrice;
    private Double profit;
    private Date createdAt;
    private String client;
}
