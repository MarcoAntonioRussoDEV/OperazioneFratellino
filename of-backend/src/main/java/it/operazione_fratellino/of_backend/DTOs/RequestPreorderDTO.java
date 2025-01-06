package it.operazione_fratellino.of_backend.DTOs;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class RequestPreorderDTO {

    private List<PreorderCartDTO> preorderCart;
    private String userEmail;
    private String clientName;
    private String clientEmail;
    private String status;

}
