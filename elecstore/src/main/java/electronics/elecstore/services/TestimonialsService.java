package electronics.elecstore.services;

import electronics.elecstore.models.TestimonialsModel;
import electronics.elecstore.repositories.TestimonialsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TestimonialsService {

    @Autowired
    private TestimonialsRepository testimonialsRepository;

    public List<TestimonialsModel> getAllTestimonials() {
        return testimonialsRepository.findAll();
    }

    public Optional<TestimonialsModel> getTestimonialById(Integer id) {
        return testimonialsRepository.findById(id);
    }

    public TestimonialsModel createTestimonial(TestimonialsModel testimonial) {
        return testimonialsRepository.save(testimonial);
    }

    public TestimonialsModel updateTestimonial(Integer id, TestimonialsModel testimonialDetails) {
        return testimonialsRepository.findById(id).map(testimonial -> {
            testimonial.setUsername(testimonialDetails.getUsername());
            testimonial.setPhoto(testimonialDetails.getPhoto());
            testimonial.setComment(testimonialDetails.getComment());
            testimonial.setStars(testimonialDetails.getStars());
            return testimonialsRepository.save(testimonial);
        }).orElseThrow(() -> new RuntimeException("Testimonial not found"));
    }

    public void deleteTestimonial(Integer id) {
        testimonialsRepository.deleteById(id);
    }
}
