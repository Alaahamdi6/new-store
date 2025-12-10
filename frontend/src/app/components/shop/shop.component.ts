import { Component, OnInit ,PLATFORM_ID, Inject} from '@angular/core';
import { CommonModule ,isPlatformBrowser} from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators,FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product/product.service';
import { Product } from '../../models/product.model';
import { CartItem } from '../../models/cartItem.model';
import { ImagesModel } from '../../models/images.model';
import { CartService } from '../../services/cart/cart.service';
import { ImagesService } from '../../services/images/images.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';



@Component({
  selector: 'app-shop',
  imports: [CommonModule,FormsModule,ReactiveFormsModule],
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css']
})
export class ShopComponent implements OnInit {
  status: number = 0;
  products: Product[] = [];
  filteredProducts: Product[] = [];
  featuredProducts: Product[] = []; 
  categories: string[] = []; 
  brands: string[] = []; 
  selectedSort: string = 'price_asc'; 
  priceRange: number = 2900; 
  selectedBrands: { [key: string]: boolean } = {}; 
  searchQuery: string = ''; 
  currentPage: number = 1; 
  itemsPerPage: number = 6;
  pages: number[] = []; 
  cartItems: CartItem[] = [];
  productForm: FormGroup;
  editproductForm: FormGroup;
  isEditing: boolean = false;
  productToEdit: Product | null = null;
  selectedProduct: Product | null = null; 
  additionalImages: ImagesModel[] = [];

  constructor(private productService: ProductService,private cartService: CartService,@Inject(PLATFORM_ID) private platformId: Object,private toastr: ToastrService,private route: ActivatedRoute,private router: Router,private fb: FormBuilder,private imagesService: ImagesService) {
    this.productForm = this.fb.group({
      productName: ['', Validators.required],
      category: ['', Validators.required],
      brand: ['', Validators.required],
      popularity: [0, [Validators.required, Validators.min(0)]],
      numberOfSales: [0, [Validators.required, Validators.min(0)]],
      image: ['', Validators.required],
      availableColors: ['', Validators.required],
      description: ['', Validators.required],
      date: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
    });
    this.editproductForm = this.fb.group({
      id: [0,Validators.required],
      productName: ['', Validators.required],
      category: ['', Validators.required],
      brand: ['', Validators.required],
      popularity: [0, [Validators.required, Validators.min(0)]],
      numberOfSales: [0, [Validators.required, Validators.min(0)]],
      image: ['', Validators.required],
      availableColors: ['', Validators.required],
      description: ['', Validators.required],
      date: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
    });
  }

  ngOnInit(): void {
    this.loadProducts();
    this.filteredBrands = this.brands.slice(0, this.maxVisibleBrands);
    this.filteredCategories = this.categories.slice(0, this.maxVisibleCategories);
  }

  // Load all products and initialize filters
  loadProducts(): void {
    this.productService.getProducts().subscribe((data: Product[]) => {
      this.products = data;
      this.filteredProducts = [...this.products];
      this.initializeFilters();
      this.updateFeaturedProducts();
      this.updatePagination();
    });
  }

  // Load product details and additional images
  loadProductDetails(product: Product): void {
    this.selectedProduct = product;
    this.loadAdditionalImages(product.id);
  }

  // Fetch additional images for the product
  loadAdditionalImages(productId: number): void {
    this.imagesService.getImagesByProductId(productId).subscribe(
      (images: ImagesModel[]) => {
        this.additionalImages = images;
      },
      (error) => {
        console.error('Failed to load additional images:', error);
      }
    );
  }

  // Initialize categories, brands, and selected brands
  initializeFilters(): void {
    this.categories = [...new Set(this.products.map(p => p.category))];
    this.brands = [...new Set(this.products.map(p => p.brand))];
    this.brands.forEach(brand => this.selectedBrands[brand] = false);
  }

  // Update featured products (e.g., most popular or newest)
  updateFeaturedProducts(): void {
    this.featuredProducts = this.products
      .sort((a, b) => b.popularity - a.popularity)
      .slice(0, 3); // Show top 3 featured products
  }

  // Filter products by category
  filterByCategory(category: string): void {
    this.filteredProducts = this.products.filter(p => p.category === category);
    this.updatePagination();
  }

