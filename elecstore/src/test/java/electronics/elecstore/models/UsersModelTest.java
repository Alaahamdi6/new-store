package electronics.elecstore.models;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class UsersModelTest {

    @Test
    void testUsersModelSettersAndGetters() {
        UsersModel user = new UsersModel();
        
        user.setId(1);
        user.setUsername("john_doe");
        user.setPassword("secure_password");
        user.setStatus(0);
        user.setPhoto("profile.jpg");

        assertEquals(1, user.getId());
        assertEquals("john_doe", user.getUsername());
        assertEquals("secure_password", user.getPassword());
        assertEquals(0, user.getStatus());
        assertEquals("profile.jpg", user.getPhoto());
    }

    @Test
    void testUsersModelDefaultConstructor() {
        UsersModel user = new UsersModel();
        assertNotNull(user);
    }

    @Test
    void testUserStatusValues() {
        UsersModel regularUser = new UsersModel();
        regularUser.setStatus(0);
        assertEquals(0, regularUser.getStatus()); // Regular user

        UsersModel adminUser = new UsersModel();
        adminUser.setStatus(1);
        assertEquals(1, adminUser.getStatus()); // Admin user
    }
}
