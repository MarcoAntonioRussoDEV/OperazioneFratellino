package it.operazione_fratellino.of_backend.api;

import it.operazione_fratellino.of_backend.DTOs.RequestSaleDTO;
import it.operazione_fratellino.of_backend.DTOs.SaleDTO;
import it.operazione_fratellino.of_backend.services.SaleService;
import it.operazione_fratellino.of_backend.utils.DTOConverters.SaleConverter;
import it.operazione_fratellino.of_backend.utils.PaginateResponse;
import it.operazione_fratellino.of_backend.utils.PaginationUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sales")
public class ApiSaleController {

    @Autowired
    private SaleService saleService;
    @Autowired
    private SaleConverter saleConverter;


    @GetMapping("/all")
    public PaginateResponse<SaleDTO> getAllSales(@RequestParam(defaultValue = "0") Integer page, @RequestParam(defaultValue = "10") Integer size){
        return PaginationUtils.getAllEntities(page, size, saleService::findAll, saleConverter::toDTO);

    }

    @PostMapping("/create")
    public ResponseEntity<String> createSale(
            @RequestBody RequestSaleDTO sale
    ){

        return saleService.save(sale);
    }
    @PostMapping("/delete/{saleID}")
    public ResponseEntity<String> deleteSale(
            @PathVariable Integer saleID
    ){

        return saleService.delete(saleService.findById(saleID));
    }
}
