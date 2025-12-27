package electronics.elecstore.controllers;

import electronics.elecstore.models.ImagesModel;
import electronics.elecstore.services.ImagesService;
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
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

class ImagesControllerTest {
    private MockMvc mockMvc;

    @Mock
    private ImagesService imagesService;

    @InjectMocks
    private ImagesController controller;

    private ImagesModel image;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(controller).build();
        image = new ImagesModel();
        image.setId(3L);
        image.setName("img.jpg");
    }

    @Test
    void getAllImages_returns_list() throws Exception {
        List<ImagesModel> list = Arrays.asList(image);
        when(imagesService.getAllImages()).thenReturn(list);

        mockMvc.perform(get("/api/images"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)));
    }

    @Test
    void getImagesByProductId_returns_list() throws Exception {
        when(imagesService.getImagesByProductId(1L)).thenReturn(Arrays.asList(image));

        mockMvc.perform(get("/api/images/product/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)));
    }

    @Test
    void getImageById_found() throws Exception {
        when(imagesService.getImageById(3L)).thenReturn(Optional.of(image));

        mockMvc.perform(get("/api/images/3"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(3)));
    }

    @Test
    void getImageById_not_found() throws Exception {
        when(imagesService.getImageById(99L)).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/images/99"))
                .andExpect(status().isNotFound());
    }

    @Test
    void addImage_returns_ok() throws Exception {
        when(imagesService.addImage(org.mockito.ArgumentMatchers.any(ImagesModel.class))).thenReturn(image);

        mockMvc.perform(post("/api/images")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"url\":\"img.jpg\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name", is("img.jpg")));
    }

    @Test
    void deleteImage_no_content() throws Exception {
        doNothing().when(imagesService).deleteImage(3L);
        mockMvc.perform(delete("/api/images/3"))
                .andExpect(status().isNoContent());
    }
}
