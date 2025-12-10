package electronics.elecstore.services;

import electronics.elecstore.models.UsersModel;
import electronics.elecstore.repositories.UsersRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UsersService {

    @Autowired
    private UsersRepository usersRepository;

    public List<UsersModel> getAllUsers() {
        return usersRepository.findAll();
    }

    public Optional<UsersModel> getUserById(Integer id) {
        return usersRepository.findById(id);
    }

    public Optional<UsersModel> getUserByUsername(String username) {
        return usersRepository.findByUsername(username);
    }

    public UsersModel createUser(UsersModel user) {
        return usersRepository.save(user);
    }

    public UsersModel updateUser(Integer id, UsersModel userDetails) {
        return usersRepository.findById(id).map(user -> {
            user.setUsername(userDetails.getUsername());
            user.setPassword(userDetails.getPassword());
            user.setStatus(userDetails.getStatus());
            return usersRepository.save(user);
        }).orElseThrow(() -> new RuntimeException("User not found"));
    }

    public void deleteUser(Integer id) {
        usersRepository.deleteById(id);
    }
    
    
}
