import { Component, OnInit, PLATFORM_ID, Inject  } from '@angular/core';
import { CommonModule,isPlatformBrowser } from '@angular/common';
import { ProductService } from '../../services/product/product.service';
import { Product } from '../../models/product.model';
import { ImagesModel } from '../../models/images.model';
import { CartItem } from '../../models/cartItem.model';
import { ImagesService } from '../../services/images/images.service';
import { CartService } from '../../services/cart/cart.service';
import { WishlistService } from '../../services/wishlist/wishlist.service';
import { ToastrService } from 'ngx-toastr';
import { Router,RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faHeart as faHeartSolid } from '@fortawesome/free-solid-svg-icons';
import { faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';

library.add(faHeartSolid, faHeartRegular);
@Component({
  selector: 'app-products',
  imports: [CommonModule,RouterModule,ReactiveFormsModule,FontAwesomeModule],
  standalone: true,
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent implements OnInit {
  status: number = 0;
  userId: number | null=null ;
  products: Product[] = []; // To store the list of products
  cartItems: CartItem[] = [];
  productForm: FormGroup;
  editproductForm: FormGroup;
  isEditing: boolean = false;
  productToEdit: Product | null = null;
  currentPage: number = 1;
  itemsPerPage: number = 8;
  totalPages: number = 0;
  selectedProduct: Product | null = null; 
  additionalImages: ImagesModel[] = [];
  wishlistItems: Set<number> = new Set<number>();
  faHeartSolid = faHeartSolid;
  faHeartRegular = faHeartRegular;

  constructor(
    private productsService: ProductService,
    private cartService: CartService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private toastr: ToastrService,
    private router: Router,
    private fb: FormBuilder,
    private imagesService: ImagesService,
    private wishlistService: WishlistService
  ) {
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
    if (isPlatformBrowser(this.platformId) && localStorage.getItem('currentUser') ) {
      const userDetails = JSON.parse(localStorage.getItem('currentUser') || '{}');
        this.status = userDetails.status;
        this.userId = userDetails.id;
        console.log('User id:', this.userId);
      } else {
        console.info('No user is logged in.');
      }
     

    this.loadProducts();
    this.loadWishlist();
  }
  
  // Fetch the products from the backend
  fetchProducts(): void {
    this.productsService.getProducts().subscribe(
      (products: Product[]) => {
        this.products = products; // Assign the response value to the products array
        console.log('Products:', this.products);
      },
      (error) => {
        console.error('Error fetching products:', error);
      }
    );
  }

  // Method to get the product image or fallback image
getProductImage(image: string | null): string {
  if (!image) {
    return 'assets/img/null.jpg';
  }
  return 'assets/img/' + image;
}
  loadProducts(): void {
    this.productsService.getProducts().subscribe((data: Product[]) => {
      this.products = data;
      this.totalPages = Math.ceil(this.products.length / this.itemsPerPage);
    });
  }

  get paginatedProducts(): Product[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.products.slice(startIndex, startIndex + this.itemsPerPage);
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  fetchProductsByCategory(category: string): void {
    this.productsService.getProductsByCategory(category).subscribe(
      (products) => (this.products = products),
      (error) => console.error(`Error fetching products by category (${category}):`, error)
    );
  }

  addProduct(): void {
    if (this.productForm.invalid) {
      return; // Prevent submission if form is invalid
    }
    const productData = this.productForm.value;
  
    // Add new product
    this.productsService.addProduct(productData).subscribe(
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
  this.productsService.updateProduct(this.productToEdit.id, productData).subscribe(
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
    this.productsService.deleteProduct(id).subscribe(
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
    if (isPlatformBrowser(this.platformId)) {
      const userDetails = JSON.parse(localStorage.getItem('currentUser') || '{}');
  
      if (userDetails) {
        const userId = userDetails.id; // Retrieve userId from stored user details
  
    this.cartService.getCart(userId).subscribe(cart => {
      this.cartItems = cart.cartItems;
    
    });
    } else {
      console.warn('User is not logged in. Cannot add to cart.');
    }
  }
}

  addToCart(productId: number, quantity: number): void {
    if (isPlatformBrowser(this.platformId ) && localStorage.getItem('currentUser')) {
      const userDetails = JSON.parse(localStorage.getItem('currentUser') || '{}');
        const userId = userDetails.id; // Retrieve userId from stored user details
  
        this.cartService.addItem(userId, productId, quantity).subscribe(() => {
          this.loadCart();
          this.toastr.success('Item Added to cart ', 'Item Added Successfully');
        });
    }else {
      this.toastr.info('User is not logged in. Cannot add to cart.');
    }
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

    loadWishlist(): void {
      if (this.userId) {
        this.wishlistService.getWishlistByUser(this.userId).subscribe({
          next: (wishlist) => {
            // Clear the existing wishlist items
            this.wishlistItems.clear();
    
            // Add product IDs from the backend to the wishlistItems set
            if (wishlist && wishlist.products) {
              wishlist.products.forEach((product: Product) => this.wishlistItems.add(product.id));
            }
          },
          error: (err) => {
            console.error('Failed to load wishlist:', err);
          },
        });
      }
    }

    // Check if a product is in the wishlist
    isInWishlist(productId: number): boolean {
      return this.wishlistItems.has(productId);
    }

    // Toggle product in wishlist
    toggleWishlist(productId: number): void {
      if (this.isInWishlist(productId)) {
        this.wishlistItems.delete(productId); 
        this.removeFromWishlist(productId); 
      } else {
        this.wishlistItems.add(productId); 
        this.addToWishlist(productId);
      }
    }

    // Add product to wishlist (calls the WishlistService)
    addToWishlist(productId: number): void {
      if (this.userId) {
        this.wishlistService.addProductToWishlist(this.userId, productId).subscribe({
          next: () => {
            this.wishlistItems.add(productId);
            console.log('Product added to wishlist:', productId);
          },
          error: (err) => {
            console.error('Failed to add product to wishlist:', err);
          },
        });
      }
    }

    removeFromWishlist(productId: number): void {
      if (this.userId) {
        this.wishlistService.removeProductFromWishlist(this.userId, productId).subscribe({
          next: () => {
            this.wishlistItems.delete(productId); // Remove product ID from the set
            console.log('Product removed from wishlist:', productId);
          },
          error: (err) => {
            console.error('Failed to remove product from wishlist:', err);
          },
        });
      }
    }

  isAdmin(): boolean {
    return isPlatformBrowser(this.platformId)&& localStorage.getItem('currentUser')!= null && this.status === 1;
  }
}
