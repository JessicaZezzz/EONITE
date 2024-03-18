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
import { DetailProductComponent } from './module/pages/detail-product/detail-product.component';
import { CartComponent } from './module/pages/cart/cart.component';
import { TransactionComponent } from './module/pages/transaction/transaction.component';
import { TransactionDetailComponent } from './module/pages/transaction-detail/transaction-detail.component';
import { ProfileUserComponent } from './module/pages/profile-user/profile-user.component';
import { ProfileVendorComponent } from './module/pages/profile-vendor/profile-vendor.component';
import { ProductComponent } from './module/pages/product/product.component';

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
    path:'product/:id',
    component: DetailProductComponent,
  },
  {
    path:'cart',
    component: CartComponent,
  },
  {
    path:'transaction',
    component: TransactionComponent,
  },
  {
    path:'profile-user',
    component: ProfileUserComponent,
  },
  {
    path:'profile-vendor',
    component: ProfileVendorComponent,
  },
  {
    path:'transaction-details/:id',
    component: TransactionDetailComponent,
  },
  {
    path:'product-vendor',
    component: ProductComponent,
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
