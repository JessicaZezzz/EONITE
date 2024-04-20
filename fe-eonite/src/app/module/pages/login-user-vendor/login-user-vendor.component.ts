import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from '../../models/auth.model';
import { emailValidator } from '../../services/email-validator.directive';
import { Router } from '@angular/router';
import { RestApiServiceService } from '../../services/rest-api-service.service';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { GenerateOtpComponent } from '../generate-otp/generate-otp.component';
import { DialogResetPasswordComponent } from '../dialog-reset-password/dialog-reset-password.component';

@Component({
  selector: 'app-login-user-vendor',
  templateUrl: './login-user-vendor.component.html',
  styleUrls: ['./login-user-vendor.component.css']
})
export class LoginUserVendorComponent implements OnInit {
  reactiveForm!: FormGroup;
  user?:User;
  role?:string;
  openDialogError1: boolean = false;
  openDialogError2: boolean = false;

  constructor(private restService: RestApiServiceService,
              private activeRoute: ActivatedRoute,
              private router: Router, private dialog:MatDialog) {
    this.role = this.activeRoute.snapshot.params['role'];
  }

  ngOnInit(): void {
    this.reactiveForm = new FormGroup({
      email: new FormControl(this.user?.email, [
        Validators.required,
        emailValidator(),
      ]),
      password: new FormControl(this.user?.password, [
        Validators.required,
        Validators.minLength(12),
      ]),
    });
  }

  get email() {
    return this.reactiveForm.get('email')!;
  }

  get password() {
    return this.reactiveForm.get('password')!;
  }

  public submit(): void {
    if (this.reactiveForm.invalid) {
      for (const control of Object.keys(this.reactiveForm.controls)) {
        this.reactiveForm.controls[control].markAsTouched();
      }
      return;
    }
    window.sessionStorage.clear();
    let loginUser: login = {};
      loginUser.email = this.reactiveForm.value.email;
      loginUser.password = this.reactiveForm.value.password;
    if(this.role == 'USER') this.loginUser(loginUser);
    else if(this.role == 'VENDOR') this.loginVendor(loginUser);
  }

  loginUser(body :any){
    this.restService.loginUser(JSON.stringify(body)).subscribe(event=>{
      this.validationLogIn(event,body,'USER');
    })

  }

  loginVendor(body :any){
    this.restService.loginVendor(JSON.stringify(body)).subscribe(event=>{
      this.validationLogIn(event,body,'VENDOR');
    })
  }

  validationLogIn(status:any,body:any,role:string){
    if(status.statusCode == 200){
      let generateOTP:otp={
        userType:role,
        email:body.email!,
        option:'login'
      };
      // const dialogRef = this.dialog.open(GenerateOtpComponent, {
      //   data:generateOTP
      // });
      // dialogRef.afterClosed().subscribe(result => {
      //   if(result){
          sessionStorage.setItem('ID', status.id);
          sessionStorage.setItem('ACCESS_TOKEN',status.token);
          sessionStorage.setItem('REFRESH_TOKEN',status.refreshToken);
          var base64Url = status.token.split('.')[1];
          var base64 = base64Url.replace('-', '+').replace('_', '/');
          let temp = JSON.parse(window.atob(base64));
          sessionStorage.setItem('AUTH',temp.data_users[0].authority);
          this.router.navigate(['/home']);
      //   }else{};
      // });
    }else if(status.statusCode == 500){
      if(status.error == 'Bad credentials'){
        this.openDialogError2 = true;
      }else if(status.error == 'No value present'){
        this.openDialogError1 = true;
      }
    }
  }

  back(){
    this.router.navigate(['/login']);
  }

  home(){
    this.router.navigate(['/home']);
  }

  forgotPass(){
    const dialogRef = this.dialog.open(DialogResetPasswordComponent, {
      data:this.role
    });
    dialogRef.afterClosed().subscribe(result => {

    });
  }

}

export class login{
  email?:string;
  password?:string;
}

export interface otp{
  userType: string;
  email: string;
  option:string;
  confirmationToken?:string;
}
