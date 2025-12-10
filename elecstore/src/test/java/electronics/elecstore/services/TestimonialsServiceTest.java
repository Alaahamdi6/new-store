package electronics.elecstore.services;

import electronics.elecstore.models.TestimonialsModel;
import electronics.elecstore.repositories.TestimonialsRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Arrays;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class TestimonialsServiceTest {

    @InjectMocks
    private TestimonialsService testimonialsService;

    @Mock
    private TestimonialsRepository testimonialsRepository;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void getAllTestimonials() {
        when(testimonialsRepository.findAll()).thenReturn(Arrays.asList(new TestimonialsModel(), new TestimonialsModel()));
        assertEquals(2, testimonialsService.getAllTestimonials().size());
    }

    @Test
    void getTestimonialById() {
        TestimonialsModel testimonial = new TestimonialsModel();
        testimonial.setId(1);
        when(testimonialsRepository.findById(1)).thenReturn(Optional.of(testimonial));
        assertTrue(testimonialsService.getTestimonialById(1).isPresent());
    }

    @Test
    void createTestimonial() {
        TestimonialsModel testimonial = new TestimonialsModel();
        testimonial.setUsername("test");
        when(testimonialsRepository.save(testimonial)).thenReturn(testimonial);
        assertEquals("test", testimonialsService.createTestimonial(testimonial).getUsername());
    }

    @Test
    void updateTestimonial() {
        TestimonialsModel testimonial = new TestimonialsModel();
        testimonial.setId(1);
        testimonial.setUsername("test");
        when(testimonialsRepository.findById(1)).thenReturn(Optional.of(testimonial));
        when(testimonialsRepository.save(testimonial)).thenReturn(testimonial);
        TestimonialsModel updatedTestimonial = testimonialsService.updateTestimonial(1, testimonial);
        assertEquals("test", updatedTestimonial.getUsername());
    }

    @Test
    void deleteTestimonial() {
        doNothing().when(testimonialsRepository).deleteById(1);
        testimonialsService.deleteTestimonial(1);
        verify(testimonialsRepository, times(1)).deleteById(1);
    }
}
