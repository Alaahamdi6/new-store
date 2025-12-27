package electronics.elecstore.dto;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class SignupRequestTest {

    @Test
    void testGettersAndSetters() {
        SignupRequest request = new SignupRequest();
        
        request.setUsername("newuser");
        request.setPassword("securepass123");

        assertEquals("newuser", request.getUsername());
        assertEquals("securepass123", request.getPassword());
    }

    @Test
    void testNullValues() {
        SignupRequest request = new SignupRequest();

        assertNull(request.getUsername());
        assertNull(request.getPassword());
    }

    @Test
    void testEmptyStrings() {
        SignupRequest request = new SignupRequest();
        
        request.setUsername("");
        request.setPassword("");

        assertEquals("", request.getUsername());
        assertEquals("", request.getPassword());
    }

    @Test
    void testLongValues() {
        SignupRequest request = new SignupRequest();
        String longUsername = "a".repeat(100);
        String longPassword = "P@ss".repeat(50);
        
        request.setUsername(longUsername);
        request.setPassword(longPassword);

        assertEquals(longUsername, request.getUsername());
        assertEquals(longPassword, request.getPassword());
    }

    @Test
    void testSpecialCharactersInUsername() {
        SignupRequest request = new SignupRequest();
        
        request.setUsername("user-name_123");
        request.setPassword("password");

        assertEquals("user-name_123", request.getUsername());
    }
}
