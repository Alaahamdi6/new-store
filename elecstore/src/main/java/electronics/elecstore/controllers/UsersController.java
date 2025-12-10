package electronics.elecstore.controllers;

import electronics.elecstore.models.UsersModel;
import electronics.elecstore.services.UsersService;
import jakarta.annotation.Resource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.AbstractFileResolvingResource;
import org.springframework.core.io.UrlResource;
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
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:4200")
public class UsersController {

    @Autowired
    private UsersService usersService;

    private static final String UPLOAD_DIR = "uploads/"; // Directory to store uploaded images

    @GetMapping
    public List<UsersModel> getAllUsers() {
        return usersService.getAllUsers();
    }

    @GetMapping("/{id}")
    public ResponseEntity<UsersModel> getUserById(@PathVariable Integer id) {
        return usersService.getUserById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public UsersModel createUser(@RequestBody UsersModel user) {
        return usersService.createUser(user);
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<UsersModel> updateUser(
        @PathVariable Integer id,
        @RequestPart("username") String username,
        @RequestPart(value = "photo", required = false) MultipartFile photo) {

        // Retrieve the existing user from the database
        UsersModel existingUser = usersService.getUserById(id)
            .orElseThrow(() -> new RuntimeException("User not found"));

        // Update the fields
        existingUser.setUsername(username);

        if (photo != null && !photo.isEmpty()) {
            try {
                // Save the uploaded file and get the file name
                String photoPath = saveFile(photo);
                existingUser.setPhoto(photoPath); // Store the file name in the user object
            } catch (IOException e) {
                e.printStackTrace();
                return ResponseEntity.internalServerError().build();
            }
        }

        // Save the updated user
        UsersModel updatedUser = usersService.updateUser(id, existingUser);
        return ResponseEntity.ok(updatedUser);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Integer id) {
        usersService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    // Helper method to save the uploaded file
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
    
    @GetMapping("/uploads/{filename}")
    public ResponseEntity<Resource> getUserPhoto(@PathVariable String filename) throws IOException {
        Path filePath = Paths.get(UPLOAD_DIR + filename);  // UPLOAD_DIR = "uploads/users/"
        Resource resource = (Resource) new UrlResource(filePath.toUri());
        if (((AbstractFileResolvingResource) resource).exists() && ((AbstractFileResolvingResource) resource).isReadable()) {  // Fixed: Simple exists() + readable check
            String contentType = Files.probeContentType(filePath);  // Auto-detect image type
            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType != null ? contentType : MediaType.IMAGE_JPEG_VALUE))
                    .body(resource);
        }
        return ResponseEntity.notFound().build();
    }
}