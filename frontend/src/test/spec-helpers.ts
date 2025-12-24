import { Router } from '@angular/router';
import { throwError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

export const testPlaceholders = {
  current: 'placeholder-current',
  next: 'placeholder-new',
  mismatch: 'placeholder-mismatch',
};

export function setWindowReloadSpy() {
  const reload = jasmine.createSpy('reload');
  Object.defineProperty(window, 'location', {
    value: { reload },
    writable: true,
  });
  return reload;
}

export function installFakeFileReader(dataUrl = 'data:image/png;base64,FAKE') {
  const FakeReader = function (this: any) {
    this.onload = null;
    this.readAsDataURL = function () {
      if (this.onload) {
        this.result = dataUrl;
        this.onload({});
      }
    };
  } as any;
  (window as any).FileReader = FakeReader;
}

export function makeError(message: string) {
  return throwError(() => new Error(message));
}

export function makeRouterMock(): Router {
  return { navigate: jasmine.createSpy('navigate') } as unknown as Router;
}

export function makeToastrMock(): ToastrService {
  return jasmine.createSpyObj('ToastrService', ['success', 'info']) as unknown as ToastrService;
}
