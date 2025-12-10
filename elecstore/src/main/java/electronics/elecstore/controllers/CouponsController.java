package electronics.elecstore.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import electronics.elecstore.models.CouponsModel;
import electronics.elecstore.services.CouponsService;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/coupons")
public class CouponsController {

    private final CouponsService couponService;

    public CouponsController(CouponsService couponService) {
        this.couponService = couponService;
    }

    @GetMapping
    public List<CouponsModel> getAllCoupons() {
        return couponService.getAllCoupons();
    }

    @GetMapping("/{id}")
    public ResponseEntity<CouponsModel> getCouponById(@PathVariable Long id) {
        return couponService.getCouponById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/validate/{code}")
    public Optional<CouponsModel> validateCoupon(@PathVariable String code) {
    	 
        return couponService.validateCoupon(code);
    }

    @PostMapping
    public CouponsModel createCoupon(@RequestBody CouponsModel coupon) {
        return couponService.createCoupon(coupon);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CouponsModel> updateCoupon(@PathVariable Long id, @RequestBody CouponsModel updatedCoupon) {
        try {
            return ResponseEntity.ok(couponService.updateCoupon(id, updatedCoupon));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCoupon(@PathVariable Long id) {
        couponService.deleteCoupon(id);
        return ResponseEntity.noContent().build();
    }
}
