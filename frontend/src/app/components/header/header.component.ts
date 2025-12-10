import { Component , OnInit, PLATFORM_ID, Inject,OnDestroy  } from '@angular/core';
import { FormBuilder, FormGroup, Validators , ReactiveFormsModule} from '@angular/forms';
import { AuthService } from '../../services/authentication/auth.service';
import { CartService } from '../../services/cart/cart.service';
import { AuthStateService } from '../../services/authState/auth-state.service';
import { TestimonialService } from '../../services/testimonial/testimonial.service';
import { CommonModule,isPlatformBrowser } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { RouterModule ,Router,NavigationEnd} from '@angular/router';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-header',
  imports:[CommonModule,ReactiveFormsModule,RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit ,OnDestroy{
  loginForm: FormGroup;
  signupForm: FormGroup;
  loginError: string | null = null;
  signupError: string | null = null;
  currentUser: any = null;
  private subscription: Subscription |null=null;
  private routerSubscription: Subscription | null=null ;
  userDetails: any = null;
  hasToasterShown: any = null;
  cartItemCount: number = 0;
  testimonials: any[] = [];
  status: number = 0;
  dropdownOpen = false;

  constructor(private fb: FormBuilder, private authService: AuthService ,private testimonialService: TestimonialService ,private cartService: CartService,@Inject(PLATFORM_ID) private platformId: Object,private toastr: ToastrService,private router: Router,private authStateService: AuthStateService) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });

    this.signupForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  
  }
  ngOnInit(): void {

    if (isPlatformBrowser(this.platformId) && typeof document !== 'undefined' && localStorage.getItem('currentUser')) {
      this.hasToasterShown = localStorage.getItem('toasterShown');
      this.userDetails = JSON.parse(localStorage.getItem('currentUser') || 'null');
      this.status = this.userDetails.status;
      this.authStateService.setCurrentUser(this.userDetails);
      if (this.userDetails && !this.hasToasterShown ) {
        this.toastr.success('Welcome, ' + this.userDetails.username + '!', 'Login Successful');
        localStorage.setItem('toasterShown', 'true');
        
      }
      this.currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
      this.subscription = this.authStateService.currentUser$.subscribe((user) => {
        if (user){
        this.currentUser = user;
        }
        this.loadCartCount();
        this.subscribeToCartChanges();
      });

      this.routerSubscription = this.router.events.subscribe((event) => {
        if (event instanceof NavigationEnd) {
          this.dropdownOpen = false; // Close the dropdown on route change
        }
      });
    this.loadTestimonials();  
   
    } 
    
    
  }

  isAdmin(): boolean {
    return (isPlatformBrowser(this.platformId)&& localStorage.getItem('currentUser')!= null && this.status === 1);
  }
  ngOnDestroy(): void {
    // Unsubscribe to avoid memory leaks
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  handleLogin(): void {
    const { username, password } = this.loginForm.value;
    localStorage.removeItem('toasterShown');
    this.authService.login(username, password).subscribe(
      (response) => {
        this.loginError = null;
        // Save user details to localStorage
        const userDetails = {
          id: response.id,
          token: response.token, 
          username: response.username,
          status: response.status,
          photo: response.photo
        };
        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem('currentUser', JSON.stringify(userDetails));
        }
        this.currentUser = userDetails;
        this.authService.currentUserSubject.next(userDetails); 
        window.location.reload();
      },
      (error) => {
        this.loginError = 'Invalid username or password';
        console.error('Login failed:', error);

      }
    );
    
  }
  

  handleSignup(): void {
    const { username, password } = this.signupForm.value;
    this.authService.signup(username, password).subscribe(
      () => {
        this.signupError = null;
        alert('Signup successful! Please log in.');
        window.location.reload();
      },
      (error) => {
        this.signupError = 'Failed to sign up. Try again later.';
      }
    );
  }

  clearErrors(): void {
    this.loginError = null;
    this.signupError = null;
  }

  loadCartCount(): void {
    const userDetails = JSON.parse(localStorage.getItem('currentUser') || '{}');
    if (userDetails && userDetails.id) {
      this.cartService.getCartItems(userDetails.id).subscribe(
        (cartItems) => {
          this.cartItemCount = cartItems.length; 
        },
        (error) => {
          console.error('Failed to load cart items:', error);
          this.cartItemCount = 0; 
        }
      );
    } else {
      this.cartItemCount = 0; // No user logged in
    }
  }
  

  subscribeToCartChanges(): void {
    this.cartService.cartUpdated$.subscribe(() => {
      this.loadCartCount(); // Reload the cart count when notified
    });
  }

  loadTestimonials(): void {
    this.testimonialService.getTestimonials().subscribe((data) => {
      this.testimonials = data;
    });
  }

  toggleDropdown(): void {
    this.dropdownOpen = !this.dropdownOpen;
  }

  logout(): void {
    this.authService.logout();
    this.currentUser = null;
    this.dropdownOpen = false; 
    this.router.navigate(['/']);
  }

}
