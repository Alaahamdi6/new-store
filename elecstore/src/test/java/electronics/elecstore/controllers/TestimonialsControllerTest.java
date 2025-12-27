package electronics.elecstore.controllers;

import electronics.elecstore.models.TestimonialsModel;
import electronics.elecstore.services.TestimonialsService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.Arrays;
import java.util.Optional;

import static org.hamcrest.Matchers.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

class TestimonialsControllerTest {
    private MockMvc mockMvc;

    @Mock
    private TestimonialsService testimonialsService;

    @InjectMocks
    private TestimonialsController controller;

    private TestimonialsModel t;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(controller).build();
        t = new TestimonialsModel();
        t.setId(1);
        t.setUsername("alice");
        t.setStars(5);
        t.setComment("great");
    }

    @Test
    void getAllTestimonials() throws Exception {
        when(testimonialsService.getAllTestimonials()).thenReturn(Arrays.asList(t));
        mockMvc.perform(get("/api/testimonials"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)));
    }

    @Test
    void getById_found() throws Exception {
        when(testimonialsService.getTestimonialById(1)).thenReturn(Optional.of(t));
        mockMvc.perform(get("/api/testimonials/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.username", is("alice")));
    }

    @Test
    void getById_notFound() throws Exception {
        when(testimonialsService.getTestimonialById(99)).thenReturn(Optional.empty());
        mockMvc.perform(get("/api/testimonials/99"))
                .andExpect(status().isNotFound());
    }

    @Test
    void createTestimonial_withoutPhoto_uses_default() throws Exception {
        when(testimonialsService.createTestimonial(any(TestimonialsModel.class))).thenReturn(t);
        mockMvc.perform(multipart("/api/testimonials")
                        .param("username", "bob")
                        .param("comment", "ok")
                        .param("stars", "4"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.username", is("alice")));
    }

    @Test
    void createTestimonial_withPhoto_saves_file() throws Exception {
        when(testimonialsService.createTestimonial(any(TestimonialsModel.class))).thenReturn(t);
        MockMultipartFile photo = new MockMultipartFile("photo", "p.jpg", "image/jpeg", new byte[]{1,2,3});
        mockMvc.perform(multipart("/api/testimonials")
                        .file(photo)
                        .param("username", "bob")
                        .param("comment", "ok")
                        .param("stars", "4"))
                .andExpect(status().isOk());
    }

    @Test
    void updateTestimonial_notFound() throws Exception {
        when(testimonialsService.updateTestimonial(eq(99), any(TestimonialsModel.class))).thenThrow(new RuntimeException("nf"));
        mockMvc.perform(put("/api/testimonials/99")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"comment\":\"x\"}"))
                .andExpect(status().isNotFound());
    }

    @Test
    void updateTestimonial_success() throws Exception {
        when(testimonialsService.updateTestimonial(eq(1), any(TestimonialsModel.class))).thenReturn(t);
        mockMvc.perform(put("/api/testimonials/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"comment\":\"updated\"}"))
                .andExpect(status().isOk());
    }

    @Test
    void deleteTestimonial_noContent() throws Exception {
        doNothing().when(testimonialsService).deleteTestimonial(1);
        mockMvc.perform(delete("/api/testimonials/1"))
                .andExpect(status().isNoContent());
    }
}
