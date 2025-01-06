package it.operazione_fratellino.of_backend.utils.DTOConverters;

import it.operazione_fratellino.of_backend.DTOs.ClientDTO;
import it.operazione_fratellino.of_backend.entities.Client;
import it.operazione_fratellino.of_backend.entities.Sale;
import it.operazione_fratellino.of_backend.services.CartService;
import it.operazione_fratellino.of_backend.services.ClientService;
import it.operazione_fratellino.of_backend.services.SaleService;
import it.operazione_fratellino.of_backend.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class ClientConverter {

    @Autowired
    ClientService clientService;
    @Autowired
    UserService userService;
    @Autowired
    SaleService saleService;
    @Autowired
    CartService cartService;

    public ClientDTO toDTO(Client client){
        ClientDTO dto = new ClientDTO();

        dto.setId(client.getId());
        dto.setName(client.getName());
        dto.setEmail(client.getEmail());
        if(client.getUser() != null && client.getUser().getEmail() != null){
            dto.setUser(client.getUser().getEmail());
        }
        dto.setSales(client.getSale().stream().map(Sale::getId).toList());


        return dto;
    }


     public Client toEntity(ClientDTO dto){
         Client client = new Client();
         client.setName(dto.getName());
         client.setId(dto.getId());
         client.setEmail(dto.getEmail());
         client.setUser(userService.findByEmail(dto.getUser()));
         client.setSale(dto.getSales().stream().map(saleService::findById).toList());
         return client;
     }

}
