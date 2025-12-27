package electronics.elecstore.dto;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class AuthResponseTest {

    @Test
    void testConstructorAndGetters() {
        AuthResponse response = new AuthResponse("token123", "testuser", 1, 100, "photo.jpg");

        assertEquals("token123", response.getToken());
        assertEquals("testuser", response.getUsername());
        assertEquals(1, response.getStatus());
        assertEquals(100, response.getId());
        assertEquals("photo.jpg", response.getPhoto());
    }

    @Test
    void testSetters() {
        AuthResponse response = new AuthResponse("", "", 0, 0, "");

        response.setToken("newToken");
        response.setUsername("newUser");
        response.setStatus(2);
        response.setPhoto("newPhoto.jpg");

        assertEquals("newToken", response.getToken());
        assertEquals("newUser", response.getUsername());
        assertEquals(2, response.getStatus());
        assertEquals("newPhoto.jpg", response.getPhoto());
    }

    @Test
    void testNullValues() {
        AuthResponse response = new AuthResponse(null, null, null, null, null);

        assertNull(response.getToken());
        assertNull(response.getUsername());
        assertNull(response.getStatus());
        assertNull(response.getId());
        assertNull(response.getPhoto());
    }

    @Test
    void testAdminStatus() {
        AuthResponse adminResponse = new AuthResponse("adminToken", "admin", 1, 1, "admin.jpg");
        assertEquals(1, adminResponse.getStatus());
    }

    @Test
    void testUserStatus() {
        AuthResponse userResponse = new AuthResponse("userToken", "user", 0, 2, "user.jpg");
        assertEquals(0, userResponse.getStatus());
    }
}
