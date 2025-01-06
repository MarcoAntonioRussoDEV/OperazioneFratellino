package it.operazione_fratellino.of_backend.api;

import it.operazione_fratellino.of_backend.DTOs.CartDTO;
import it.operazione_fratellino.of_backend.DTOs.RequestCartToPreorderDTO;
import it.operazione_fratellino.of_backend.services.CartService;
import it.operazione_fratellino.of_backend.services.UserService;
import it.operazione_fratellino.of_backend.utils.DTOConverters.CartConverter;
import it.operazione_fratellino.of_backend.utils.PaginateResponse;
import it.operazione_fratellino.of_backend.utils.PaginationUtils;
import lombok.extern.java.Log;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/carts")
@Log
public class ApiCartController {

    @Autowired
    private CartService cartService;
    @Autowired
    private CartConverter cartConverter;
    @Autowired
    private UserService userService;

    @GetMapping("/all")
    public PaginateResponse<CartDTO> getAllCarts(@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size){
        return PaginationUtils.getAllEntities(page, size, cartService::findAll, cartConverter::toDTO);

    }

    @GetMapping("/by-user-email/{userEmail}")
    public CartDTO getCartByUserEmail(@PathVariable String userEmail){

        return cartConverter.toDTO(userService.findByEmail(userEmail).getCart());
    }

    @PostMapping("/add-item/{productCode}/{userEmail}")
    public ResponseEntity<String> addItemToUserCart(@PathVariable String productCode, @PathVariable String userEmail){
        return cartService.addItem(productCode, userEmail);
    }

    @PostMapping("/delete-item/{productCode}/{userEmail}")
    public ResponseEntity<String> deleteItemToUserCart(@PathVariable String productCode, @PathVariable String userEmail){
        return cartService.deleteItem(productCode, userEmail);
    }

    @PostMapping("/increase-item/{productCode}/{userEmail}")
    public ResponseEntity<String> increaseItemToUserCart(@PathVariable String productCode, @PathVariable String userEmail){
        return cartService.increaseItem(productCode, userEmail);
    }

    @PostMapping("/decrease-item/{productCode}/{userEmail}")
    public ResponseEntity<String> decreaseItemToUserCart(@PathVariable String productCode, @PathVariable String userEmail){
        return cartService.decreaseItem(productCode, userEmail);
    }

    @PostMapping("/to-preorder")
    public ResponseEntity<String> cartToPreorder(@RequestBody RequestCartToPreorderDTO request){

        return cartService.toPreorder(request);
    }
}
