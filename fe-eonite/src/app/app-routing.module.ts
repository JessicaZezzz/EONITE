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
import { LoginUserVendorComponent } from './module/pages/login-user-vendor/login-user-vendor.component';
import { PageNotFoundComponent } from './module/pages/page-not-found/page-not-found.component';
import { AuthGuard } from './module/services/auth.guard';
import { LogoutComponent } from './module/pages/logout/logout.component';
import { DetailVendorComponent } from './module/pages/detail-vendor/detail-vendor.component';

const routes: Routes = [
  {
    path:'home',
    component: HomeComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'loginAs/:role',
    component: LoginUserVendorComponent,
  },
  {
    path: 'signup',
    component: SignupComponent,
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
    path:'services',
    component: ServicesComponent,
  },
  {
    path:'about-us',
    component: AboutUsComponent,
  },
  {
    path:'details/:id',
    component: DetailVendorComponent,
  },
  {
    path:'faq',
    component: FaqComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'logout',
    component: LogoutComponent,
  },
  {
    path: '**',
    component: PageNotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
