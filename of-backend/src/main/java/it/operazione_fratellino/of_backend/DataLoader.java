package it.operazione_fratellino.of_backend;

import it.operazione_fratellino.of_backend.entities.*;
import it.operazione_fratellino.of_backend.repositories.UserRepository;
import it.operazione_fratellino.of_backend.services.CityService;
import it.operazione_fratellino.of_backend.services.RoleService;
import it.operazione_fratellino.of_backend.services.StatusService;
import it.operazione_fratellino.of_backend.services.UserService;
import it.operazione_fratellino.of_backend.utils.LogUtils;
import it.operazione_fratellino.of_backend.utils.SeverityEnum;
import lombok.extern.java.Log;
import org.fusesource.jansi.Ansi;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.env.Environment;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.function.Supplier;

@Log
@Component
public class DataLoader implements CommandLineRunner {

    @Autowired
    private RoleService roleService;
    @Autowired
    private StatusService statusService;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private UserService userService;
    @Autowired
    private CityService cityService;
    @Autowired
    private Environment env;

    /**
     * Creates default data for database on first startup
     * @author Marco Antonio Russo
     * @since 19/12/2024
     */
    @Transactional
    @Override
    public void run(String... args) throws Exception {
        if(!roleService.exists(env.getProperty("user.admin.role"))){
            roleService.save(new Role("USER"));
            roleService.save(new Role("OPERATOR"));
            roleService.save(new Role("ADMIN"));
            roleService.save(new Role("DEVELOPER"));
        }

        if(!statusService.exists("PENDING")){
            statusService.save(new Status("PENDING"));
            statusService.save(new Status("READY"));
            statusService.save(new Status("COMPLETED"));
            statusService.save(new Status("REJECTED"));
        }

        if(!cityService.exists(env.getProperty("user.admin.city"))){
            cityService.saveAndGet(new City(env.getProperty("user.admin.city")));
        }


        if (!userService.exists(env.getProperty("user.admin.email"))) {
            userService.createAdmin(
                    env.getProperty("user.admin.email"),
                    passwordEncoder.encode(env.getProperty("user.admin.password")),
                    env.getProperty("user.admin.role"),
                    env.getProperty("user.admin.city"),
                    env.getProperty("user.admin.phone"));
        }
    }
}
