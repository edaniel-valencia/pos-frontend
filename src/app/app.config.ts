import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideToastr } from 'ngx-toastr';

import { routes } from './app.routes';
import { AddTokenInterceptor } from './utils/add-token.interceptor';

export const appConfig: ApplicationConfig = {
    providers: [
        provideZoneChangeDetection({ eventCoalescing: true }),
        provideRouter(routes),
        provideAnimations(),
        provideToastr(),
        provideHttpClient(withInterceptorsFromDi()),
        { provide: HTTP_INTERCEPTORS, useClass: AddTokenInterceptor, multi: true },
    ]
};
