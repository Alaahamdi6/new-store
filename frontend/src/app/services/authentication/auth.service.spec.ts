import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { provideHttpClient } from '@angular/common/http';
import { PLATFORM_ID } from '@angular/core';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  const placeholderPassword = 'test-password-value';


  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthService,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: PLATFORM_ID, useValue: 'browser' },
      ],
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('login should POST and store user when token present', () => {
    let response: any;
    service.login('u@test.com', placeholderPassword).subscribe((res) => (response = res));

    const req = httpMock.expectOne('http://localhost:8090/api/auth/login');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ username: 'u@test.com', password: placeholderPassword });

    const backend = { id: 10, token: 'jwt123', status: 1, photo: 'p.png' };
    req.flush(backend);

    expect(response).toEqual(backend);
    const stored = JSON.parse(localStorage.getItem('currentUser') as string);
    expect(stored.username).toBe('u@test.com');
    expect(stored.token).toBe('jwt123');
    expect(service.getCurrentUserValue()).toBeTruthy();
  });

  it('login should not store when token missing', () => {
    service.login('a@b.com', placeholderPassword).subscribe();
    const req = httpMock.expectOne('http://localhost:8090/api/auth/login');
    req.flush({});

    expect(localStorage.getItem('currentUser')).toBeNull();
    expect(service.getCurrentUserValue()).toBeNull();
  });

  it('signup should POST and store user when token present', () => {
    let response: any;
    service.signup('new@test.com', placeholderPassword).subscribe((res) => (response = res));

    const req = httpMock.expectOne('http://localhost:8090/api/auth/signup');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ username: 'new@test.com', password: placeholderPassword });

    const backend = { id: 11, token: 'jwt999', status: 0, photo: 'avatar.jpg' };
    req.flush(backend);

    expect(response).toEqual(backend);
    const stored = JSON.parse(localStorage.getItem('currentUser') as string);
    expect(stored.username).toBe('new@test.com');
    expect(stored.token).toBe('jwt999');
    expect(service.getCurrentUserValue()).toBeTruthy();
  });

  it('logout should clear storage and subject', () => {
    localStorage.setItem('currentUser', JSON.stringify({ id: 1 }));
    (service as any).currentUserSubject.next({ id: 1 });

    service.logout();
    expect(localStorage.getItem('currentUser')).toBeNull();
    expect(service.getCurrentUserValue()).toBeNull();
  });

  afterEach(() => {
    httpMock.verify();
  });
});
