package it.operazione_fratellino.of_backend.DTOs;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
public class PreorderDTO {

    private Integer id;
    private String user;
    private String client;
    private List<ProductPreorderDTO> products;
    private Double totalPrice;
    private String status;
    private Date createdAt;

}
