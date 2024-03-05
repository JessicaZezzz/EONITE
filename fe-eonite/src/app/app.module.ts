import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './module/component/navbar/navbar.component';
import { HomeComponent } from './module/pages/home/home.component';
import { SignUpUserComponent } from './module/pages/sign-up-user/sign-up-user.component';
import { SignUpVendorComponent } from './module/pages/sign-up-vendor/sign-up-vendor.component';
import { LoginComponent } from './module/pages/login/login.component';
import { FooterComponent } from './module/component/footer/footer.component';
import { SignupComponent } from './module/pages/signup/signup.component';
import { ServicesComponent } from './module/pages/services/services.component';
import { MatIconModule } from '@angular/material/icon';
import { AboutUsComponent } from './module/pages/about-us/about-us.component';
import { HeaderPublicComponent } from './module/pages/header-public/header-public.component';
import { TestimonialComponent } from './module/pages/testimonial/testimonial.component';
import { FaqComponent } from './module/pages/faq/faq.component';
import { SlideBarHomeComponent } from './module/pages/slide-bar-home/slide-bar-home.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginUserVendorComponent } from './module/pages/login-user-vendor/login-user-vendor.component';
import { PageNotFoundComponent } from './module/pages/page-not-found/page-not-found.component';
import { appInitializer } from './module/services/app.initializer';
import { JwtInterceptor } from './module/services/jwt.interceptor';
import { ErrorInterceptor } from './module/services/error.interceptor';
import { RestApiServiceService } from './module/services/rest-api-service.service';
import { LogoutComponent } from './module/pages/logout/logout.component';
import { ListVendorComponent } from './module/pages/list-vendor/list-vendor.component';
import { DetailVendorComponent } from './module/pages/detail-vendor/detail-vendor.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    SignUpUserComponent,
    SignUpVendorComponent,
    LoginComponent,
    FooterComponent,
    SignupComponent,
    ServicesComponent,
    AboutUsComponent,
    HeaderPublicComponent,
    TestimonialComponent,
    FaqComponent,
    SlideBarHomeComponent,
    LoginUserVendorComponent,
    PageNotFoundComponent,
    LogoutComponent,
    ListVendorComponent,
    DetailVendorComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatIconModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    BrowserAnimationsModule,
    CommonModule
  ],
  providers: [
    DatePipe,
    {
      provide: APP_INITIALIZER,
      useFactory: appInitializer,
      multi: true,
      deps: [RestApiServiceService],
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
