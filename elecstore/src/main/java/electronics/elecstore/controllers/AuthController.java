package electronics.elecstore.controllers;

import electronics.elecstore.dto.AuthResponse;
import electronics.elecstore.dto.LoginRequest;
import electronics.elecstore.dto.SignupRequest;
import electronics.elecstore.models.UsersModel;
import electronics.elecstore.security.CustomUserDetailsService;
import electronics.elecstore.security.JwtTokenUtil;
import electronics.elecstore.services.UsersService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:4200")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    @Autowired
    private CustomUserDetailsService userDetailsService;

    @Autowired
    private UsersService usersService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(
                loginRequest.getUsername(), 
                loginRequest.getPassword()
            )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        UserDetails userDetails = userDetailsService.loadUserByUsername(loginRequest.getUsername());
        String token = jwtTokenUtil.generateToken(userDetails);

        UsersModel user = usersService.getUserByUsername(loginRequest.getUsername())
            .orElseThrow(() -> new RuntimeException("User not found"));

        return ResponseEntity.ok(new AuthResponse(token, user.getUsername(), user.getStatus() , user.getId(), user.getPhoto()));
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody SignupRequest signupRequest) {
        // Check if username already exists
        if (usersService.getUserByUsername(signupRequest.getUsername()).isPresent()) {
        	return ResponseEntity.badRequest().body("Username already exists");
        }

        // Create new user
        UsersModel newUser = new UsersModel();
        newUser.setUsername(signupRequest.getUsername());
        newUser.setPassword(passwordEncoder.encode(signupRequest.getPassword()));
        newUser.setStatus(0);
        newUser.setPhoto("avatar.jpg");

        UsersModel createdUser = usersService.createUser(newUser);

        // Generate JWT token
        UserDetails userDetails = userDetailsService.loadUserByUsername(createdUser.getUsername());
        String token = jwtTokenUtil.generateToken(userDetails);

        return ResponseEntity.ok(new AuthResponse(token, createdUser.getUsername(), createdUser.getStatus(), createdUser.getId() , createdUser.getPhoto()));
    }
}