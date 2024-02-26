import { SignUpVendorComponent } from './module/pages/sign-up-vendor/sign-up-vendor.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './module/pages/login/login.component';
import { SignUpUserComponent } from './module/pages/sign-up-user/sign-up-user.component';
import { SignupComponent } from './module/pages/signup/signup.component';
import { HomeComponent } from './module/pages/home/home.component';
import { ServicesComponent } from './module/pages/services/services.component';
import { AboutUsComponent } from './module/pages/about-us/about-us.component';
import { FaqComponent } from './module/pages/faq/faq.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'signup',
    component: SignupComponent,
  },
  {
    path:'home',
    component: HomeComponent,
  },
  {
    path:'services',
    component: ServicesComponent,
  },
  {
    path:'signupUser',
    component: SignUpUserComponent,
  },
  {
    path:'signupVendor',
    component: SignUpVendorComponent,
  },
  {
    path:'about-us',
    component: AboutUsComponent,
  },
  {
    path:'faq',
    component: FaqComponent,
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
