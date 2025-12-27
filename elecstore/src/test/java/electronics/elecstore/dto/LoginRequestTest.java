package electronics.elecstore.dto;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class LoginRequestTest {

    @Test
    void testGettersAndSetters() {
        LoginRequest request = new LoginRequest();
        
        request.setUsername("testuser");
        request.setPassword("password123");

        assertEquals("testuser", request.getUsername());
        assertEquals("password123", request.getPassword());
    }

    @Test
    void testNullValues() {
        LoginRequest request = new LoginRequest();

        assertNull(request.getUsername());
        assertNull(request.getPassword());
    }

    @Test
    void testEmptyStrings() {
        LoginRequest request = new LoginRequest();
        
        request.setUsername("");
        request.setPassword("");

        assertEquals("", request.getUsername());
        assertEquals("", request.getPassword());
    }

    @Test
    void testSpecialCharacters() {
        LoginRequest request = new LoginRequest();
        
        request.setUsername("user@example.com");
        request.setPassword("P@ssw0rd!#$");

        assertEquals("user@example.com", request.getUsername());
        assertEquals("P@ssw0rd!#$", request.getPassword());
    }
}
