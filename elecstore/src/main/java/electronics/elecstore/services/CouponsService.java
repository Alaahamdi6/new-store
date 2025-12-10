package electronics.elecstore.services;

import org.springframework.stereotype.Service;

import electronics.elecstore.models.CouponsModel;
import electronics.elecstore.repositories.CouponsRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class CouponsService {

    private final CouponsRepository couponRepository;

    public CouponsService(CouponsRepository couponRepository) {
        this.couponRepository = couponRepository;
    }

    public List<CouponsModel> getAllCoupons() {
        return couponRepository.findAll();
    }

    public Optional<CouponsModel> getCouponById(Long id) {
        return couponRepository.findById(id);
    }

    public Optional<CouponsModel> getCouponByCode(String code) {
        return couponRepository.findByCode(code);
    }
    
    public Optional<CouponsModel> validateCoupon(String code) {
        return couponRepository.findByCodeAndExpirationDateAfter(code, LocalDate.now());
    }

    public CouponsModel createCoupon(CouponsModel coupon) {
        return couponRepository.save(coupon);
    }

    public CouponsModel updateCoupon(Long id, CouponsModel updatedCoupon) {
        return couponRepository.findById(id).map(coupon -> {
            coupon.setCode(updatedCoupon.getCode());
            coupon.setProducts(updatedCoupon.getProducts());
            coupon.setPercentage(updatedCoupon.getPercentage());
            return couponRepository.save(coupon);
        }).orElseThrow(() -> new RuntimeException("Coupon not found"));
    }

    public void deleteCoupon(Long id) {
        couponRepository.deleteById(id);
    }
}