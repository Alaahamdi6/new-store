import { Injectable , PLATFORM_ID, Inject} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public currentUserSubject = new BehaviorSubject<any>(null);
  private apiUrl = 'http://localhost:8090/api/auth';
  public currentUser$: Observable<any> = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient,@Inject(PLATFORM_ID) private platformId: Object) {
    // Safe localStorage check
    this.currentUserSubject = new BehaviorSubject<User | null>(this.getSafeLocalStorageItem('currentUser'));
    const user = isPlatformBrowser(this.platformId)? this.getSafeLocalStorageItem('currentUser'): null;

    this.currentUserSubject = new BehaviorSubject<User | null>(user);
    if (user) {
      this.currentUserSubject.next(user);
    }
  }

  get currentUser(): Observable<User | null> {
    return this.currentUserSubject.asObservable();
  }

  private safeLocalStorage(): Storage | null {
    return (typeof localStorage !== 'undefined') ? localStorage : null;
  }
  
  private getSafeLocalStorageItem(key: string): any {
    const storage = this.safeLocalStorage();
    if (storage) {
      const item = storage.getItem(key);
      return item ? JSON.parse(item) : null;
    }
    return null;
  }
  
  private setSafeLocalStorageItem(key: string, value: any): void {
    const storage = this.safeLocalStorage();
    if (storage) {
      storage.setItem(key, JSON.stringify(value));
    }
  }
  
  private removeSafeLocalStorageItem(key: string): void {
    const storage = this.safeLocalStorage();
    if (storage) {
      storage.removeItem(key);
    }
  }
  

  login(username: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, { username, password })
      .pipe(map(response => {
        // Login successful if there's a jwt token in the response
        if (response && response.token) {
          // Store user details and jwt token in local storage
          const userDetails = { 
            id: response.id,
            username : username, 
            token: response.token,
            status: response.status,
            photo: response.photo
             
          };
          console.log('Backend Response:', response);

          this.setSafeLocalStorageItem('currentUser', userDetails);
          this.currentUserSubject.next(userDetails);
        }
        return response;
      }));
  }

  signup(username: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/signup`, { username, password })
      .pipe(
        map(response => {
          // If signup is successful and returns a JWT, similar to login flow
          if (response && response.token) {
            const userDetails = {
              id: response.id,
              username : username, 
              token: response.token,
              status: response.status || 0 ,
              photo: response.photo || "avatar.jpg" 
            };
            
            // Store user details in local storage
            this.setSafeLocalStorageItem('currentUser', userDetails);
            
            // Update the current user subject
            this.currentUserSubject.next(userDetails);
          }
          return response;
        })
      );
  }

  logout() {
    // Remove user from local storage
    this.removeSafeLocalStorageItem('currentUser');
    this.currentUserSubject.next(null);
  }

  getCurrentUserValue() {
    return this.currentUserSubject.value;
  }
}
