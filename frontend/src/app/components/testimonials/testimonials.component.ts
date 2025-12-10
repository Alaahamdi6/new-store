import { Component, OnInit,ChangeDetectorRef ,AfterViewInit,PLATFORM_ID, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators ,ReactiveFormsModule} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { TestimonialService } from '../../services/testimonial/testimonial.service';
import { CommonModule ,isPlatformBrowser} from '@angular/common';
import { Testimonial } from '../../models/testimonial.model';
import { RouterModule } from '@angular/router';

declare var $: any;

@Component({
  selector: 'app-testimonials',
  imports: [CommonModule,ReactiveFormsModule,RouterModule],
  templateUrl: './testimonials.component.html',
  styleUrls: ['./testimonials.component.css'],
})
export class TestimonialsComponent implements OnInit ,AfterViewInit{
  testimonials: Testimonial[] = [];
  testimonialForm: FormGroup;
  selectedFile: File | null = null;
  isAdmin :boolean = false;
  isLoading: boolean = true;

  constructor(
    private fb: FormBuilder,
    private testimonialService: TestimonialService,
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object
    
  ) {
    this.testimonialForm = this.fb.group({
      username: ['', Validators.required],
      comment: ['', Validators.required],
      stars: [1, [Validators.required, Validators.min(1), Validators.max(5)]]
    });
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId) && typeof document !== 'undefined') {
      const userDetails = JSON.parse(localStorage.getItem('currentUser') || '{}');
      if (userDetails && userDetails.status==1) {
          this.isAdmin=true;
          console.log(this.isAdmin);
      }
      this.loadTestimonials();
    }


  }

  ngAfterViewInit(): void {
    this.initializeOwlCarousel(); // Ensure Owl Carousel initializes after view is rendered
  }
  async loadTestimonials(): Promise<void> {
    try {
      // Set loading state to true
      this.isLoading = true;

      // Wait for the data to load
      const data = await this.testimonialService.getTestimonials().toPromise();
      this.testimonials = data || [];
      this.cdr.detectChanges();
      // Once testimonials are loaded, set loading state to false
      this.isLoading = false;

      setTimeout(() => {
        this.initializeOwlCarousel(); // Initialize carousel after loading
      }, 500);
    } catch (error) {
      // Handle error loading testimonials
      this.isLoading = false;
      this.toastr.error('Failed to load testimonials');
      console.error(error);
    }
  }

  initializeOwlCarousel(): void {
    $('.owl-carousel').owlCarousel({
      loop: true,                
      margin: 20,           
      nav: true,              
      dots: true,            
      autoplay: true,           
      autoplayTimeout: 4000,    
      autoplayHoverPause: true, 
      smartSpeed: 1000,         
      responsive: {
        0: { items: 1 },      
        600: { items: 2 },      
        1000: { items: 3 }      
      }
    });
  }
  

  onFileChange(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  submitTestimonial(): void {
    if (this.testimonialForm.invalid) {
        return;
    }

    const formData = new FormData();
    formData.append('username', this.testimonialForm.value.username);
    formData.append('comment', this.testimonialForm.value.comment);
    formData.append('stars', this.testimonialForm.value.stars);
    if (this.selectedFile) {
        formData.append('photo', this.selectedFile);
    }

    this.testimonialService.addTestimonial(formData).subscribe(
      (testimonials) => {
          this.toastr.success('Testimonial added successfully!');

          this.testimonialForm.reset();
          this.selectedFile = null; 
          (document.getElementById('photo') as HTMLInputElement).value = '';

          this.testimonials.push(testimonials);
          this.loadTestimonials();
      },
        (error) => {
            this.toastr.error('Failed to add testimonial');
            console.error(error);
        }
    );
}
  

  deleteTestimonial(id: number | undefined): void {
    if (id === undefined) {

      return;
    }
    this.testimonialService.deleteTestimonial(id).subscribe(
      () => {
        this.toastr.success('Testimonial deleted successfully!');
        this.loadTestimonials();
      },
      (error) => {
        this.toastr.error('Failed to delete testimonial');
        console.error(error);
      }
    );
  }
}
