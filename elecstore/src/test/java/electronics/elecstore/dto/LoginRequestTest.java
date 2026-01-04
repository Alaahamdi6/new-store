package electronics.elecstore.dto;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class LoginRequestTest {
    
    private static final String TEST_PASSWORD = "testpassword";

    @Test
    void testGettersAndSetters() {
        LoginRequest request = new LoginRequest();
        
        request.setUsername("testuser");
        request.setPassword(TEST_PASSWORD);

        assertEquals("testuser", request.getUsername());
        assertEquals(TEST_PASSWORD, request.getPassword());
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
        request.setPassword(TEST_PASSWORD);

        assertEquals("user@example.com", request.getUsername());
        assertEquals(TEST_PASSWORD, request.getPassword());
    }
}
