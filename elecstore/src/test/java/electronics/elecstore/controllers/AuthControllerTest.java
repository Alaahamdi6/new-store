package electronics.elecstore.controllers;

import electronics.elecstore.dto.LoginRequest;
import electronics.elecstore.dto.SignupRequest;
import electronics.elecstore.models.UsersModel;
import electronics.elecstore.security.CustomUserDetailsService;
import electronics.elecstore.security.JwtTokenUtil;
import electronics.elecstore.services.UsersService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.hamcrest.Matchers.is;

class AuthControllerTest {

    private MockMvc mockMvc;

    @Mock
    private AuthenticationManager authenticationManager;
    @Mock
    private JwtTokenUtil jwtTokenUtil;
    @Mock
    private CustomUserDetailsService userDetailsService;
    @Mock
    private UsersService usersService;
    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private AuthController controller;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(controller).build();
    }

    @Test
    void login_success_returns_token_and_user() throws Exception {
        String username = "john";
        String password = "pass";

        Authentication auth = mock(Authentication.class);
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class))).thenReturn(auth);
        UserDetails userDetails = User.withUsername(username).password("pwd").roles("USER").build();
        when(userDetailsService.loadUserByUsername(username)).thenReturn(userDetails);
        when(jwtTokenUtil.generateToken(userDetails)).thenReturn("token123");
        UsersModel user = new UsersModel();
        user.setUsername(username);
        user.setStatus(1);
        user.setId(42);
        user.setPhoto("avatar.jpg");
        when(usersService.getUserByUsername(username)).thenReturn(Optional.of(user));

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"username\":\"john\",\"password\":\"pass\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.username", is("john")))
                .andExpect(jsonPath("$.token", is("token123")))
                .andExpect(jsonPath("$.status", is(1)))
                .andExpect(jsonPath("$.id", is(42)))
                .andExpect(jsonPath("$.photo", is("avatar.jpg")));
    }

    @Test
    void signup_existing_username_returns_bad_request() throws Exception {
        SignupRequest signup = new SignupRequest();
        signup.setUsername("existing");
        signup.setPassword("pwd");
        when(usersService.getUserByUsername("existing")).thenReturn(Optional.of(new UsersModel()));

        mockMvc.perform(post("/api/auth/signup")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"username\":\"existing\",\"password\":\"pwd\"}"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void signup_success_returns_token() throws Exception {
        when(usersService.getUserByUsername("newuser")).thenReturn(Optional.empty());
        when(passwordEncoder.encode("pwd")).thenReturn("encpwd");
        UsersModel created = new UsersModel();
        created.setUsername("newuser");
        created.setStatus(0);
        created.setId(7);
        created.setPhoto("avatar.jpg");
        when(usersService.createUser(any(UsersModel.class))).thenReturn(created);
        UserDetails details = User.withUsername("newuser").password("encpwd").roles("USER").build();
        when(userDetailsService.loadUserByUsername("newuser")).thenReturn(details);
        when(jwtTokenUtil.generateToken(details)).thenReturn("tokXYZ");

        mockMvc.perform(post("/api/auth/signup")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"username\":\"newuser\",\"password\":\"pwd\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.username", is("newuser")))
                .andExpect(jsonPath("$.token", is("tokXYZ")))
                .andExpect(jsonPath("$.id", is(7)));
    }
}
