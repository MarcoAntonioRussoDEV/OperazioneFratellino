package it.operazione_fratellino.of_backend.services.implement;

import it.operazione_fratellino.of_backend.DTOs.PreorderCartDTO;
import it.operazione_fratellino.of_backend.DTOs.RequestPreorderDTO;
import it.operazione_fratellino.of_backend.DTOs.RequestSaleDTO;
import it.operazione_fratellino.of_backend.DTOs.SellCartDTO;
import it.operazione_fratellino.of_backend.components.ExceptionHandlerService;
import it.operazione_fratellino.of_backend.entities.*;
import it.operazione_fratellino.of_backend.repositories.PreorderRepository;
import it.operazione_fratellino.of_backend.repositories.ProductPreorderRepository;
import it.operazione_fratellino.of_backend.services.*;
import it.operazione_fratellino.of_backend.utils.LogUtils;
import it.operazione_fratellino.of_backend.utils.SeverityEnum;
import lombok.extern.java.Log;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Log
@Service
public class PreorderServiceImpl implements PreorderService {
    @Autowired
    PreorderRepository preorderRepository;
    @Autowired
    UserService userService;
    @Autowired
    ClientService clientService;
    @Autowired
    StatusService statusService;
    @Autowired
    ProductService productService;
    @Autowired
    ProductPreorderRepository productPreorderRepository;
    @Autowired
    ExceptionHandlerService exceptionHandlerService;
    @Autowired
    SaleService saleService;
    @Autowired
    private LogService logService;

    @Override
    public List<Preorder> findAll() {
        return preorderRepository.findAll();
    }

    @Override
    public Page<Preorder> findAll(PageRequest pageRequest) {
        try {
            return preorderRepository.findAll(pageRequest);
        } catch (Exception e) {
            LogUtils.log("Errore durante il recupero del preorder_service paginato: " + e.getMessage(), SeverityEnum.ERROR, logService, "PreorderServiceImpl");
            throw new RuntimeException("Errore durante il recupero del preorder_service paginato", e);
        }
    }

    @Override
    public List<Preorder> findByUserEmail(String userEmail) {
        return preorderRepository.findByUser(userService.findByEmail(userEmail));
    }

    @Override
    public Long countByStatus(String status){
        return preorderRepository.countByStatus(status);
    }

    @Override
    public Preorder findById(Integer id) {
        return preorderRepository.findById(id).orElseThrow();
    }

    @Override
    public Preorder saveAndGet(Preorder preorder){
        return preorderRepository.save(preorder);
    }

    private Client checkClientExistOrGetNew(String email, String name){
        Client client = clientService.findByEmail(email);
        if (client == null){
            return clientService.saveAndGet(new Client(email, name));
        }else{
            User user = userService.findByEmail(email);
            if(user != null && client.getUser() == null){
                client.setUser(user);
            }
            return client;
        }
    }

    @Override
    public ResponseEntity<String> updateStatus(Integer preorderID, String status){
        Preorder preorder = preorderRepository.findById(preorderID).orElseThrow();
        try{
            String previousStatus = preorder.getStatus().getValue().toLowerCase();
            preorder.setStatus(statusService.findByValue(status));
            preorderRepository.save(preorder);
            if(previousStatus.equals("completed") && !status.equals("completed")){
                this.updateProductStock(preorder);
            }
            this.updateProductReservedPreorders(preorder);
            LogUtils.log(String.format("Preordine %s aggiornato con stato %s", preorder.getId(), status), SeverityEnum.INFO, logService, "PreorderServiceImpl");
            return new ResponseEntity<>("Stato aggiornato", HttpStatus.OK);
        } catch (Exception e) {
            LogUtils.log(String.format("Errore nell'aggiornamento dello stato del preordine %s", preorder.getId()), SeverityEnum.ERROR, logService, "PreorderServiceImpl");
            return new ResponseEntity<>("Errore nell'aggiornamento dello stato", HttpStatus.BAD_REQUEST);
        }
    }

