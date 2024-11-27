package it.operazione_fratellino.of_backend.services.implement;

import it.operazione_fratellino.of_backend.entities.User;
import it.operazione_fratellino.of_backend.repositories.UserRepository;
import it.operazione_fratellino.of_backend.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public User findByEmail(String email)throws UsernameNotFoundException {
        if(userRepository.findByEmail(email).isPresent()){
            return userRepository.findByEmail(email).get();
        }
        return null;
    }

    @Override
    public User save(User user) {
        return userRepository.save(user);
    }
}
