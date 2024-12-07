package it.operazione_fratellino.of_backend.DTOs;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class RequestSaleDTO {

    private List<CartDTO> cart;
    private String userEmail;
}
