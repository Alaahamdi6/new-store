package electronics.elecstore.repositories;

import electronics.elecstore.models.UsersModel;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UsersRepository extends JpaRepository<UsersModel, Integer> {
    Optional<UsersModel> findByUsername(String username);
    
}
