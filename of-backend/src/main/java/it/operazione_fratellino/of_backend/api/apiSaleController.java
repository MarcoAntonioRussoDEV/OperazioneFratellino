package it.operazione_fratellino.of_backend.api;

import it.operazione_fratellino.of_backend.DTOs.RequestSaleDTO;
import it.operazione_fratellino.of_backend.DTOs.SaleDTO;
import it.operazione_fratellino.of_backend.entities.Sale;
import it.operazione_fratellino.of_backend.services.SaleService;
import it.operazione_fratellino.of_backend.utils.DTOConverters.SaleConverter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sales")
public class apiSaleController {

    @Autowired
    private SaleService saleService;
    @Autowired
    private SaleConverter saleConverter;


    @GetMapping("/all")
    public List<SaleDTO> getAllSales(){
        List<SaleDTO> sales = saleService.getAll().stream().map(saleConverter::toDTO).toList();
        return sales;
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
