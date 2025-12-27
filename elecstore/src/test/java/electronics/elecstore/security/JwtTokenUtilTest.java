package electronics.elecstore.security;

import io.jsonwebtoken.Claims;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.Collections;
import java.util.Date;

import static org.junit.jupiter.api.Assertions.*;

class JwtTokenUtilTest {

    private JwtTokenUtil jwtTokenUtil;
    private UserDetails userDetails;

    @BeforeEach
    void setUp() {
        jwtTokenUtil = new JwtTokenUtil();
        // Set test values using reflection
        ReflectionTestUtils.setField(jwtTokenUtil, "secret", "thisIsASuperLongUnitTestSecretKeyAtLeastSixtyFourBytesLength_12345_thisIsPadding");
        ReflectionTestUtils.setField(jwtTokenUtil, "expiration", 3600L); // 1 hour
        
        userDetails = new User("testuser", "password", 
                Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER")));
    }

    @Test
    void testGenerateToken() {
        String token = jwtTokenUtil.generateToken(userDetails);
        assertNotNull(token);
        assertFalse(token.isEmpty());
    }

    @Test
    void testGetUsernameFromToken() {
        String token = jwtTokenUtil.generateToken(userDetails);
        String username = jwtTokenUtil.getUsernameFromToken(token);
        assertEquals("testuser", username);
    }

    @Test
    void testGetExpirationDateFromToken() {
        String token = jwtTokenUtil.generateToken(userDetails);
        Date expirationDate = jwtTokenUtil.getExpirationDateFromToken(token);
        assertNotNull(expirationDate);
        assertTrue(expirationDate.after(new Date()));
    }

    @Test
    void testGetClaimFromToken() {
        String token = jwtTokenUtil.generateToken(userDetails);
        String subject = jwtTokenUtil.getClaimFromToken(token, Claims::getSubject);
        assertEquals("testuser", subject);
    }

    @Test
    void testValidateToken_ValidToken() {
        String token = jwtTokenUtil.generateToken(userDetails);
        Boolean isValid = jwtTokenUtil.validateToken(token, userDetails);
        assertTrue(isValid);
    }

    @Test
    void testValidateToken_WrongUsername() {
        String token = jwtTokenUtil.generateToken(userDetails);
        UserDetails wrongUser = new User("wronguser", "password", 
                Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER")));
        Boolean isValid = jwtTokenUtil.validateToken(token, wrongUser);
        assertFalse(isValid);
    }

    @Test
    void testValidateToken_ExpiredToken() {
        // Create token with very short expiration
        ReflectionTestUtils.setField(jwtTokenUtil, "expiration", -1L);
        String token = jwtTokenUtil.generateToken(userDetails);
        
        // Reset expiration for validation
        ReflectionTestUtils.setField(jwtTokenUtil, "expiration", 3600L);
        
        assertThrows(io.jsonwebtoken.ExpiredJwtException.class, () -> jwtTokenUtil.validateToken(token, userDetails));
    }

    @Test
    void testTokenContainsIssuedAt() {
        String token = jwtTokenUtil.generateToken(userDetails);
        Date issuedAt = jwtTokenUtil.getClaimFromToken(token, Claims::getIssuedAt);
        assertNotNull(issuedAt);
        assertTrue(issuedAt.before(new Date(System.currentTimeMillis() + 1000)));
    }

    @Test
    void testMultipleTokensForSameUser() {
        String token1 = jwtTokenUtil.generateToken(userDetails);
        try { Thread.sleep(10); } catch (InterruptedException ignored) {}
        String token2 = jwtTokenUtil.generateToken(userDetails);
        
        // Both should be valid
        assertTrue(jwtTokenUtil.validateToken(token1, userDetails));
        assertTrue(jwtTokenUtil.validateToken(token2, userDetails));
        
        // Tokens may be identical if generated within the same second
    }
}
