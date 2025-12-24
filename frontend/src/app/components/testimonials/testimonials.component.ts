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
    await this.refreshTestimonials();
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
  
  private async refreshTestimonials(): Promise<void> {
    try {
      this.isLoading = true;
      const data = await this.testimonialService.getTestimonials().toPromise();
      this.testimonials = data || [];
      this.cdr.detectChanges();
      this.isLoading = false;
      setTimeout(() => {
        this.initializeOwlCarousel();
      }, 500);
    } catch (error) {
      this.isLoading = false;
      this.notifyError('Failed to load testimonials', error);
    }
  }

  private notifyError(message: string, error?: unknown): void {
    this.toastr.error(message);
    if (error) {
      console.error(error);
    }
  }

  private notifySuccess(message: string): void {
    this.toastr.success(message);
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
        this.notifySuccess('Testimonial added successfully!');
        this.testimonialForm.reset();
        this.selectedFile = null;
        (document.getElementById('photo') as HTMLInputElement).value = '';
        this.testimonials.push(testimonials);
        this.loadTestimonials();
      },
      (error) => {
        this.notifyError('Failed to add testimonial', error);
      }
    );
}
  

  deleteTestimonial(id: number | undefined): void {
    if (id === undefined) {

      return;
    }
    this.testimonialService.deleteTestimonial(id).subscribe(
      () => {
        this.notifySuccess('Testimonial deleted successfully!');
        this.loadTestimonials();
      },
      (error) => {
        this.notifyError('Failed to delete testimonial', error);
      }
    );
  }
}
