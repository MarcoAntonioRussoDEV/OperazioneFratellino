package it.operazione_fratellino.of_backend.services.implement;

import it.operazione_fratellino.of_backend.DTOs.RequestUserDTO;
import it.operazione_fratellino.of_backend.entities.Cart;
import it.operazione_fratellino.of_backend.entities.City;
import it.operazione_fratellino.of_backend.entities.Client;
import it.operazione_fratellino.of_backend.entities.User;
import it.operazione_fratellino.of_backend.exceptions.InvalidOldPasswordException;
import it.operazione_fratellino.of_backend.repositories.CartRepository;
import it.operazione_fratellino.of_backend.repositories.UserRepository;
import it.operazione_fratellino.of_backend.services.*;
import it.operazione_fratellino.of_backend.utils.AuthorityUtils;
import it.operazione_fratellino.of_backend.utils.AutorityEnum;
import it.operazione_fratellino.of_backend.utils.LogUtils;
import it.operazione_fratellino.of_backend.utils.SeverityEnum;
import lombok.extern.java.Log;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;
import java.util.Objects;

@Log
@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private CartRepository cartRepository;
    @Autowired
    private RoleService roleService;
    @Autowired
    private CityService cityService;
    @Autowired
    private ClientService clientService;
    @Lazy
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private LogService logService;

    /**
     * Create the first user into database with params defined into properties
     * @param email
     * @param password
     * @param role
     * @param city
     * @param phone
     * @author Marco Antonio Russo
     * @since 20/12/2024
     */
    @Override
    public void createAdmin(String email, String password, String role, String city, String phone) {
        User admin = new User();
        admin.setName("admin");
        admin.setEmail(email);
        admin.setPassword(password);
        admin.setCity(cityService.findByName(city));
        admin.setRole(roleService.findByName(role));
        admin.setPhone(phone);
        admin.setIsFirstAccess(true);
        this.save(admin);

    }

    @Override
    public boolean exists(String email) {
        return userRepository.findByEmail(email).isPresent();
    }

    @Override
    public User findByEmail(String email) throws UsernameNotFoundException {
        if (userRepository.findByEmail(email).isPresent()) {
            return userRepository.findByEmail(email).get();
        }
        return null;
    }

    @Override
    public User findById(Integer id) {
        return userRepository.findById(id).orElseThrow();
    }

    @Transactional
    @Override
    public User save(User user) {
        try {
            user.setCreatedAt(new Date());

            Cart cart = new Cart();
                user = userRepository.save(user);
                cart.setUser(user);
                cart.setUpdatedAt(new Date());
                cart.setCreatedAt(new Date());
                cart.setTotalPrice(0D);
                cart = cartRepository.save(cart);
            LogUtils.log(String.format("USER.SERVICE: created cart for user: %s", cart.getUser().getEmail()), SeverityEnum.INFO, logService, "UserServiceImpl");


            Client client = new Client();
                client.setName(user.getName());
                client.setEmail(user.getEmail());
                client.setUser(user);
                client = clientService.saveAndGet(client);
                cart = cartRepository.save(cart);

                user.setCart(cart);
                user.setClient(client);
            LogUtils.log(String.format("USER.SERVICE: created client for user: %s", client.getUser().getEmail()), SeverityEnum.INFO, logService, "UserServiceImpl");

            user.setIsFirstAccess(true);
            user = userRepository.save(user);
            LogUtils.log(String.format("USER.SERVICE: created user %s", user.getEmail()), SeverityEnum.INFO, logService, "UserServiceImpl");
            return user;
        } catch (Exception e) {
            LogUtils.log(String.format("USER.SERVICE: error saving user %s", user.getEmail()), SeverityEnum.ERROR, logService, "UserServiceImpl");
            throw new RuntimeException(e);
        }
    }

    @Override
    public List<User> findAll() {
        return userRepository.findAll();
    }

    @Override
    public Page<User> findAll(PageRequest pageRequest) {
        try {
            return userRepository.findAll(pageRequest);
        } catch (Exception e) {
            LogUtils.log("Errore durante il recupero dell' utente paginato: " + e.getMessage(), SeverityEnum.ERROR, logService, "UserServiceImpl");
            throw new RuntimeException("Errore durante il recupero dell' utente paginato", e);
        }
    }

    /**
     * Edit an existing user by data recived from frontend, handling user not found, or incorrect password change
     * @param requestUserDTO
     * @return saved user
     * @author Marco Antonio Russo
     * @since 20/12/2024
     */
    @Override
    public User patch(RequestUserDTO requestUserDTO, User loggedUser){
        User user = userRepository.findByEmail(requestUserDTO.getEmail()).orElseThrow(()->new UsernameNotFoundException(String.format("User %s non trovato", requestUserDTO.getEmail())));
        Client client = user.getClient();

        if (!Objects.isNull(requestUserDTO.getPassword())) {
            if(passwordEncoder.matches(requestUserDTO.getOldPassword(), user.getPassword())){
                user.setIsFirstAccess(false);
                user.setPassword(passwordEncoder.encode(requestUserDTO.getPassword()));
            }else {
                throw new InvalidOldPasswordException("La vecchia password non è corretta");
            }
        }

        user.setName(requestUserDTO.getName());
        client.setName(requestUserDTO.getName());
        user.setPhone(requestUserDTO.getPhone());
        City city = cityService.findByName(requestUserDTO.getCity());
        if(Objects.isNull(city)){
            city = new City(requestUserDTO.getCity());
        }
        user.setCity(city);

        if(!Objects.isNull(requestUserDTO.getRole()) && AuthorityUtils.hasAccess(loggedUser.getRole(), AutorityEnum.ADMIN)){
            user.setRole(roleService.findByName(requestUserDTO.getRole()));
            LogUtils.log(String.format("Changed %s's role to %s ",requestUserDTO.getEmail(), requestUserDTO.getRole()), SeverityEnum.WARNING, logService, "UserServiceImpl");
        }

        clientService.save(client);
        return userRepository.save(user);
    }

    @Override
    public User patch(User user){
        return userRepository.save(user);
    }
}
