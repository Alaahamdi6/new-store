import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { ProductsComponent } from './products.component';
import { ProductService } from '../../services/product/product.service';
import { CartService } from '../../services/cart/cart.service';
import { ImagesService } from '../../services/images/images.service';
import { WishlistService } from '../../services/wishlist/wishlist.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { Product } from '../../models/product.model';

describe('ProductsComponent - Essential Tests', () => {
  let component: ProductsComponent;
  let fixture: ComponentFixture<ProductsComponent>;
  let productServiceSpy: jasmine.SpyObj<ProductService>;
  let cartServiceSpy: jasmine.SpyObj<CartService>;
  let imagesServiceSpy: jasmine.SpyObj<ImagesService>;
  let wishlistServiceSpy: jasmine.SpyObj<WishlistService>;
  let toastrSpy: jasmine.SpyObj<ToastrService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let httpMock: HttpTestingController;

  const mockProducts: Product[] = [
    {
      id: 1,
      productName: 'Laptop',
      category: 'Electronics',
      brand: 'Dell',
      price: 1000,
      image: 'laptop.jpg',
      description: 'High performance laptop',
      date: '2024-01-01',
      availableColors: 'Black,Silver',
      popularity: 5,
      numberOfSales: 100,
    },
    {
      id: 2,
      productName: 'Mouse',
      category: 'Accessories',
      brand: 'Logitech',
      price: 50,
      image: 'mouse.jpg',
      description: 'Wireless mouse',
      date: '2024-01-02',
      availableColors: 'Black',
      popularity: 4,
      numberOfSales: 200,
    },
  ];

  beforeEach(async () => {
    productServiceSpy = jasmine.createSpyObj('ProductService', [
      'getProducts',
      'getProductById',
      'getProductsByCategory',
      'addProduct',
      'updateProduct',
      'deleteProduct',
    ]);
    cartServiceSpy = jasmine.createSpyObj('CartService', [
      'getCart',
      'getCartItems',
      'addItem',
      'removeItem',
      'updateQuantity',
    ]);
    imagesServiceSpy = jasmine.createSpyObj('ImagesService', ['getImagesByProductId']);
    wishlistServiceSpy = jasmine.createSpyObj('WishlistService', [
      'getWishlistByUser',
      'addProductToWishlist',
      'removeProductFromWishlist',
    ]);
    toastrSpy = jasmine.createSpyObj('ToastrService', ['success', 'error', 'info']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    // make getCartItems and addItem safe by default to avoid intermittent undefined subscribe errors
    cartServiceSpy.getCartItems.and.returnValue(of([]));
    cartServiceSpy.addItem.and.returnValue(of({}));

    await TestBed.configureTestingModule({
      imports: [ProductsComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ProductService, useValue: productServiceSpy },
        { provide: CartService, useValue: cartServiceSpy },
        { provide: ImagesService, useValue: imagesServiceSpy },
        { provide: WishlistService, useValue: wishlistServiceSpy },
        { provide: ToastrService, useValue: toastrSpy },
        { provide: Router, useValue: routerSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductsComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  describe('Component Initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize forms in constructor', () => {
      expect(component.productForm).toBeDefined();
      expect(component.editproductForm).toBeDefined();
    });

    it('should load products and wishlist on init', () => {
      productServiceSpy.getProducts.and.returnValue(of(mockProducts));
      wishlistServiceSpy.getWishlistByUser.and.returnValue(of({}));
      localStorage.setItem('currentUser', JSON.stringify({ id: 1, status: 0 }));

      component.ngOnInit();

      expect(component.products).toEqual(mockProducts);
      expect(component.totalPages).toBe(1);
    });
  });

  describe('Product Loading & Pagination', () => {
    it('should load products successfully', () => {
      productServiceSpy.getProducts.and.returnValue(of(mockProducts));
      component.loadProducts();
      expect(component.products).toEqual(mockProducts);
      expect(component.totalPages).toBe(1);
    });

    it('should handle error when loading products', () => {
      productServiceSpy.getProducts.and.returnValue(
        throwError(() => new Error('Network error'))
      );
      component.fetchProducts();
      // Error should be logged, component should handle gracefully
      expect(component.products).toBeDefined();
    });

    it('should calculate pagination correctly', () => {
      component.products = mockProducts;
      component.itemsPerPage = 1;
      component.totalPages = Math.ceil(mockProducts.length / component.itemsPerPage);
      component.currentPage = 1;

      expect(component.paginatedProducts.length).toBe(1);
      expect(component.paginatedProducts[0]).toEqual(mockProducts[0]);
    });

    it('should change page within valid range', () => {
      component.totalPages = 5;
      component.changePage(3);
      expect(component.currentPage).toBe(3);
    });

    it('should not change to invalid page', () => {
      component.totalPages = 5;
      component.currentPage = 1;
      component.changePage(10);
      expect(component.currentPage).toBe(1);
    });

    it('should fetch products by category', () => {
      const categoryProducts = [mockProducts[0]];
      productServiceSpy.getProductsByCategory.and.returnValue(of(categoryProducts));

      component.fetchProductsByCategory('Electronics');

      expect(productServiceSpy.getProductsByCategory).toHaveBeenCalledWith('Electronics');
      expect(component.products).toEqual(categoryProducts);
    });
  });

  describe('Product CRUD Operations', () => {
    beforeEach(() => {
      localStorage.setItem('currentUser', JSON.stringify({ id: 1, status: 1 }));
    });

    it('should add product with valid form', () => {
      component.productForm.patchValue({
        productName: 'New Laptop',
        category: 'Electronics',
        brand: 'HP',
        price: 1200,
        image: 'hp-laptop.jpg',
        description: 'Latest HP Laptop',
        date: '2024-11-17',
        availableColors: 'Silver',
        popularity: 5,
        numberOfSales: 50,
      });

      productServiceSpy.addProduct.and.returnValue(of(mockProducts[0]));
      productServiceSpy.getProducts.and.returnValue(of(mockProducts));
      routerSpy.navigate.and.returnValue(Promise.resolve(true));

      component.addProduct();

      expect(productServiceSpy.addProduct).toHaveBeenCalled();
      expect(toastrSpy.success).toHaveBeenCalledWith('Product added successfully!', 'Success');
    });

    it('should not add product with invalid form', () => {
      component.productForm.reset();
      component.addProduct();
      expect(productServiceSpy.addProduct).not.toHaveBeenCalled();
    });

    it('should handle error when adding product', () => {
      component.productForm.patchValue({
        productName: 'New Product',
        category: 'Electronics',
        brand: 'Brand',
        price: 500,
        image: 'product.jpg',
        description: 'Product',
        date: '2024-11-17',
        availableColors: 'Black',
        popularity: 1,
        numberOfSales: 0,
      });

      productServiceSpy.addProduct.and.returnValue(
        throwError(() => new Error('Server error'))
      );

      component.addProduct();

      expect(toastrSpy.error).toHaveBeenCalledWith('Failed to add product', 'Error');
    });

    it('should delete product successfully', () => {
      productServiceSpy.deleteProduct.and.returnValue(of(undefined));
      productServiceSpy.getProducts.and.returnValue(of(mockProducts));

      component.deleteProduct(1);

      expect(productServiceSpy.deleteProduct).toHaveBeenCalledWith(1);
      expect(toastrSpy.success).toHaveBeenCalledWith('Product deleted successfully!', 'Success');
    });

    it('should handle error when deleting product', () => {
      productServiceSpy.deleteProduct.and.returnValue(
        throwError(() => new Error('Delete failed'))
      );

      component.deleteProduct(1);

      expect(toastrSpy.error).toHaveBeenCalledWith('Failed to delete product', 'Error');
    });
  });

  describe('Cart Operations', () => {
    beforeEach(() => {
      localStorage.setItem('currentUser', JSON.stringify({ id: 1, status: 0 }));
      component.userId = 1;
    });

    it('should add item to cart successfully', () => {
      cartServiceSpy.addItem.and.returnValue(of({}));
      cartServiceSpy.getCartItems.and.returnValue(of([]));
      spyOn(component, 'loadCart'); // Mock loadCart to prevent cascading calls

      component.addToCart(1, 2);

      expect(cartServiceSpy.addItem).toHaveBeenCalledWith(1, 1, 2);
      expect(component.loadCart).toHaveBeenCalled(); // Verify loadCart was called
      expect(toastrSpy.success).toHaveBeenCalledWith('Item Added to cart ', 'Item Added Successfully');
    });

    it('should show info when adding to cart without login', () => {
      localStorage.removeItem('currentUser');
      component.addToCart(1, 2);
      expect(toastrSpy.info).toHaveBeenCalledWith(
        'User is not logged in. Cannot add to cart.'
      );
    });
  });

  describe('Wishlist Operations', () => {
    beforeEach(() => {
      localStorage.setItem('currentUser', JSON.stringify({ id: 1, status: 0 }));
      component.userId = 1;
    });

    it('should load wishlist items', () => {
      wishlistServiceSpy.getWishlistByUser.and.returnValue(
        of({ products: [mockProducts[0]] })
      );

      component.loadWishlist();

      expect(component.wishlistItems.has(mockProducts[0].id)).toBeTruthy();
    });

    it('should check if product is in wishlist', () => {
      component.wishlistItems.add(1);
      expect(component.isInWishlist(1)).toBeTruthy();
      expect(component.isInWishlist(999)).toBeFalsy();
    });

    it('should add product to wishlist', () => {
      wishlistServiceSpy.addProductToWishlist.and.returnValue(of({}));

      component.addToWishlist(1);

      expect(wishlistServiceSpy.addProductToWishlist).toHaveBeenCalledWith(1, 1);
      expect(component.wishlistItems.has(1)).toBeTruthy();
    });

    it('should remove product from wishlist', () => {
      component.wishlistItems.add(1);
      wishlistServiceSpy.removeProductFromWishlist.and.returnValue(of({}));

      component.removeFromWishlist(1);

      expect(wishlistServiceSpy.removeProductFromWishlist).toHaveBeenCalledWith(1, 1);
      expect(component.wishlistItems.has(1)).toBeFalsy();
    });

    it('should toggle wishlist item', () => {
      wishlistServiceSpy.addProductToWishlist.and.returnValue(of({}));
      wishlistServiceSpy.removeProductFromWishlist.and.returnValue(of({}));

      component.toggleWishlist(1);
      expect(component.wishlistItems.has(1)).toBeTruthy();

      component.toggleWishlist(1);
      expect(component.wishlistItems.has(1)).toBeFalsy();
    });
  });

  describe('Utility Methods', () => {
    it('should return correct product image', () => {
      expect(component.getProductImage('laptop.jpg')).toBe('assets/img/laptop.jpg');
      expect(component.getProductImage(null)).toBe('assets/img/null.jpg');
      expect(component.getProductImage('')).toBe('assets/img/null.jpg');
    });

    it('should load product details', () => {
      imagesServiceSpy.getImagesByProductId.and.returnValue(of([]));

      component.loadProductDetails(mockProducts[0]);

      expect(component.selectedProduct).toEqual(mockProducts[0]);
      expect(imagesServiceSpy.getImagesByProductId).toHaveBeenCalledWith(mockProducts[0].id);
    });

    it('should load additional images for product', () => {
      const mockImages = [{ id: 1, productId: 1, name: 'image1.jpg' }];
      imagesServiceSpy.getImagesByProductId.and.returnValue(of(mockImages));

      component.loadAdditionalImages(1);

      expect(component.additionalImages).toEqual(mockImages);
    });

    it('should identify admin correctly', () => {
      localStorage.setItem('currentUser', JSON.stringify({ id: 1, status: 1 }));
      component.status = 1;
      expect(component.isAdmin()).toBeTruthy();

      component.status = 0;
      expect(component.isAdmin()).toBeFalsy();
    });
  });
});