    @Override
    public ResponseEntity<String> save(RequestPreorderDTO requestPreorderDTO){
        Preorder preorder = new Preorder();
        preorder.setUser(userService.findByEmail(requestPreorderDTO.getUserEmail()));
        preorder.setClient(checkClientExistOrGetNew(requestPreorderDTO.getClientEmail(), requestPreorderDTO.getClientName()));
        preorder.setStatus(statusService.findByValue(requestPreorderDTO.getStatus()));

        Double totalPrice = 0D;
        for(PreorderCartDTO cartDTO : requestPreorderDTO.getPreorderCart()){
            totalPrice += cartDTO.getQuantity() * productService.findById(cartDTO.getProduct()).getSellingPrice();
        }
        preorder.setTotalPrice(totalPrice);
        preorder.setCreatedAt(new Date());

        preorder = preorderRepository.save(preorder);


        List<ProductPreorder> productPreorderList = new ArrayList<>();
        for(PreorderCartDTO cartDTO : requestPreorderDTO.getPreorderCart()){
            ProductPreorder productPreorder = new ProductPreorder();
            productPreorder.setPreorder(preorder);
            Product product = productService.findById(cartDTO.getProduct());
            productPreorder.setProduct(product);
            productPreorder.setQuantity(cartDTO.getQuantity());
            productPreorderList.add(productPreorder);
        }
        List<ProductPreorder> savedList = productPreorderRepository.saveAll(productPreorderList);
        preorder.setProductPreorders(savedList);
        this.updateProductReservedPreorders(preorder);


        try {
            preorder = preorderRepository.save(preorder);
            log.info("LOG: Creato preordine ID: " + preorder.getId());
            return new ResponseEntity<String>("preordine salvato con successo", HttpStatus.CREATED);
        } catch (Exception e) {
            log.info("LOG: Errore creazione preordine");
            return exceptionHandlerService.handleException(e, "Error");
        }
    }


    @Override
    public ResponseEntity<String> delete(Preorder preorder){
        try{
            List<Product> products = preorder.getProductPreorders().stream().map(ProductPreorder::getProduct).toList();
            preorderRepository.delete(preorder);
            products.forEach(Product::calcReservedPreorders);
            productService.saveAll(products);

           return new ResponseEntity<>("Preordine cancellato", HttpStatus.OK);
        } catch (Exception e) {
            return  new ResponseEntity<>("Errore nella cancellazione del preordine", HttpStatus.BAD_REQUEST);
        }
    }

    @Transactional
    @Override
    public ResponseEntity<String> preorderToSale(Preorder preorder){
        RequestSaleDTO sale = new RequestSaleDTO();
            sale.setUserEmail(preorder.getUser().getEmail());
            sale.setClientEmail(preorder.getClient().getEmail());
            sale.setClientName(preorder.getClient().getName());
        List<SellCartDTO> cart = new ArrayList<>();
        for(ProductPreorder productPreorder : preorder.getProductPreorders()){
            Product product = productPreorder.getProduct();
            if (product.getStock() < productPreorder.getQuantity()) {
                return new ResponseEntity<>("Disponibilità insufficiente per il prodotto: " + product.getCode(), HttpStatus.CONFLICT);
            }
            SellCartDTO sellCartDTO = new SellCartDTO();
            sellCartDTO.setProducts(productPreorder.getProduct().getCode());
            sellCartDTO.setQuantity(productPreorder.getQuantity());
            cart.add(sellCartDTO);
        }
        sale.setCart(cart);
        try{
            preorder.setStatus(statusService.findByValue("COMPLETED"));
            preorderRepository.save(preorder);
            this.updateProductReservedPreorders(preorder);
            return saleService.save(sale);
        } catch (Exception e) {
            return new ResponseEntity<>("Errore nella trasformazione del preordine in vendita", HttpStatus.BAD_REQUEST);
        }
    }

    private void updateProductReservedPreorders(Preorder preorder){
        List<Product> products = preorder.getProductPreorders().stream().map(ProductPreorder::getProduct).toList();
        products.forEach(Product::calcReservedPreorders);
        productService.saveAll(products);


    }

    private void updateProductStock(Preorder preorder){
        List<Product> products = preorder.getProductPreorders().stream().map(ProductPreorder::getProduct).toList();
        products.forEach(product -> {
            product.setStock(product.getStock() + preorder.getProductPreorders().stream().filter(productPreorder -> productPreorder.getProduct().equals(product)).mapToInt(ProductPreorder::getQuantity).sum());
        });
        productService.saveAll(products);
    }

}
