package electronics.elecstore.controllers;

import electronics.elecstore.models.TestimonialsModel;
import electronics.elecstore.services.TestimonialsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;

@RestController
@RequestMapping("/api/testimonials")
@CrossOrigin(origins = "http://localhost:4200")
public class TestimonialsController {

    @Autowired
    private TestimonialsService testimonialsService;

    @CrossOrigin
    @GetMapping
    public List<TestimonialsModel> getAllTestimonials() {
        return testimonialsService.getAllTestimonials();
    }

    @GetMapping("/{id}")
    public ResponseEntity<TestimonialsModel> getTestimonialById(@PathVariable Integer id) {
        return testimonialsService.getTestimonialById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    private static final String UPLOAD_DIR = "uploads/";

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public TestimonialsModel createTestimonial(
            @RequestParam("username") String username,
            @RequestParam("comment") String comment,
            @RequestParam("stars") Integer stars,
            @RequestParam(value = "photo", required = false) MultipartFile photo) throws IOException {

    	String photoPath = "avatar.jpg"; 

        if (photo != null && !photo.isEmpty()) {
            photoPath = saveFile(photo); 
        }

        TestimonialsModel testimonial = new TestimonialsModel();
        testimonial.setUsername(username);
        testimonial.setComment(comment);
        testimonial.setStars(stars);
        testimonial.setPhoto(photoPath);

        return testimonialsService.createTestimonial(testimonial);
    }

    private String saveFile(MultipartFile file) throws IOException {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("File is empty");
        }

        // Create the uploads directory if it doesn't exist
        Path uploadPath = Paths.get(UPLOAD_DIR);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        // Save the file
        String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
        Path filePath = uploadPath.resolve(fileName);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        return fileName;
    }


    @PutMapping("/{id}")
    public ResponseEntity<TestimonialsModel> updateTestimonial(@PathVariable Integer id, @RequestBody TestimonialsModel testimonialDetails) {
        try {
            TestimonialsModel updatedTestimonial = testimonialsService.updateTestimonial(id, testimonialDetails);
            return ResponseEntity.ok(updatedTestimonial);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTestimonial(@PathVariable Integer id) {
        testimonialsService.deleteTestimonial(id);
        return ResponseEntity.noContent().build();
    }
}
