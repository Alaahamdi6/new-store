import { ApplicationConfig, provideZoneChangeDetection,importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient ,withFetch} from '@angular/common/http';
import { JwtHelperService,JWT_OPTIONS } from '@auth0/angular-jwt';
import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';


export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes), 
    provideClientHydration(withEventReplay()),
    provideHttpClient(withFetch()),
    JwtHelperService,
    { provide: JWT_OPTIONS, useValue: {} },
    importProvidersFrom(
      BrowserAnimationsModule, // Required for Toastr
      ToastrModule.forRoot({
        positionClass: 'toast-bottom-right',
        timeOut: 3000
      })
    )

  ]
};
