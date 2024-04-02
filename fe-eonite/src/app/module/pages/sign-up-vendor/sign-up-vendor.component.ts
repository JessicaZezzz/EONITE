import { Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Category, Domicile, Vendor } from '../../models/auth.model';
import { Router } from '@angular/router';
import { RestApiServiceService } from '../../services/rest-api-service.service';
import { emailValidator } from '../../services/email-validator.directive';
import { passwordConfirmationValidator } from '../../services/confirm-password';
import { DatePipe } from '@angular/common';
import { imagedflt } from '../../models/photo.model';
import { GenerateOtpComponent } from '../generate-otp/generate-otp.component';
import { MatDialog } from '@angular/material/dialog';

export const StrongPasswordRegx: RegExp = /^(?=[^A-Z]*[A-Z])(?=[^a-z]*[a-z])(?=\D*\d).{8,}$/;

@Component({
  selector: 'app-sign-up-vendor',
  templateUrl: './sign-up-vendor.component.html',
  styleUrls: ['./sign-up-vendor.component.css']
})
export class SignUpVendorComponent {
  phase:number = 1;
  category : Category[] = [];
  domicile : Domicile[] = [];
  Form1!: FormGroup;
  Form2!: FormGroup;
  Form3!: FormGroup;
  vendor?:Vendor;
  confPassword?:string;
  acceptcb:boolean = false;
  openDialogErrorDiv: boolean = false;
  openDialogSuccessDiv: boolean = false;
  urlImage?:any;
  imageFile:any;
  error:string='';
  dfltImg:string = imagedflt;

  constructor(private restService: RestApiServiceService, private router: Router,public dialog: MatDialog){
    this.vendor = {} as Vendor;
  }

  ngOnInit(): void {
    this.restService.getCategory().subscribe((data) => {
      this.category = data;
    });
    this.restService.getDomicile().subscribe((data) => {
      this.domicile = data;
    });

    this.Form1 = new FormGroup({
      firstName: new FormControl(this.vendor?.firstName, [
        Validators.required,
      ]),
      lastName: new FormControl(this.vendor?.lastName, [
        Validators.required,
      ]),
      birthDate: new FormControl(this.vendor?.birthDate, [
        Validators.required,
      ]),
      phoneNumber: new FormControl(this.vendor?.phoneNumber, [
        Validators.required,
        Validators.pattern("^[0-9]*$"),
        Validators.minLength(10)
      ]),
      email: new FormControl(this.vendor?.email, [
        Validators.required,
        emailValidator(),

      ]),
      password: new FormControl(this.vendor?.password, [
        Validators.required,
        Validators.pattern(StrongPasswordRegx),
        Validators.minLength(12),
      ]),
      confirmPassword: new FormControl(this.confPassword, [
        Validators.required
      ]),
    },{
      validators: [passwordConfirmationValidator('password', 'confirmPassword'),this.emailcheckValidator()]
    });

    this.Form2 = new FormGroup({
      categoryId: new FormControl(this.vendor?.subCategory, [
        Validators.required,
      ]),
      domicileId: new FormControl(this.vendor?.domicile_id, [
        Validators.required,
      ]),
      phoneBusiness: new FormControl(this.vendor?.phoneBusiness, [
        Validators.required,
        Validators.pattern("^[0-9]*$"),
        Validators.minLength(10)
      ]),
      username: new FormControl(this.vendor?.usernameVendor, [
        Validators.required,
        Validators.maxLength(50),
      ]),
    });

    this.Form3 = new FormGroup({
      photoId: new FormControl(this.vendor?.photo_identity, [
        Validators.required,
      ]),
      acceptTnC: new FormControl(this.acceptcb, [
        Validators.requiredTrue
      ]),
    });
  }

  nextPhase(form: number){
    switch (form){
      case 0:{
        this.phase = 1;
        break;
      }
      case 1:{
        if (this.Form1.invalid) {
          for (const control of Object.keys(this.Form1.controls)) {
            this.Form1.controls[control].markAsTouched();
          }
          break;
        }else this.phase = 2;
        break;
      }
      case 2:{
        if (this.Form2.invalid) {
          for (const control of Object.keys(this.Form2.controls)) {
            this.Form2.controls[control].markAsTouched();
          }
          break;
        }else this.phase = 3;
        break;
      }
      case 3:{
        if (this.Form3.invalid) {
          for (const control of Object.keys(this.Form3.controls)) {
            this.Form3.controls[control].markAsTouched();
          }
          break;
        }else this.submitForm();
        break;
      }
    }
  }

