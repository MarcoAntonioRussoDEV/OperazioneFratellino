package it.operazione_fratellino.of_backend.services.implement;

import it.operazione_fratellino.of_backend.DTOs.RequestCartToPreorderDTO;
import it.operazione_fratellino.of_backend.DTOs.RequestProductsCartDTO;
import it.operazione_fratellino.of_backend.entities.*;
import it.operazione_fratellino.of_backend.repositories.CartRepository;
import it.operazione_fratellino.of_backend.services.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Objects;

@Service
public class CartServiceImpl implements CartService {

    @Autowired
    private CartRepository cartRepository;
    @Autowired
    private UserService userService;
    @Autowired
    private ProductService productService;
    @Autowired
    private ProductCartService productCartService;
    @Autowired
    private ClientService clientService;
    @Autowired
    private StatusService statusService;
    @Autowired
    private PreorderService preorderService;
    @Autowired
    private ProductPreorderService productPreorderService;


    @Override
    public List<Cart> findAll() {
        return cartRepository.findAll();
    }

    @Override
    public Page<Cart> findAll(PageRequest pageRequest) {
        return cartRepository.findAll(pageRequest);
    }

    @Override
    public Cart findById(Integer id) {
        return cartRepository.findById(id).orElseThrow();
    }

    @Override
    public Cart saveAndGet(Cart cart) {
        return cartRepository.save(cart);
    }

    @Override
    public void clear(Cart cart) {
        cart.setUpdatedAt(new Date());
        cart.setTotalPrice(0D);
        cart.getProductCarts().clear();
        cartRepository.save(cart);
    }

