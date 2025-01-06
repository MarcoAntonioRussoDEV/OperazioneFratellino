package it.operazione_fratellino.of_backend.services.implement;

import it.operazione_fratellino.of_backend.DTOs.SellCartDTO;
import it.operazione_fratellino.of_backend.DTOs.RequestSaleDTO;
import it.operazione_fratellino.of_backend.components.ExceptionHandlerService;
import it.operazione_fratellino.of_backend.entities.*;
import it.operazione_fratellino.of_backend.repositories.ProductRepository;
import it.operazione_fratellino.of_backend.repositories.ProductSaleRepository;
import it.operazione_fratellino.of_backend.repositories.SaleRepository;
import it.operazione_fratellino.of_backend.services.ClientService;
import it.operazione_fratellino.of_backend.services.ProductService;
import it.operazione_fratellino.of_backend.services.SaleService;
import it.operazione_fratellino.of_backend.services.UserService;
import it.operazione_fratellino.of_backend.utils.LogUtils;
import it.operazione_fratellino.of_backend.utils.SeverityEnum;
import lombok.extern.java.Log;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
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
public class SaleServiceImpl implements SaleService {
    @Autowired
    private ProductSaleRepository productSaleRepository;

    @Autowired
    private SaleRepository saleRepository;
    @Autowired
    ExceptionHandlerService exceptionHandlerService;
    @Autowired
    UserService userService;
    @Autowired
    ProductService productService;
    @Autowired
    ProductRepository productRepository;
    @Autowired
    ClientService clientService;

    @Override
    public List<Sale> findAll() {
        return saleRepository.findAll();
    }

    @Override
    public Page<Sale> findAll(PageRequest pageRequest) {
        try {
            return saleRepository.findAll(pageRequest);
        } catch (Exception e) {
            LogUtils.log("Errore durante il recupero della vendita paginato: " + e.getMessage(), SeverityEnum.ERROR);
            throw new RuntimeException("Errore durante il recupero della vendita paginato", e);
        }
    }

    @Override
    public Sale findById(Integer id) {
        return saleRepository.findById(id).orElseThrow();

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
    @Transactional
    public ResponseEntity<String> save(RequestSaleDTO requestSaleDTO) {
        Sale sale = new Sale();
        sale.setClient(checkClientExistOrGetNew(requestSaleDTO.getClientEmail(), requestSaleDTO.getClientName()));
        sale.setUser(userService.findByEmail(requestSaleDTO.getUserEmail()));
        sale.setCreatedAt(new Date());
        List<Product> productList = new ArrayList<>();
        List<ProductSale> productSaleList = new ArrayList<>();
        Double totalPrice = Double.valueOf(0);
        Double profit = Double.valueOf(0);
        for (SellCartDTO cartItem : requestSaleDTO.getCart()) {
            ProductSale productSale = new ProductSale();
            Product product = productService.findByCode(cartItem.getProducts());
            productList.add(product);

            if (product.getStock() - cartItem.getQuantity() < 0) {
                LogUtils.log("SALE.SERVICE: Stock not available", SeverityEnum.ERROR);
                return new ResponseEntity<>("Impossibile creare la vendita per mancanza di disponibilità", HttpStatus.CONFLICT);
            }
            product.setStock(product.getStock() - cartItem.getQuantity());
            productService.save(product);

            productSale.setProduct(product);
            productSale.setQuantity(cartItem.getQuantity());
            sale = saleRepository.save(sale);
            productSale.setSale(sale);
            ProductSale savedPS = productSaleRepository.save(productSale);
            productSaleList.add(savedPS);

            totalPrice += product.getSellingPrice() * cartItem.getQuantity();
            profit += totalPrice - product.getPurchasePrice() * cartItem.getQuantity();
        }
        sale.setProductSale(productSaleList);
        sale.setTotal_price(totalPrice);
        sale.setProfit(profit);
        try {
            Sale savedSale = saleRepository.save(sale);
            log.info("LOG: Creata vendita ID: " + savedSale.getId());
            return new ResponseEntity<String>("vendita salvata con successo", HttpStatus.CREATED);
        } catch (Exception e) {
            log.info("LOG: Errore creazione vendita");
            return exceptionHandlerService.handleException(e, "Error");
        }
    }


    @Override
    public ResponseEntity<String> delete(Sale sale) {
            List<ProductSale> productSaleList = sale.getProductSale();
        try {
            saleRepository.delete(sale);
            for(ProductSale productSale : productSaleList){
                Product product = productSale.getProduct();
                product.setStock(product.getStock() + productSale.getQuantity());
                productRepository.save(product);
            }

            return new ResponseEntity<>("Vendita cancellata con successo", HttpStatus.OK);
        } catch (DataIntegrityViolationException e) {
            return new ResponseEntity<>("Errore: La vendita è associata a dei prodotti", HttpStatus.CONFLICT);
        } catch (Exception e) {
            return new ResponseEntity<>("Errore interno del server", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
