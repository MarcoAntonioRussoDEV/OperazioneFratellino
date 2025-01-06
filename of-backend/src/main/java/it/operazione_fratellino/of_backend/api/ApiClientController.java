package it.operazione_fratellino.of_backend.api;

import it.operazione_fratellino.of_backend.DTOs.ClientDTO;
import it.operazione_fratellino.of_backend.entities.Client;
import it.operazione_fratellino.of_backend.services.ClientService;
import it.operazione_fratellino.of_backend.utils.DTOConverters.ClientConverter;
import it.operazione_fratellino.of_backend.utils.PaginateResponse;
import it.operazione_fratellino.of_backend.utils.PaginationUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/client")
public class ApiClientController {

    @Autowired
    ClientService clientService;
    @Autowired
    ClientConverter clientConverter;

    @GetMapping("/all")
    public PaginateResponse<ClientDTO> getAllClient(@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size){
        return PaginationUtils.getAllEntities(page, size, clientService::findAll, clientConverter::toDTO);
    }

    @GetMapping("/by-email/{email}")
    public ClientDTO findClientByEmail(@PathVariable String email){
        return clientConverter.toDTO(clientService.findByEmail(email));
    }

}
