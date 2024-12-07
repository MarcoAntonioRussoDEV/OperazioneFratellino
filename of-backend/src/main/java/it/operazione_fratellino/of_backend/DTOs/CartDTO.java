package it.operazione_fratellino.of_backend.DTOs;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@NotNull
public class CartDTO {
    private String products;
    private Integer quantity;
}
