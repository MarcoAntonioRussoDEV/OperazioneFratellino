package it.operazione_fratellino.of_backend.DTOs;

import it.operazione_fratellino.of_backend.entities.User;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class SellDTO {

    private Integer id;
    private String product_code;
    private String user_email;
    private Integer quantity;
    private Double total_price;
    private Date created_at;
}
