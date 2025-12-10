import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UserService } from './user.service';
import { User } from '../../models/user.model';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;
  const baseUrl = 'http://localhost:8090/api/users';

  const mockUsers: User[] = [
    { id: 1, username: 'u1', token: 't1', status: 0, photo: 'p1' },
    { id: 2, username: 'u2', token: 't2', status: 1, photo: 'p2' }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserService]
    });
    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Ensures that no HTTP requests are pending
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getUsers should GET list of users', () => {
    service.getUsers().subscribe(res => {
      expect(res).toEqual(mockUsers);
      expect(res.length).toBe(2);
    });

    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockUsers);
  });

  it('getUserById should GET a single user by id', () => {
    service.getUserById(1).subscribe(res => {
      expect(res).toEqual(mockUsers[0]);
    });

    const req = httpMock.expectOne(`${baseUrl}/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockUsers[0]);
  });

  it('addUser should POST and return created user', () => {
    const newUser: User = { id: 3, username: 'u3', token: 't3', status: 0, photo: 'p3' };
    service.addUser(newUser).subscribe(res => {
      expect(res).toEqual(newUser);
    });

    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newUser);
    req.flush(newUser);
  });

  it('updateUser should PUT formdata and return updated user', () => {
    const fd = new FormData();
    fd.append('username', 'updated');
    const returned = { id: 1, username: 'updated', token: 't1', status: 0, photo: 'p1' } as User;
    service.updateUser(1, fd).subscribe(res => {
      expect(res).toEqual(returned);
    });

    const req = httpMock.expectOne(`${baseUrl}/1`);
    expect(req.request.method).toBe('PUT');
    req.flush(returned);
  });

  it('deleteUser should DELETE and return void', () => {
    service.deleteUser(2).subscribe(res => {
      expect(res).toBeUndefined();
    });

    const req = httpMock.expectOne(`${baseUrl}/2`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});

