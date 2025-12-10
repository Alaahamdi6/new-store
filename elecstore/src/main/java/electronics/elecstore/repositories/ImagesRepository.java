package electronics.elecstore.repositories;

import electronics.elecstore.models.ImagesModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ImagesRepository extends JpaRepository<ImagesModel, Long> {
    List<ImagesModel> findByProductId(Long productId);
}
