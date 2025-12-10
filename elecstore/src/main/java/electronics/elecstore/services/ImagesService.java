package electronics.elecstore.services;

import electronics.elecstore.models.ImagesModel;
import electronics.elecstore.repositories.ImagesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ImagesService {

    @Autowired
    private ImagesRepository imagesRepository;

    public List<ImagesModel> getAllImages() {
        return imagesRepository.findAll();
    }

    public List<ImagesModel> getImagesByProductId(Long productId) {
        return imagesRepository.findByProductId(productId);
    }

    public Optional<ImagesModel> getImageById(Long id) {
        return imagesRepository.findById(id);
    }

    public ImagesModel addImage(ImagesModel image) {
        return imagesRepository.save(image);
    }

    public void deleteImage(Long id) {
        imagesRepository.deleteById(id);
    }
}
