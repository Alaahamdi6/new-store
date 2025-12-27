package electronics.elecstore.controllers;

import electronics.elecstore.models.CouponsModel;
import electronics.elecstore.services.CouponsService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.hamcrest.Matchers.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

class CouponsControllerTest {
    private MockMvc mockMvc;

    @Mock
    private CouponsService couponsService;

    @InjectMocks
    private CouponsController controller;

    private CouponsModel coupon;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(controller).build();
        coupon = new CouponsModel();
        coupon.setId(5L);
        coupon.setCode("SAVE10");
    }

    @Test
    void getAllCoupons_returns_list() throws Exception {
        List<CouponsModel> list = Arrays.asList(coupon);
        when(couponsService.getAllCoupons()).thenReturn(list);

        mockMvc.perform(get("/api/coupons"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)));
    }

    @Test
    void getCouponById_found() throws Exception {
        when(couponsService.getCouponById(5L)).thenReturn(Optional.of(coupon));

        mockMvc.perform(get("/api/coupons/5"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(5)));
    }

    @Test
    void getCouponById_not_found() throws Exception {
        when(couponsService.getCouponById(99L)).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/coupons/99"))
                .andExpect(status().isNotFound());
    }

    @Test
    void validateCoupon_optional_return() throws Exception {
        when(couponsService.validateCoupon("SAVE10")).thenReturn(Optional.of(coupon));

        mockMvc.perform(get("/api/coupons/validate/SAVE10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(5)));
    }

    @Test
    void createCoupon_returns_ok() throws Exception {
        when(couponsService.createCoupon(any(CouponsModel.class))).thenReturn(coupon);

        mockMvc.perform(post("/api/coupons")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"code\":\"SAVE10\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code", is("SAVE10")));
    }

    @Test
    void updateCoupon_not_found_maps_to_404() throws Exception {
        when(couponsService.updateCoupon(eq(99L), any(CouponsModel.class))).thenThrow(new RuntimeException("not found"));

        mockMvc.perform(put("/api/coupons/99")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"code\":\"X\"}"))
                .andExpect(status().isNotFound());
    }

    @Test
    void updateCoupon_success() throws Exception {
        when(couponsService.updateCoupon(eq(5L), any(CouponsModel.class))).thenReturn(coupon);

        mockMvc.perform(put("/api/coupons/5")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"code\":\"NEW\"}"))
                .andExpect(status().isOk());
    }

    @Test
    void deleteCoupon_no_content() throws Exception {
        doNothing().when(couponsService).deleteCoupon(5L);

        mockMvc.perform(delete("/api/coupons/5"))
                .andExpect(status().isNoContent());
    }
}
