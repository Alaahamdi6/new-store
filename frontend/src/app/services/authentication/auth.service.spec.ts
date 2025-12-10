import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController ,provideHttpClientTesting} from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { provideHttpClient } from '@angular/common/http';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;


  beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule], // Import HttpClientTestingModule
        providers: [AuthService,
          provideHttpClient(),
          provideHttpClientTesting()
        ]
      });
      service = TestBed.inject(AuthService);
      httpMock = TestBed.inject(HttpTestingController);
    });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
