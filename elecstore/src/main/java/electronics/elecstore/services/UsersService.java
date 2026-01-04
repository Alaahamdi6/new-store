package electronics.elecstore.services;

import electronics.elecstore.models.UsersModel;
import electronics.elecstore.repositories.UsersRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

//@ nullable_by_default
@Service
public class UsersService {

    //@ private invariant usersRepository != null;
    @Autowired
    private UsersRepository usersRepository;

    //@ requires usersRepository != null;
    //@ ensures \result != null;
    //@ assignable \nothing;
    //@ pure
    public List<UsersModel> getAllUsers() {
        return usersRepository.findAll();
    }

    //@ requires id != null;
    //@ requires usersRepository != null;
    //@ ensures \result != null;
    //@ assignable \nothing;
    //@ pure
    public Optional<UsersModel> getUserById(Integer id) {
        return usersRepository.findById(id);
    }

    //@ requires username != null;
    //@ requires usersRepository != null;
    //@ ensures \result != null;
    //@ assignable \nothing;
    //@ pure
    public Optional<UsersModel> getUserByUsername(String username) {
        return usersRepository.findByUsername(username);
    }

    //@ requires user != null;
    //@ requires usersRepository != null;
    //@ ensures \result != null;
    //@ assignable usersRepository.*;
    public UsersModel createUser(UsersModel user) {
        return usersRepository.save(user);
    }

    //@ requires id != null;
    //@ requires userDetails != null;
    //@ requires usersRepository != null;
    //@ ensures \result != null;
    //@ assignable usersRepository.*;
    public UsersModel updateUser(Integer id, UsersModel userDetails) {
        return usersRepository.findById(id).map(user -> {
            user.setUsername(userDetails.getUsername());
            user.setPassword(userDetails.getPassword());
            user.setStatus(userDetails.getStatus());
            return usersRepository.save(user);
        }).orElseThrow(() -> new RuntimeException("User not found"));
    }

    //@ requires id != null;
    //@ requires usersRepository != null;
    //@ assignable usersRepository.*;
    public void deleteUser(Integer id) {
        usersRepository.deleteById(id);
    }
}
