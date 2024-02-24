import { NgModule } from '@angular/core';
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

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatIconModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
