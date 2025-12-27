package electronics.elecstore.controllers;

import electronics.elecstore.models.NotificationsModel;
import electronics.elecstore.services.NotificationsService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.Arrays;

import static org.hamcrest.Matchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

class NotificationsControllerTest {
    private MockMvc mockMvc;

    @Mock
    private NotificationsService notificationsService;

    @InjectMocks
    private NotificationsController controller;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(controller).build();
    }

    @Test
    void userNotifications() throws Exception {
        when(notificationsService.getUserNotifications(1L)).thenReturn(Arrays.asList(new NotificationsModel()));
        mockMvc.perform(get("/api/notifications/user/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)));
    }

    @Test
    void unreadNotifications() throws Exception {
        when(notificationsService.getUnreadNotifications(1L)).thenReturn(Arrays.asList(new NotificationsModel()));
        mockMvc.perform(get("/api/notifications/user/1/unread"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)));
    }

    @Test
    void unreadCount() throws Exception {
        when(notificationsService.getUnreadCount(1L)).thenReturn(3L);
        mockMvc.perform(get("/api/notifications/user/1/unread-count"))
                .andExpect(status().isOk())
                .andExpect(content().string("3"));
    }

    @Test
    void markAsRead() throws Exception {
        NotificationsModel model = new NotificationsModel();
        when(notificationsService.markAsRead(9L)).thenReturn(model);
        mockMvc.perform(put("/api/notifications/9/mark-as-read"))
            .andExpect(status().isOk());
    }
}
