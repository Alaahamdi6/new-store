import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ToastrService } from 'ngx-toastr';
import { PLATFORM_ID } from '@angular/core';
import { of } from 'rxjs';

import { TestimonialsComponent } from './testimonials.component';
import { TestimonialService } from '../../services/testimonial/testimonial.service';

describe('TestimonialsComponent', () => {
  let component: TestimonialsComponent;
  let fixture: ComponentFixture<TestimonialsComponent>;

  const mockToastr = jasmine.createSpyObj('ToastrService', ['success', 'error']);
  const mockTestimonialService = jasmine.createSpyObj('TestimonialService', ['getTestimonials', 'addTestimonial', 'deleteTestimonial']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestimonialsComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ToastrService, useValue: mockToastr },
        { provide: TestimonialService, useValue: mockTestimonialService },
        { provide: PLATFORM_ID, useValue: 'browser' }
      ]
    }).compileComponents();

    // ensure there is an element with id 'photo' for submitTestimonial
    const input = document.createElement('input');
    input.id = 'photo';
    document.body.appendChild(input);

    // stub global $ to avoid errors from owlCarousel
    (window as any).$ = jasmine.createSpy('$').and.returnValue({ owlCarousel: jasmine.createSpy('owl') });

    fixture = TestBed.createComponent(TestimonialsComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    // cleanup
    const el = document.getElementById('photo');
    if (el && el.parentNode) el.parentNode.removeChild(el);
    localStorage.removeItem('currentUser');
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('ngOnInit sets isAdmin when currentUser status is 1 and calls loadTestimonials', async () => {
    const user = { status: 1 };
    localStorage.setItem('currentUser', JSON.stringify(user));

    // mock getTestimonials to return a promise via toPromise()
    const testimonialsData = [{ id: 1, username: 'u', comment: 'c', stars: 5, photo: '' }];
    mockTestimonialService.getTestimonials.and.returnValue({ toPromise: () => Promise.resolve(testimonialsData) } as any);

    spyOn(component, 'loadTestimonials').and.callThrough();
    await component.ngOnInit();

    expect(component.isAdmin).toBeTrue();
    expect(component.loadTestimonials).toHaveBeenCalled();
  });

  it('loadTestimonials sets testimonials and updates isLoading', async () => {
    const data = [{ id: 2, username: 'a', comment: 'b', stars: 4, photo: '' }];
    mockTestimonialService.getTestimonials.and.returnValue({ toPromise: () => Promise.resolve(data) } as any);

    spyOn(component['cdr'], 'detectChanges');
    await component.loadTestimonials();

    expect(component.testimonials).toEqual(data);
    expect(component.isLoading).toBeFalse();
    expect(component['cdr'].detectChanges).toHaveBeenCalled();
  });

  it('initializeOwlCarousel calls jquery owlCarousel', () => {
    const jq = (window as any).$ as jasmine.Spy;
    component.initializeOwlCarousel();
    expect(jq).toHaveBeenCalled();
    const ret = jq.calls.mostRecent().returnValue;
    expect(ret.owlCarousel).toBeDefined();
  });

  it('onFileChange sets selectedFile', () => {
    const fakeFile = new File(['x'], 'f.png', { type: 'image/png' });
    const evt = { target: { files: [fakeFile] } } as any;
    component.onFileChange(evt);
    expect(component.selectedFile).toBe(fakeFile);
  });

  it('submitTestimonial returns early when form invalid', () => {
    component.testimonialForm.reset();
    component.submitTestimonial();
    expect(mockTestimonialService.addTestimonial).not.toHaveBeenCalled();
  });

  it('submitTestimonial submits and updates testimonials on success', () => {
    // prepare form
    component.testimonialForm.patchValue({ username: 'u', comment: 'c', stars: 5 });
    const resp = { id: 10, username: 'u', comment: 'c', stars: 5, photo: '' } as any;
    mockTestimonialService.addTestimonial.and.returnValue(of(resp));
    spyOn(component, 'loadTestimonials');

    component.submitTestimonial();

    expect(mockTestimonialService.addTestimonial).toHaveBeenCalled();
    expect(mockToastr.success).toHaveBeenCalled();
    expect(component.selectedFile).toBeNull();
    expect(component.testimonials.some(t => t.id === 10)).toBeTrue();
    expect(component.loadTestimonials).toHaveBeenCalled();
  });

  it('deleteTestimonial does nothing when id undefined', () => {
    component.deleteTestimonial(undefined);
    expect(mockTestimonialService.deleteTestimonial).not.toHaveBeenCalled();
  });

  it('deleteTestimonial calls service and reloads on success', () => {
    mockTestimonialService.deleteTestimonial.and.returnValue(of({}));
    spyOn(component, 'loadTestimonials');
    component.deleteTestimonial(5);
    expect(mockTestimonialService.deleteTestimonial).toHaveBeenCalledWith(5);
    expect(mockToastr.success).toHaveBeenCalled();
    expect(component.loadTestimonials).toHaveBeenCalled();
  });
});
