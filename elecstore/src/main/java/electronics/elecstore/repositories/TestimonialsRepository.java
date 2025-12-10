package electronics.elecstore.repositories;

import electronics.elecstore.models.TestimonialsModel;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TestimonialsRepository extends JpaRepository<TestimonialsModel, Integer> {
}