    @Override
    public ResponseEntity<String> addItem(String productCode, String userEmail) {
        User user = userService.findByEmail(userEmail);
        Cart cart = user.getCart();
        if (Objects.isNull(cart)) {
            cart = new Cart();
            cart.setUser(user);
            cart.setCreatedAt(new Date());
            cart.setUpdatedAt(new Date());
            cart.setTotalPrice(0.0);
            cart = cartRepository.save(cart);
        }

        for (ProductCart productCart : cart.getProductCarts()) {
            if (Objects.equals(productCart.getProduct().getCode(), productCode)) {
                return this.increaseItem(productCode, userEmail);
            }
        }


        ProductCart productCart = new ProductCart();
        productCart.setProduct(productService.findByCode(productCode));
        productCart.setQuantity(1);
        productCart.setCart(cart);
        cart.addProductCart(productCart);
        productCart = productCartService.save(productCart);


        if (cart.getProductCarts().isEmpty()) {
            List<ProductCart> productCartList = new ArrayList<>();
            productCartList.add(productCart);
            cart.setProductCarts(productCartList);
        } else {
            cart.getProductCarts().add(productCart);
        }

        try {
            cartRepository.save(cart);
            cart.setTotalPrice(this.calcTotalPrice(cart));
            cart.setUpdatedAt(new Date());
            return new ResponseEntity<>("Prodotto aggiunto al carrello", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("errore nell'inserimento del prodotto nel carrello", HttpStatus.BAD_REQUEST);

        }

    }

    @Override
    public ResponseEntity<String> increaseItem(String productCode, String userEmail) {
        User user = userService.findByEmail(userEmail);
        List<ProductCart> productCartList = user.getCart().getProductCarts();

        ProductCart productCartToIncrease = new ProductCart();
        for (ProductCart productCart : productCartList) {
            if (Objects.equals(productCart.getProduct().getCode(), productCode)) {
                productCartToIncrease = productCart;
            }
        }
        productCartToIncrease.setQuantity(productCartToIncrease.getQuantity() + 1);


        try {
            productCartService.save(productCartToIncrease);
            user.getCart().setTotalPrice(this.calcTotalPrice(user.getCart()));
            cartRepository.save(user.getCart());
            return new ResponseEntity<>("Aggiunto " + productCartToIncrease.getProduct().getCode() + " al carrello",
                    HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("errore nell'incremento' del prodotto nel carrello", HttpStatus.BAD_REQUEST);

        }
    }

    private Double calcTotalPrice(Cart cart) {
        Double totalPrice = 0D;
        for (ProductCart product : cart.getProductCarts()) {
            totalPrice += (product.getProduct().getSellingPrice() * product.getQuantity());
        }
        return totalPrice;
    }

    @Override
    public ResponseEntity<String> deleteItem(String productCode, String userEmail) {
        User user = userService.findByEmail(userEmail);
        Cart cart = user.getCart();
        ProductCart productCartToRemove = new ProductCart();
        for (ProductCart productCart : cart.getProductCarts()) {
            if (Objects.equals(productCart.getProduct().getCode(), productCode)) {
                productCartToRemove = productCart;
            }
        }
        cart.getProductCarts().remove(productCartToRemove);
        productCartService.delete(productCartToRemove);


        try {
            user.getCart().setTotalPrice(this.calcTotalPrice(cart));
            cartRepository.save(cart);
            return new ResponseEntity<>("Rimosso " + productCode + " dal carrello", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("errore nella rimozione del prodotto nel carrello", HttpStatus.BAD_REQUEST);

        }

    }


    @Override
    public ResponseEntity<String> decreaseItem(String productCode, String userEmail) {
        User user = userService.findByEmail(userEmail);
        List<ProductCart> productCartList = user.getCart().getProductCarts();

        ProductCart productCartToDecrease = new ProductCart();
        for (ProductCart productCart : productCartList) {
            if (Objects.equals(productCart.getProduct().getCode(), productCode)) {
                productCartToDecrease = productCart;
            }
        }
        try {
            if (productCartToDecrease.getQuantity() > 1) {
                productCartToDecrease.setQuantity(productCartToDecrease.getQuantity() - 1);
                productCartService.save(productCartToDecrease);
            } else {
                return this.deleteItem(productCode, userEmail);
            }
            user.getCart().setTotalPrice(this.calcTotalPrice(user.getCart()));
            cartRepository.save(user.getCart());
            return new ResponseEntity<>("Rimosso 1 " + productCartToDecrease.getProduct().getCode() + " dal carrello"
                    , HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("errore nel decremento del prodotto nel carrello", HttpStatus.BAD_REQUEST);

        }
    }


    @Override
    public ResponseEntity<String> toPreorder(RequestCartToPreorderDTO request) {
        Preorder preorder = new Preorder();
        preorder.setUser(userService.findByEmail(request.getUser()));
        preorder.setClient(preorder.getUser().getClient());
        preorder.setStatus(statusService.findByValue("PENDING"));
        preorder.setCreatedAt(new Date());

        preorder = preorderService.saveAndGet(preorder);
        Double totalPrice = 0D;
        List<ProductPreorder> productPreorderList = new ArrayList<>();
        for (RequestProductsCartDTO product : request.getProducts()) {
            ProductPreorder productPreorder = new ProductPreorder();
            Product prod = productService.findByCode(product.getProduct());
            prod.setReservedPreorders(prod.getReservedPreorders() + product.getQuantity());
            prod = productService.saveAndGet(prod);
            productPreorder.setProduct(prod);
            productPreorder.setQuantity(product.getQuantity());
            productPreorder.setPreorder(preorder);
            productPreorder = productPreorderService.saveAndGet(productPreorder);
            productPreorderList.add(productPreorder);
            totalPrice += product.getPrice() * product.getQuantity();
        }
        preorder.setProductPreorders(productPreorderList);
        preorder.setTotalPrice(totalPrice);

        try {
            this.clear(this.findById(request.getProducts().getFirst().getCart()));
            preorder = preorderService.saveAndGet(preorder);
            return new ResponseEntity<>("Preordine creato con successo", HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>("Errore nella creazione del preordine", HttpStatus.BAD_REQUEST);
        }
    }

}
