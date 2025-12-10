import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ProductService } from './product.service';
import { Product } from '../../models/product.model';
import { provideHttpClient } from '@angular/common/http';

describe('ProductService - Essential Tests', () => {
  let service: ProductService;
  let httpMock: HttpTestingController;

  const mockProducts: Product[] = [
    {
      id: 1,
      productName: 'Laptop',
      category: 'Electronics',
      description: 'High-end laptop',
      price: 1000,
      image: 'laptop.png',
      brand: 'Dell',
      popularity: 5,
      numberOfSales: 100,
      availableColors: 'Black,Silver',
      date: '2024-01-01',
    },
    {
      id: 2,
      productName: 'Phone',
      category: 'Electronics',
      description: 'Smartphone',
      price: 700,
      image: 'phone.png',
      brand: 'Samsung',
      popularity: 4,
      numberOfSales: 150,
      availableColors: 'Blue,White',
      date: '2024-01-02',
    },
  ];

  const mockProduct: Product = mockProducts[0];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProductService, provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(ProductService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('Service Creation', () => {
    it('should be created', () => {
      expect(service).toBeTruthy();
    });
  });

  describe('GET Operations', () => {
    it('should retrieve all products via GET', () => {
      service.getProducts().subscribe((products) => {
        expect(products.length).toBe(2);
        expect(products).toEqual(mockProducts);
      });

      const req = httpMock.expectOne('http://localhost:8090/api/products');
      expect(req.request.method).toBe('GET');
      req.flush(mockProducts);
    });

    it('should return empty array when no products exist', () => {
      service.getProducts().subscribe((products) => {
        expect(products.length).toBe(0);
        expect(products).toEqual([]);
      });

      const req = httpMock.expectOne('http://localhost:8090/api/products');
      req.flush([]);
    });

    it('should retrieve product by ID', () => {
      service.getProductById(1).subscribe((product) => {
        expect(product).toEqual(mockProduct);
        expect(product.id).toBe(1);
      });

      const req = httpMock.expectOne('http://localhost:8090/api/products/1');
      expect(req.request.method).toBe('GET');
      req.flush(mockProduct);
    });

    it('should retrieve products by category', () => {
      const categoryProducts = [mockProducts[0]];
      service.getProductsByCategory('Electronics').subscribe((products) => {
        expect(products.length).toBe(1);
        expect(products).toEqual(categoryProducts);
      });

      const req = httpMock.expectOne('http://localhost:8090/api/products/category/Electronics');
      expect(req.request.method).toBe('GET');
      req.flush(categoryProducts);
    });

    it('should handle error when getting products', () => {
      service.getProducts().subscribe(
        () => fail('should have failed with 404 error'),
        (error) => {
          expect(error.status).toBe(404);
        }
      );

      const req = httpMock.expectOne('http://localhost:8090/api/products');
      req.flush('Not found', { status: 404, statusText: 'Not Found' });
    });
  });

  describe('POST Operations', () => {
    it('should add a new product', () => {
      const newProduct: Product = {
        id: 3,
        productName: 'Keyboard',
        category: 'Accessories',
        description: 'Mechanical keyboard',
        price: 150,
        image: 'keyboard.png',
        brand: 'Corsair',
        popularity: 3,
        numberOfSales: 50,
        availableColors: 'Black',
        date: '2024-01-03',
      };

      service.addProduct(newProduct).subscribe((product) => {
        expect(product).toEqual(newProduct);
      });

      const req = httpMock.expectOne('http://localhost:8090/api/products');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(newProduct);
      req.flush(newProduct);
    });

    it('should handle error when adding product', () => {
      const newProduct = mockProduct;

      service.addProduct(newProduct).subscribe(
        () => fail('should have failed'),
        (error) => {
          expect(error.status).toBe(400);
        }
      );

      const req = httpMock.expectOne('http://localhost:8090/api/products');
      req.flush('Bad request', { status: 400, statusText: 'Bad Request' });
    });
  });

  describe('PUT Operations', () => {
    it('should update an existing product', () => {
      const updatedProduct = { ...mockProduct, productName: 'Updated Laptop' };

      service.updateProduct(1, updatedProduct).subscribe((product) => {
        expect(product.productName).toBe('Updated Laptop');
      });

      const req = httpMock.expectOne('http://localhost:8090/api/products/1');
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(updatedProduct);
      req.flush(updatedProduct);
    });

    it('should handle error when updating product', () => {
      service.updateProduct(999, mockProduct).subscribe(
        () => fail('should have failed'),
        (error) => {
          expect(error.status).toBe(404);
        }
      );

      const req = httpMock.expectOne('http://localhost:8090/api/products/999');
      req.flush('Product not found', { status: 404, statusText: 'Not Found' });
    });
  });

  describe('DELETE Operations', () => {
    it('should delete a product', () => {
      service.deleteProduct(1).subscribe(() => {
        expect(true).toBeTruthy();
      });

      const req = httpMock.expectOne('http://localhost:8090/api/products/1');
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });

    it('should handle error when deleting non-existent product', () => {
      service.deleteProduct(999).subscribe(
        () => fail('should have failed'),
        (error) => {
          expect(error.status).toBe(404);
        }
      );

      const req = httpMock.expectOne('http://localhost:8090/api/products/999');
      req.flush('Product not found', { status: 404, statusText: 'Not Found' });
    });
  });

  describe('Product Properties', () => {
    it('should handle product with all properties correctly', () => {
      service.getProducts().subscribe((products) => {
        const product = products[0];
        expect(product.id).toBe(1);
        expect(product.productName).toBe('Laptop');
        expect(product.category).toBe('Electronics');
        expect(product.price).toBe(1000);
        expect(product.brand).toBe('Dell');
        expect(product.popularity).toBe(5);
        expect(product.numberOfSales).toBe(100);
      });

      const req = httpMock.expectOne('http://localhost:8090/api/products');
      req.flush(mockProducts);
    });
  });
});
