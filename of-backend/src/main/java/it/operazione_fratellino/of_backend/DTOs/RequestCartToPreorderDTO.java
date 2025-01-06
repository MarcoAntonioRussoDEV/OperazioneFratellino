package it.operazione_fratellino.of_backend.DTOs;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class RequestCartToPreorderDTO {

    private Integer id;
    private String user;
    private Integer client;
    private Date createdAt;
    private Date updatedAt;
    private Double totalPrice;
    private List<RequestProductsCartDTO> products;
}
