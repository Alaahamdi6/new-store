package electronics.elecstore.security;

import electronics.elecstore.models.UsersModel;
import electronics.elecstore.repositories.UsersRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CustomUserDetailsServiceTest {

    @Mock
    private UsersRepository usersRepository;

    @InjectMocks
    private CustomUserDetailsService customUserDetailsService;

    private UsersModel adminUser;
    private UsersModel regularUser;

    @BeforeEach
    void setUp() {
        adminUser = new UsersModel();
        adminUser.setId(1);
        adminUser.setUsername("admin");
        adminUser.setPassword("$2a$10$hashedpassword");
        adminUser.setStatus(1); // Admin

        regularUser = new UsersModel();
        regularUser.setId(2);
        regularUser.setUsername("user");
        regularUser.setPassword("$2a$10$hashedpassword");
        regularUser.setStatus(0); // Regular user
    }

    @Test
    void testLoadUserByUsername_AdminUser() {
        when(usersRepository.findByUsername("admin")).thenReturn(Optional.of(adminUser));

        UserDetails userDetails = customUserDetailsService.loadUserByUsername("admin");

        assertNotNull(userDetails);
        assertEquals("admin", userDetails.getUsername());
        assertEquals("$2a$10$hashedpassword", userDetails.getPassword());
        assertTrue(userDetails.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN")));
        verify(usersRepository, times(1)).findByUsername("admin");
    }

    @Test
    void testLoadUserByUsername_RegularUser() {
        when(usersRepository.findByUsername("user")).thenReturn(Optional.of(regularUser));

        UserDetails userDetails = customUserDetailsService.loadUserByUsername("user");

        assertNotNull(userDetails);
        assertEquals("user", userDetails.getUsername());
        assertTrue(userDetails.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_USER")));
        verify(usersRepository, times(1)).findByUsername("user");
    }

    @Test
    void testLoadUserByUsername_UserNotFound() {
        when(usersRepository.findByUsername("nonexistent")).thenReturn(Optional.empty());

        assertThrows(UsernameNotFoundException.class, () -> {
            customUserDetailsService.loadUserByUsername("nonexistent");
        });
        verify(usersRepository, times(1)).findByUsername("nonexistent");
    }

    @Test
    void testLoadUserByUsername_NullOrEmptyUsername() {
        when(usersRepository.findByUsername(null)).thenReturn(Optional.empty());
        when(usersRepository.findByUsername("")).thenReturn(Optional.empty());

        assertThrows(UsernameNotFoundException.class, () -> customUserDetailsService.loadUserByUsername(null));
        assertThrows(UsernameNotFoundException.class, () -> customUserDetailsService.loadUserByUsername(""));
    }

    @Test
    void testAdminUserHasCorrectAuthority() {
        when(usersRepository.findByUsername("admin")).thenReturn(Optional.of(adminUser));

        UserDetails userDetails = customUserDetailsService.loadUserByUsername("admin");

        assertEquals(1, userDetails.getAuthorities().size());
        assertTrue(userDetails.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN")));
        assertFalse(userDetails.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_USER")));
    }

    @Test
    void testRegularUserHasCorrectAuthority() {
        when(usersRepository.findByUsername("user")).thenReturn(Optional.of(regularUser));

        UserDetails userDetails = customUserDetailsService.loadUserByUsername("user");

        assertEquals(1, userDetails.getAuthorities().size());
        assertTrue(userDetails.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_USER")));
        assertFalse(userDetails.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN")));
    }
}
