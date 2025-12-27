package electronics.elecstore.controllers;

import electronics.elecstore.models.UsersModel;
import electronics.elecstore.services.UsersService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.hamcrest.Matchers.*;

class UsersControllerTest {

    private MockMvc mockMvc;

    @Mock
    private UsersService usersService;

    @InjectMocks
    private UsersController controller;

    private UsersModel user1;
    private UsersModel user2;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(controller).build();

        user1 = new UsersModel();
        user1.setId(1);
        user1.setUsername("john_doe");
        user1.setPassword("hashed_password");
        user1.setStatus(0);

        user2 = new UsersModel();
        user2.setId(2);
        user2.setUsername("jane_doe");
        user2.setPassword("hashed_password");
        user2.setStatus(1);
    }

    @Test
    void testGetAllUsers() throws Exception {
        List<UsersModel> users = Arrays.asList(user1, user2);
        when(usersService.getAllUsers()).thenReturn(users);

        mockMvc.perform(get("/api/users"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].username", is("john_doe")))
                .andExpect(jsonPath("$[1].username", is("jane_doe")));

        verify(usersService, times(1)).getAllUsers();
    }

    @Test
    void testGetUserById_Success() throws Exception {
        when(usersService.getUserById(1)).thenReturn(Optional.of(user1));

        mockMvc.perform(get("/api/users/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.username", is("john_doe")));

        verify(usersService, times(1)).getUserById(1);
    }

    @Test
    void testGetUserById_NotFound() throws Exception {
        when(usersService.getUserById(999)).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/users/999"))
                .andExpect(status().isNotFound());

        verify(usersService, times(1)).getUserById(999);
    }

    @Test
    void testCreateUser() throws Exception {
        when(usersService.createUser(any(UsersModel.class))).thenReturn(user1);

        mockMvc.perform(post("/api/users")
                .contentType("application/json")
                .content("{\"username\":\"john_doe\",\"password\":\"hashed_password\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.username", is("john_doe")));

        verify(usersService, times(1)).createUser(any(UsersModel.class));
    }

    @Test
    void testDeleteUser_Success() throws Exception {
        when(usersService.getUserById(1)).thenReturn(Optional.of(user1));
        doNothing().when(usersService).deleteUser(1);

        mockMvc.perform(delete("/api/users/1"))
                .andExpect(status().isNoContent());

        verify(usersService, times(1)).deleteUser(1);
    }
}