  emailcheckValidator(): ValidatorFn {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const email = formGroup.get('email');
      if(email?.value!=''){
        this.restService.checkEmailVendor(email?.value).subscribe(e => {
          if (e != null) email?.setErrors({ emailCheck: true });
          return null;
        });
      }
      return null;
    };
  }

  deletePhoto(){
    this.urlImage = null;
    this.imageFile = null;
    this.Form3.get('photoId')!.setValue(null);
  }

  onFileChanged(event:any) {
    let reader = new FileReader();
    if(event.target.files && event.target.files.length > 0) {
      let file = event.target.files[0];
      if(file.size > 5000000){
        this.openDialogErrorDiv = true;
        this.error='The photo exceeding the maximum file size. Please upload photo <= 5 MB'
        this.deletePhoto();
      }else{
        this.imageFile = event.target.files[0];
        reader.readAsDataURL(file);
        reader.onload = () => {
          this.urlImage = reader.result;
      }
      };
    }
  }

  submitForm(){
      let postVendor: Vendor = {};
      postVendor.role = 'VENDOR';
      postVendor.subCategory = this.Form2.value.categoryId;
      postVendor.domicile_id = this.Form2.value.domicileId;
      postVendor.firstName = this.Form1.value.firstName;
      postVendor.lastName = this.Form1.value.lastName;
      let dates = this.Form1.value.birthDate;
        var year = dates.substring(0, 4);
        var month = dates.substring(5, 7);
        var day = dates.substring(8, 10);
      const bdate = new DatePipe('en-US');
      postVendor.birthDate = bdate.transform(new Date(parseInt(year),parseInt(month)-1,parseInt(day)),"yyyy-MM-ddThh:mm:ssZZZZZ")!;
      postVendor.phoneNumber = this.Form1.value.phoneNumber;
      postVendor.usernameVendor = this.Form2.value.username;
      postVendor.phoneBusiness = this.Form2.value.phoneBusiness;
      postVendor.photo = this.dfltImg;
      postVendor.photo_identity = this.urlImage.substring(23)
      postVendor.status = 'PENDING';
      postVendor.email = this.Form1.value.email;
      postVendor.password = this.Form1.value.password;

    // console.log(postVendor)
    let generateOTP:otp={
      userType:postVendor.role,
      email:postVendor.email!,
      option:'signup'
    };
    const dialogRef = this.dialog.open(GenerateOtpComponent, {
      data:generateOTP
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.restService.postsignInVendor(JSON.stringify(postVendor)).subscribe(event=>{
          if(event.statusCode == 200){
            this.openDialogSuccessDiv = true;
          }else if(event.statusCode == 500){
            this.openDialogErrorDiv = true;
          }
        })
      }else{};
    });
  }

  get firstName() {
    return this.Form1.get('firstName')!;
  }

  get lastName() {
    return this.Form1.get('lastName')!;
  }

  get birthDate() {
    return this.Form1.get('birthDate')!;
  }

  get phoneNumber() {
    return this.Form1.get('phoneNumber')!;
  }

  get email() {
    return this.Form1.get('email')!;
  }

  get password() {
    return this.Form1.get('password')!;
  }

  get confirmPassword() {
    return this.Form1.get('confirmPassword')!;
  }

  get categoryId() {
    return this.Form2.get('categoryId')!;
  }

  get domicileId() {
    return this.Form2.get('domicileId')!;
  }

  get phoneBusiness() {
    return this.Form2.get('phoneBusiness')!;
  }

  get username() {
    return this.Form2.get('username')!;
  }

  get photoId() {
    return this.Form3.get('photoId')!;
  }

  get acceptTnC() {
    return this.Form3.get('acceptTnC')!;
  }

  redirect(): void {
    this.router.navigate(['/login']);
  }

  back(){
    this.router.navigate(['/signup']);
  }
}

export interface otp{
  userType: string;
  email: string;
  option:string;
  confirmationToken?:string;
}
