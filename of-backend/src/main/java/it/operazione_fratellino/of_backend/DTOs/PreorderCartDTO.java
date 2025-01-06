package it.operazione_fratellino.of_backend.DTOs;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class PreorderCartDTO {
//    private String product;
    private Integer product;
    private Integer quantity;
}