  // Filter products by price range
  filterByPrice(): void {
    this.filteredProducts = this.products.filter(p => p.price <= this.priceRange);
    this.updatePagination();
  }

  // Filter products by selected brands
  filterByBrand(): void {
    const selected = Object.keys(this.selectedBrands).filter(brand => this.selectedBrands[brand]);
    if (selected.length > 0) {
      this.filteredProducts = this.products.filter(p => selected.includes(p.brand));
    } else {
      this.filteredProducts = [...this.products];
    }
    this.updatePagination();
  }

  // Search products by name or description
  searchProducts(event: Event): void {
    const query = (event.target as HTMLInputElement).value.toLowerCase();
    this.filteredProducts = this.products.filter(
      p => p.productName.toLowerCase().includes(query) || p.description.toLowerCase().includes(query)
    );
    this.updatePagination();
  }

  // Sort products
  sortProducts(): void {
    switch (this.selectedSort) {
      case 'price_asc':
        this.filteredProducts.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        this.filteredProducts.sort((a, b) => b.price - a.price);
        break;
      case 'popularity':
        this.filteredProducts.sort((a, b) => b.popularity - a.popularity);
        break;
      case 'newest':
        this.filteredProducts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        break;
    }
  }

  // Update pagination
  updatePagination(): void {
    const totalPages = Math.ceil(this.filteredProducts.length / this.itemsPerPage);
    this.pages = Array.from({ length: totalPages }, (_, i) => i + 1);
    this.currentPage = 1; // Reset to first page after filtering
  }

  // Change pagination page
  changePage(page: number): void {
    if (page >= 1 && page <= this.pages.length) {
      this.currentPage = page;
    }
  }

  // Get products for the current page
  getPaginatedProducts(): Product[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredProducts.slice(startIndex, endIndex);
  }

  // Get count of products in a category
  getCategoryCount(category: string): number {
    return this.products.filter(p => p.category === category).length;
  }


brandSearchQuery: string = ''; // Search query for brands
filteredBrands: string[] = []; // Brands filtered by search query
showAllBrands: boolean = false; // Toggle to show all brands
maxVisibleBrands: number = 5; // Number of brands to show by default


// Filter brands based on search query
filterBrands(): void {
  if (this.brandSearchQuery) {
    this.filteredBrands = this.brands
      .filter(brand => brand.toLowerCase().includes(this.brandSearchQuery.toLowerCase()))
      .slice(0, this.showAllBrands ? this.brands.length : this.maxVisibleBrands);
  } else {
    this.filteredBrands = this.brands.slice(0, this.showAllBrands ? this.brands.length : this.maxVisibleBrands);
  }
}

// Toggle show all brands
toggleShowAllBrands(): void {
  this.showAllBrands = !this.showAllBrands;
  this.filterBrands(); // Update the list of visible brands
}

// Add these properties to your component
categorySearchQuery: string = ''; // Search query for categories
filteredCategories: string[] = []; // Categories filtered by search query
showAllCategories: boolean = false; // Toggle to show all categories
maxVisibleCategories: number = 5; // Number of categories to show by default

// Define category icons
categoryIcons: { [key: string]: string } = {
  laptop: 'fas fa-laptop',
  phone: 'fas fa-mobile-alt',
  AirPods: 'fas fa-headphones',
  Keyboard: 'fas fa-keyboard',
  Mouse: 'fas fa-mouse',
  camera: 'fas fa-camera',
  headphones: 'fas fa-headphones-alt',
  smartwatch: 'fas fa-clock'
};

// Filter categories based on search query
filterCategories(): void {
  if (this.categorySearchQuery) {
    this.filteredCategories = this.categories
      .filter(category => category.toLowerCase().includes(this.categorySearchQuery.toLowerCase()))
      .slice(0, this.showAllCategories ? this.categories.length : this.maxVisibleCategories);
  } else {
    this.filteredCategories = this.categories.slice(0, this.showAllCategories ? this.categories.length : this.maxVisibleCategories);
  }
}

// Toggle show all categories
toggleShowAllCategories(): void {
  this.showAllCategories = !this.showAllCategories;
  this.filterCategories(); // Update the list of visible categories
}

// Get the icon for a category
getCategoryIcon(category: string): string {
  return this.categoryIcons[category] || 'fas fa-question-circle'; // Default icon if category not found
}

// Method to get the product image or fallback image
getProductImage(image: string | null): string {
  // If the image is null or undefined, return the fallback image path
  if (!image) {
    return 'assets/img/null.jpg';
  }
  // Otherwise, return the product image path
  return 'assets/img/' + image;
}
    // Fetch the products from the backend
  fetchProducts(): void {
    this.productService.getProducts().subscribe(
      (products: Product[]) => {
        this.products = products; // Assign the response value to the products array
        console.log('Products:', this.products);
      },
      (error) => {
        console.error('Error fetching products:', error);
      }
    );
  }
  addProduct(): void {
    if (this.productForm.invalid) {
      return;
    }
    const productData = this.productForm.value;
  
    // Add new product
    this.productService.addProduct(productData).subscribe(
      (response) => {
        this.toastr.success('Product added successfully!', 'Success');
        this.fetchProducts(); // Refresh the product list
        this.productForm.reset(); // Reset the form after adding
        this.router.navigate(['/products']); // Redirect to the products list
      },
      (error) => {
        this.toastr.error('Failed to add product', 'Error');
        console.error('Error adding product:', error);
      }
    );
  }

