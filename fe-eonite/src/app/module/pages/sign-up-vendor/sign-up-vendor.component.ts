import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Category, Domicile, Vendor } from '../../models/auth.model';
import { Router } from '@angular/router';
import { RestApiServiceService } from '../../services/rest-api-service.service';
import { emailValidator } from '../../services/email-validator.directive';
import { passwordConfirmationValidator } from '../../services/confirm-password';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/app/enviroment/environment';
import { DatePipe } from '@angular/common';

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

  constructor(private restService: RestApiServiceService, private router: Router,private httpClinet:HttpClient){
    this.vendor = {} as Vendor;
    this.restService.getCategory().subscribe((data) => {
      this.category = data;
    });
    this.restService.getDomicile().subscribe((data) => {
      this.domicile = data;
    });
  }

  ngOnInit(): void {
    this.Form1 = new FormGroup({
      firstName: new FormControl(this.vendor?.first_name, [
        Validators.required,
      ]),
      lastName: new FormControl(this.vendor?.last_name, [
        Validators.required,
      ]),
      birthDate: new FormControl(this.vendor?.birth_date, [
        Validators.required,
      ]),
      phoneNumber: new FormControl(this.vendor?.phone_number, [
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
      validators: passwordConfirmationValidator('password', 'confirmPassword')
    });

    this.Form2 = new FormGroup({
      categoryId: new FormControl(this.vendor?.category_id, [
        Validators.required,
      ]),
      domicileId: new FormControl(this.vendor?.domicile_id, [
        Validators.required,
      ]),
      phoneBusiness: new FormControl(this.vendor?.phone_business, [
        Validators.required,
        Validators.pattern("^[0-9]*$"),
        Validators.minLength(10)
      ]),
      startTime: new FormControl(this.vendor?.startTime, [
        Validators.required,
      ]),
      endTime: new FormControl(this.vendor?.endTime, [
        Validators.required,
      ]),
      address: new FormControl(this.vendor?.address, [
        Validators.required,
        Validators.maxLength(150),
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
        postVendor.first_name = this.Form1.value.firstName;
        postVendor.last_name = this.Form1.value.lastName;
      let dates = this.Form1.value.birthDate;
        var year = dates.substring(0, 4);
        var month = dates.substring(5, 7);
        var day = dates.substring(8, 10);
      const bdate = new DatePipe('en-US');
        postVendor.birth_date = bdate.transform(new Date(parseInt(year),parseInt(month)-1,parseInt(day)),"yyyy-MM-ddThh:mm:ssZZZZZ")!;
        postVendor.photo_id = 1;
        postVendor.phone_number = this.Form1.value.phoneNumber;
      postVendor.email = this.Form1.value.email;
      postVendor.password = this.Form1.value.password;
      postVendor.role = 'VENDOR';
      postVendor.category_id = this.Form2.value.categoryId;
      postVendor.domicile_id = this.Form2.value.domicileId;
      postVendor.phone_business = this.Form2.value.phoneBusiness;
      postVendor.startTime = this.Form2.value.startTime+":00";
      postVendor.endTime = this.Form2.value.endTime+":00";
      postVendor.address = this.Form2.value.address;
      postVendor.status = 'PENDING';

    const uploadImage = new FormData();
    uploadImage.append('file',this.imageFile,this.imageFile.name);
    this.httpClinet.post(`${environment.apiUrl}/public/uploadPhoto`,uploadImage).subscribe(res=>{
      let photo_id:any = res;
      postVendor.photo_identity = photo_id.id;
        this.restService.postsignInVendor(JSON.stringify(postVendor)).subscribe(event=>{
          if(event.statusCode == 200){
            this.openDialogSuccessDiv = true;
          }else if(event.statusCode == 500){
            this.error='Email is already registered, please use another email';
            this.openDialogErrorDiv = true;
          }
      })
    },err=>{
      console.log(err)
    })
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

  get startTime() {
    return this.Form2.get('startTime')!;
  }

  get endTime() {
    return this.Form2.get('endTime')!;
  }

  get address() {
    return this.Form2.get('address')!;
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
