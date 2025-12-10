package electronics.elecstore.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import electronics.elecstore.models.CouponsModel;

import java.time.LocalDate;
import java.util.Optional;

public interface CouponsRepository extends JpaRepository<CouponsModel, Long> {
    Optional<CouponsModel> findByCode(String code);
    Optional<CouponsModel> findByCodeAndExpirationDateAfter(String code, LocalDate today);
}
