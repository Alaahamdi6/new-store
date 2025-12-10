import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { PLATFORM_ID } from '@angular/core';
import { of } from 'rxjs';

import { ShopComponent } from './shop.component';
import { ProductService } from '../../services/product/product.service';
import { CartService } from '../../services/cart/cart.service';
import { ImagesService } from '../../services/images/images.service';

describe('ShopComponent', () => {
  let component: ShopComponent;
  let fixture: ComponentFixture<ShopComponent>;

  const mockProductService = jasmine.createSpyObj('ProductService', ['getProducts', 'addProduct', 'updateProduct', 'deleteProduct']);
  const mockCartService = jasmine.createSpyObj('CartService', ['getCart', 'addItem']);
  const mockImagesService = jasmine.createSpyObj('ImagesService', ['getImagesByProductId']);
  const mockToastr = jasmine.createSpyObj('ToastrService', ['success', 'error', 'info']);
  const mockRouter = { navigate: jasmine.createSpy('navigate') } as any;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShopComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ToastrService, useValue: mockToastr },
        { provide: ProductService, useValue: mockProductService },
        { provide: CartService, useValue: mockCartService },
        { provide: ImagesService, useValue: mockImagesService },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: { snapshot: { params: {} } } },
        { provide: PLATFORM_ID, useValue: 'browser' }
      ]
    }).compileComponents();

    // default mock returns
    mockProductService.getProducts.and.returnValue(of([]));
    mockCartService.getCart.and.returnValue(of({ cartItems: [] }));

    fixture = TestBed.createComponent(ShopComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    localStorage.removeItem('currentUser');
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('initializeFilters and updateFeaturedProducts called after loadProducts', () => {
    const products = [
      { id: 1, productName: 'A', category: 'laptop', brand: 'X', popularity: 5, price: 100, description: 'd', date: '2020-01-01' },
      { id: 2, productName: 'B', category: 'phone', brand: 'Y', popularity: 10, price: 200, description: 'd2', date: '2021-01-01' }
    ] as any;
    mockProductService.getProducts.and.returnValue(of(products));

    component.loadProducts();

    expect(component.products.length).toBe(2);
    expect(component.filteredProducts.length).toBe(2);
    expect(component.categories).toContain('laptop');
    expect(component.brands).toContain('X');
    expect(component.featuredProducts.length).toBeGreaterThan(0);
  });

  it('filterByCategory filters products', () => {
    component.products = [
      { id: 1, category: 'laptop' } as any,
      { id: 2, category: 'phone' } as any
    ];
    component.filterByCategory('laptop');
    expect(component.filteredProducts.every(p => p.category === 'laptop')).toBeTrue();
  });

  it('filterByPrice filters products by priceRange', () => {
    component.products = [
      { id: 1, price: 50 } as any,
      { id: 2, price: 5000 } as any
    ];
    component.priceRange = 100;
    component.filterByPrice();
    expect(component.filteredProducts.every(p => p.price <= 100)).toBeTrue();
  });

  it('filterByBrand respects selectedBrands', () => {
    component.products = [
      { id: 1, brand: 'A' } as any,
      { id: 2, brand: 'B' } as any
    ];
    component.selectedBrands = { 'A': true };
    component.filterByBrand();
    expect(component.filteredProducts.length).toBe(1);
    component.selectedBrands = {};
    component.filterByBrand();
    expect(component.filteredProducts.length).toBe(2);
  });

  it('searchProducts filters by name and description', () => {
    component.products = [
      { productName: 'Alpha', description: 'first' } as any,
      { productName: 'Beta', description: 'second' } as any
    ];
    const input = { target: { value: 'alpha' } } as any;
    component.searchProducts(input);
    expect(component.filteredProducts.length).toBe(1);
  });

  it('sortProducts sorts by price asc/desc, popularity, newest', () => {
    const now = new Date().toISOString();
    component.filteredProducts = [
      { price: 200, popularity: 1, date: '2020-01-01' } as any,
      { price: 100, popularity: 10, date: now } as any
    ];
    component.selectedSort = 'price_asc'; component.sortProducts();
    expect(component.filteredProducts[0].price).toBe(100);
    component.selectedSort = 'price_desc'; component.sortProducts();
    expect(component.filteredProducts[0].price).toBe(200);
    component.selectedSort = 'popularity'; component.sortProducts();
    expect(component.filteredProducts[0].popularity).toBe(10);
    component.selectedSort = 'newest'; component.sortProducts();
    expect(component.filteredProducts[0].date).toBe(now);
  });

  it('pagination functions update pages and currentPage', () => {
    component.filteredProducts = Array.from({ length: 12 }, (_, i) => ({ id: i + 1 } as any));
    component.itemsPerPage = 5;
    component.updatePagination();
    expect(component.pages.length).toBe(Math.ceil(12 / 5));
    component.changePage(2);
    expect(component.currentPage).toBe(2);
    const paged = component.getPaginatedProducts();
    expect(paged.length).toBeGreaterThan(0);
  });

  it('getCategoryCount returns correct count', () => {
    component.products = [
      { category: 'x' } as any,
      { category: 'x' } as any,
      { category: 'y' } as any
    ];
    expect(component.getCategoryCount('x')).toBe(2);
  });

  it('filterBrands and toggleShowAllBrands behave', () => {
    component.brands = ['A', 'B', 'C'];
    component.brandSearchQuery = 'b';
    component.filterBrands();
    expect(component.filteredBrands.every(b => b.toLowerCase().includes('b'))).toBeTrue();
    component.toggleShowAllBrands();
    expect(component.showAllBrands).toBeTrue();
  });

  it('filterCategories and toggleShowAllCategories behave', () => {
    component.categories = ['catA', 'catB'];
    component.categorySearchQuery = 'cata';
    component.filterCategories();
    expect(component.filteredCategories.length).toBe(1);
    component.toggleShowAllCategories();
    expect(component.showAllCategories).toBeTrue();
  });

  it('getCategoryIcon returns known or default icon', () => {
    expect(component.getCategoryIcon('laptop')).toContain('fa-laptop');
    expect(component.getCategoryIcon('unknown')).toContain('fa-question-circle');
  });

  it('getProductImage returns fallback when null', () => {
    expect(component.getProductImage(null)).toContain('null.jpg');
    expect(component.getProductImage('img.png')).toContain('img.png');
  });

  it('fetchProducts assigns products on success', () => {
    const products = [{ id: 1 } as any];
    mockProductService.getProducts.and.returnValue(of(products));
    component.fetchProducts();
    expect(component.products).toEqual(products);
  });

  it('addProduct calls service and navigates on success', () => {
    component.productForm.patchValue({ productName: 'p', category: 'c', brand: 'b', popularity: 0, numberOfSales:0, image: 'i', availableColors:'', description:'d', date:'2020-01-01', price: 1 });
    mockProductService.addProduct.and.returnValue(of({}));
    component.addProduct();
    expect(mockProductService.addProduct).toHaveBeenCalled();
    expect(mockToastr.success).toHaveBeenCalled();
  });

  it('editProduct calls updateProduct when productToEdit present', () => {
    component.productToEdit = { id: 99 } as any;
    component.editproductForm.patchValue({ id: 99, productName: 'x', category:'c', brand:'b', popularity:0, numberOfSales:0, image:'i', availableColors:'', description:'d', date:'2020-01-01', price: 1 });
    mockProductService.updateProduct.and.returnValue(of({}));
    spyOn(window.location, 'reload');
    component.editProduct();
    expect(mockProductService.updateProduct).toHaveBeenCalledWith(99, jasmine.any(Object));
    expect(window.location.reload).toHaveBeenCalled();
  });

  it('loadProductForEdit patches edit form', () => {
    const p = { id: 7, productName: 'N', category: 'c', brand: 'b', popularity: 0, numberOfSales:0, image:'i', availableColors:'', description:'d', date:'2020-01-01', price:1 } as any;
    component.loadProductForEdit(p);
    expect(component.editproductForm.value.productName).toBe('N');
  });

  it('clearForm and cleareditForm reset forms', () => {
    component.productForm.patchValue({ productName: 'x' });
    component.clearForm();
    expect(component.productForm.value.productName).toBeNull();
    component.editproductForm.patchValue({ productName: 'y' });
    component.cleareditForm();
    expect(component.productForm.value.productName).toBeNull();
  });

  it('deleteProduct calls delete and shows toastr', () => {
    mockProductService.deleteProduct.and.returnValue(of({}));
    component.deleteProduct(5);
    expect(mockProductService.deleteProduct).toHaveBeenCalledWith(5);
    expect(mockToastr.success).toHaveBeenCalled();
  });

  it('loadCart uses platform check and populates cartItems', () => {
    localStorage.setItem('currentUser', JSON.stringify({ id: 3 }));
    mockCartService.getCart.and.returnValue(of({ cartItems: [{ id: 1 }] }));
    component.loadCart();
    expect(mockCartService.getCart).toHaveBeenCalledWith(3);
    expect(component.cartItems.length).toBe(1);
  });

  it('addToCart calls addItem when user logged in', () => {
    localStorage.setItem('currentUser', JSON.stringify({ id: 4 }));
    mockCartService.addItem.and.returnValue(of({}));
    component.addToCart(10, 2);
    expect(mockCartService.addItem).toHaveBeenCalledWith(4, 10, 2);
    expect(mockToastr.success).toHaveBeenCalled();
  });

  it('isAdmin checks status', () => {
    component.status = 1;
    expect(component.isAdmin()).toBeTrue();
    component.status = 0;
    expect(component.isAdmin()).toBeFalse();
  });
});
