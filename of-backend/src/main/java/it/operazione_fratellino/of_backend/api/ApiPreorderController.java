package it.operazione_fratellino.of_backend.api;

import it.operazione_fratellino.of_backend.DTOs.PreorderCartDTO;
import it.operazione_fratellino.of_backend.DTOs.PreorderDTO;
import it.operazione_fratellino.of_backend.DTOs.RequestPreorderDTO;
import it.operazione_fratellino.of_backend.DTOs.RequestSaleDTO;
import it.operazione_fratellino.of_backend.entities.Preorder;
import it.operazione_fratellino.of_backend.services.PreorderService;
import it.operazione_fratellino.of_backend.services.ProductService;
import it.operazione_fratellino.of_backend.utils.DTOConverters.PreorderConverter;
import it.operazione_fratellino.of_backend.utils.PaginateResponse;
import it.operazione_fratellino.of_backend.utils.PaginationUtils;
import lombok.extern.java.Log;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@Log
@RequestMapping("/api/preorders")
public class ApiPreorderController {

    @Autowired
    private PreorderService preorderService;
    @Autowired
    private ProductService productService;
    @Autowired
    private PreorderConverter preorderConverter;

    @GetMapping("/all")
    public PaginateResponse<PreorderDTO> getAllPreorders(@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size){
        return PaginationUtils.getAllEntities(page, size, preorderService::findAll, preorderConverter::toDTO);
    }

    @GetMapping("/my-preorders/{userEmail}")
    public List<PreorderDTO> getMyPreorders(@PathVariable String userEmail){
        return preorderService.findByUserEmail(userEmail).stream().map(preorderConverter::toDTO).toList();
    }

    @GetMapping("/count-by-status/{status}")
    public Long countByStatus(@PathVariable String status){
      return preorderService.countByStatus(status);
    }

    @PostMapping("/delete/{preorderID}")
    public ResponseEntity<String> deletePreorder(@PathVariable Integer preorderID){
        return preorderService.delete(preorderService.findById(preorderID));
    }

    @PatchMapping("/update-status/{preorderID}/{status}")
    public ResponseEntity<String> updatePreorderStatus(@PathVariable Integer preorderID, @PathVariable String status){
        Preorder preorder = preorderService.findById(preorderID);
        return preorderService.updateStatus(preorder, status);
    }

    @PostMapping("/create")
    public ResponseEntity<String> createSale(
            @RequestBody RequestPreorderDTO requestPreorderDTO
    ){

        return preorderService.save(requestPreorderDTO);
    }

    @PostMapping("/to-sale/{preorderID}")
    public ResponseEntity<String> preorderToSale(
            @PathVariable Integer preorderID
    ){
        Preorder preorder = preorderService.findById(preorderID);
        return preorderService.preorderToSale(preorder);
    }


}
