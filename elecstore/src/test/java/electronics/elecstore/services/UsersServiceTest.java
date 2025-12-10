package electronics.elecstore.services;

import electronics.elecstore.models.UsersModel;
import electronics.elecstore.repositories.UsersRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Arrays;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class UsersServiceTest {

    @InjectMocks
    private UsersService usersService;

    @Mock
    private UsersRepository usersRepository;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void getAllUsers() {
        when(usersRepository.findAll()).thenReturn(Arrays.asList(new UsersModel(), new UsersModel()));
        assertEquals(2, usersService.getAllUsers().size());
    }

    @Test
    void getUserById() {
        UsersModel user = new UsersModel();
        user.setId(1);
        when(usersRepository.findById(1)).thenReturn(Optional.of(user));
        assertTrue(usersService.getUserById(1).isPresent());
    }

    @Test
    void createUser() {
        UsersModel user = new UsersModel();
        user.setUsername("test");
        when(usersRepository.save(user)).thenReturn(user);
        assertEquals("test", usersService.createUser(user).getUsername());
    }

    @Test
    void updateUser() {
        UsersModel user = new UsersModel();
        user.setId(1);
        user.setUsername("test");
        when(usersRepository.findById(1)).thenReturn(Optional.of(user));
        when(usersRepository.save(user)).thenReturn(user);
        UsersModel updatedUser = usersService.updateUser(1, user);
        assertEquals("test", updatedUser.getUsername());
    }

    @Test
    void deleteUser() {
        doNothing().when(usersRepository).deleteById(1);
        usersService.deleteUser(1);
        verify(usersRepository, times(1)).deleteById(1);
    }
}