  editProduct(): void {
  if (this.editproductForm.invalid || !this.productToEdit) {
    return; // Prevent submission if form is invalid or no product selected
  }
  const productData = this.editproductForm.value;
console.log('button clicked');
  // Edit existing product
  this.productService.updateProduct(this.productToEdit.id, productData).subscribe(
    (updatedProduct) => {
      this.toastr.success('Product updated successfully!', 'Success');
      this.fetchProducts(); // Refresh the product list
      this.editproductForm.reset(); // Reset the form after editing
      this.productToEdit = null; // Clear the productToEdit reference
      window.location.reload();
    },
    (error) => {
      this.toastr.error('Failed to update product', 'Error');
      console.error('Error updating product:', error);
    }
  );
}

  loadProductForEdit(product: any): void {
    this.editproductForm.patchValue({
      id: product.id,
      productName: product.productName,
      category: product.category,
      brand: product.brand,
      popularity: product.popularity,
      numberOfSales: product.numberOfSales,
      image: product.image,
      availableColors: product.availableColors,
      description: product.description,
      date: product.date,
      price: product.price,
    });
  }
  
  clearForm(): void {
    this.productForm.reset(); // Clear the form when the modal is closed
  }
  
  cleareditForm(): void {
    this.productForm.reset(); // Clear the form when the modal is closed
  }

  deleteProduct(id: number): void {
    this.productService.deleteProduct(id).subscribe(
      () => {
        this.toastr.success('Product deleted successfully!', 'Success');
        this.fetchProducts();
      },
      (error) => {
        this.toastr.error('Failed to delete product', 'Error');
        console.error('Error deleting product:', error);
      }
    );
  }
  loadCart(): void {
    if (isPlatformBrowser(this.platformId) && localStorage.getItem('currentUser')) {
      const userDetails = JSON.parse(localStorage.getItem('currentUser') || '{}');
        const userId = userDetails.id; // Retrieve userId from stored user details
  
    this.cartService.getCart(userId).subscribe(cart => {
      this.cartItems = cart.cartItems;
    
    });
    } else {
      this.toastr.info('User is not logged in. Cannot add to cart.');      
    }
}
  addToCart(productId: number, quantity: number): void {
    if (isPlatformBrowser(this.platformId) && localStorage.getItem('currentUser') ) {
      const userDetails = JSON.parse(localStorage.getItem('currentUser') || '{}');
        const userId = userDetails.id; // Retrieve userId from stored user details
  
        this.cartService.addItem(userId, productId, quantity).subscribe(() => {
          this.loadCart();
          this.toastr.success('Item Added to cart ', 'Item Added Successfully');
        });
      } else {
        this.toastr.info('User is not logged in. Cannot add to cart.');
      }
  }
  
  isAdmin(): boolean {
    return this.status === 1;
  }
}