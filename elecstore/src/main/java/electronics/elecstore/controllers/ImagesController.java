package electronics.elecstore.controllers;

import electronics.elecstore.models.ImagesModel;
import electronics.elecstore.services.ImagesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/images")
@CrossOrigin(origins = "*")
public class ImagesController {

    @Autowired
    private ImagesService imagesService;

    @GetMapping
    public List<ImagesModel> getAllImages() {
        return imagesService.getAllImages();
    }

    @GetMapping("/product/{productId}")
    public List<ImagesModel> getImagesByProductId(@PathVariable Long productId) {
        return imagesService.getImagesByProductId(productId);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ImagesModel> getImageById(@PathVariable Long id) {
        Optional<ImagesModel> image = imagesService.getImageById(id);
        return image.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ImagesModel addImage(@RequestBody ImagesModel image) {
        return imagesService.addImage(image);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteImage(@PathVariable Long id) {
        imagesService.deleteImage(id);
        return ResponseEntity.noContent().build();
    }
}
