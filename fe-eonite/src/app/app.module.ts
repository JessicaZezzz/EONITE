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
import { MatTabsModule} from '@angular/material/tabs';
import { HomeUserComponent } from './module/pages/home-user/home-user.component';
import { HomeVendorComponent } from './module/pages/home-vendor/home-vendor.component';
import { HomeAdminComponent } from './module/pages/home-admin/home-admin.component';
import { DetailProductComponent } from './module/pages/detail-product/detail-product.component';
import { DialogCartComponent } from './module/pages/dialog-cart/dialog-cart.component';
import { MatButtonModule} from '@angular/material/button';
import { MatInputModule} from '@angular/material/input';
import { MatFormFieldModule} from '@angular/material/form-field';
import { MatDatepickerModule} from '@angular/material/datepicker';
import { MatChipsModule} from '@angular/material/chips';
import { MatNativeDateModule, MatRippleModule } from '@angular/material/core';
import { CartComponent } from './module/pages/cart/cart.component';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { DialogEditCartComponent } from './module/pages/dialog-edit-cart/dialog-edit-cart.component';
import { DialogBookingComponent } from './module/pages/dialog-booking/dialog-booking.component';
import { TransactionComponent } from './module/pages/transaction/transaction.component';
import { TransactionDetailComponent } from './module/pages/transaction-detail/transaction-detail.component';
import { NgbRatingModule} from '@ng-bootstrap/ng-bootstrap';
import { ProfileUserComponent } from './module/pages/profile-user/profile-user.component';
import { ProfileVendorComponent } from './module/pages/profile-vendor/profile-vendor.component';
import { ProductComponent } from './module/pages/product/product.component';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { ServicesProductComponent } from './module/pages/services-product/services-product.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatRadioModule } from '@angular/material/radio';
import { MatTreeModule} from '@angular/material/tree';
import { MatSelectModule } from '@angular/material/select';
import { EditProfileVendorComponent } from './module/pages/edit-profile-vendor/edit-profile-vendor.component';
import { DialogChangePasswordComponent } from './module/pages/dialog-change-password/dialog-change-password.component';
import { DialogSuccessComponent } from './module/pages/dialog-success/dialog-success.component';
import { DetailProductVendorComponent } from './module/pages/detail-product-vendor/detail-product-vendor.component';
import { CurrencyPipe } from './module/services/currency.pipe';
import { AddProductComponent } from './module/pages/add-product/add-product.component';
import { EditProductComponent } from './module/pages/edit-product/edit-product.component';
import { EditProfileUserComponent } from './module/pages/edit-profile-user/edit-profile-user.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { ServicesVendorComponent } from './module/pages/services-vendor/services-vendor.component';
import { ListProductComponent } from './module/pages/list-product/list-product.component';
import { MatTooltipModule } from '@angular/material/tooltip';

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
    HomeUserComponent,
    HomeVendorComponent,
    HomeAdminComponent,
    DetailProductComponent,
    DialogCartComponent,
    CartComponent,
    DialogEditCartComponent,
    DialogBookingComponent,
    TransactionComponent,
    TransactionDetailComponent,
    ProfileUserComponent,
    ProfileVendorComponent,
    ProductComponent,
    ServicesProductComponent,
    EditProfileVendorComponent,
    DialogChangePasswordComponent,
    DialogSuccessComponent,
    DetailProductVendorComponent,
    CurrencyPipe,
    AddProductComponent,
    EditProductComponent,
    EditProfileUserComponent,
    ServicesVendorComponent,
    ListProductComponent,
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
    CommonModule,
    MatTabsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatChipsModule,
    MatRippleModule,
    MatTableModule,
    MatCheckboxModule,
    NgbRatingModule,
    AngularEditorModule,
    MatExpansionModule,
    MatTreeModule,
    MatRadioModule,
    MatSelectModule,
    MatPaginatorModule,
    MatTooltipModule
  ],
  entryComponents: [CartComponent],
  providers: [
    DatePipe,MatDatepickerModule, MatNativeDateModule,
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
