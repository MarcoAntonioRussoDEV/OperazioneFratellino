package it.operazione_fratellino.of_backend.api;

import it.operazione_fratellino.of_backend.DTOs.SellDTO;
import it.operazione_fratellino.of_backend.entities.Sell;
import it.operazione_fratellino.of_backend.services.SellService;
import it.operazione_fratellino.of_backend.utils.DTOConverters.SellConverter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sells")
public class apiSellController {

    @Autowired
    private SellService sellService;
    @Autowired
    private SellConverter sellConverter;


    @GetMapping("/all")
    public List<SellDTO> getAllSells(){
        List<SellDTO> sells = sellService.getAll().stream().map(sellConverter::toDTO).toList();
        return sells;
    }

    @PostMapping("/create")
    public ResponseEntity<String> createSell(
            @RequestBody SellDTO sell
    ){
        return sellService.save(sellConverter.toEntity(sell));
    }
}
