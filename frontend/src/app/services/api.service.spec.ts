import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ApiService } from './api.service';

describe('ApiService', () => {
  let service: ApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ApiService]
    });
    service = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch dashboard stats', () => {
    const mockStats = {
      stats: { total_books: 100, total_users: 50, active_loans: 25, overdue_loans: 5 },
      popular_books: [],
      recent_loans: []
    };

    service.getDashboardStats().subscribe(stats => {
      expect(stats).toEqual(mockStats);
    });

    const req = httpMock.expectOne(`${service['baseUrl']}/dashboard/stats`);
    expect(req.request.method).toBe('GET');
    req.flush(mockStats);
  });

  it('should fetch books', () => {
    const mockBooks = [
      { id: 1, title: 'Test Book', author: 'Test Author', available: 1 }
    ];

    service.getBooks().subscribe(books => {
      expect(books).toEqual(mockBooks);
    });

    const req = httpMock.expectOne(`${service['baseUrl']}/books`);
    expect(req.request.method).toBe('GET');
    req.flush(mockBooks);
  });

  it('should handle errors gracefully', () => {
    service.getBooks().subscribe({
      next: () => fail('should have failed'),
      error: (error) => {
        expect(error.status).toBe(500);
      }
    });

    const req = httpMock.expectOne(`${service['baseUrl']}/books`);
    req.flush('Server Error', { status: 500, statusText: 'Internal Server Error' });
  });
});