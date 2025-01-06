package it.operazione_fratellino.of_backend.api;

import it.operazione_fratellino.of_backend.DTOs.ProductDTO;
import it.operazione_fratellino.of_backend.DTOs.PublicUserDTO;
import it.operazione_fratellino.of_backend.services.ProductService;
import it.operazione_fratellino.of_backend.services.UserService;
import it.operazione_fratellino.of_backend.utils.DTOConverters.ProductConverter;
import it.operazione_fratellino.of_backend.utils.DTOConverters.UserConverter;
import it.operazione_fratellino.of_backend.utils.LogUtils;
import it.operazione_fratellino.of_backend.utils.SeverityEnum;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/public")
public class ApiPublicController {

    @Autowired
    private ProductService productService;
    @Autowired
    private ProductConverter productConverter;

    @GetMapping("/products/all")
    public List<ProductDTO> getAllUsers() {
        return productService.findAll().stream().map(productConverter::toDTO).toList();
    }


    @GetMapping("/origin")
    public String someEndpoint(@RequestHeader(value = "Origin", required = false) String origin) {
        if (origin != null) {
            LogUtils.log("Request origin: " + origin, SeverityEnum.INFO);
        } else {
            LogUtils.log("No Origin header present in the request", SeverityEnum.INFO);
        }
        return origin;
    }

}
