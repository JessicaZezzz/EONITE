import { Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { Category, Domicile, Vendor } from '../../models/auth.model';
import { RestApiServiceService } from '../../services/rest-api-service.service';
import { Router } from '@angular/router';
import { emailValidator } from '../../services/email-validator.directive';
import { HttpEventType } from '@angular/common/http';
import * as moment from 'moment';
import { MatDatepicker, MatDatepickerInputEvent } from '@angular/material/datepicker';
import { DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { DialogSuccessComponent } from '../dialog-success/dialog-success.component';

export const StrongPasswordRegx: RegExp = /^(?=[^A-Z]*[A-Z])(?=[^a-z]*[a-z])(?=\D*\d).{8,}$/;

@Component({
  selector: 'app-edit-profile-vendor',
  templateUrl: './edit-profile-vendor.component.html',
  styleUrls: ['./edit-profile-vendor.component.css']
})
export class EditProfileVendorComponent implements OnInit {
  maxDate: string;
  @ViewChild('picker', { static: true }) _picker?: MatDatepicker<Date>;
  public CLOSE_ON_SELECTED = false;
  public init = new Date();
  public resetModel = new Date(0);
  public model:Date[] = [];
  Form1!: FormGroup;
  vendorId!:number;
  urlImage?:any;
  imageFile:any;
  category : Category[] = [];
  domicile : Domicile[] = [];
  subCategory:number[]=[];
  vendor?:Vendor;
  description?:any;
  config: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    minHeight: '20rem',
    maxHeight: '20rem',
    placeholder: 'Isi deskripsi disini...',
    translate: 'no',
    sanitize: false,
    toolbarPosition: 'top',
    defaultFontName: 'Arial',
    toolbarHiddenButtons: [
      [
        'subscript',
        'superscript',
      ],
      [
        'link',
        'unlink',
        'insertImage',
        'insertVideo',
      ]
    ],
    customClasses: [
      {
        name: 'quote',
        class: 'quote',
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: 'titleText',
        class: 'titleText',
        tag: 'h1',
      },
    ]
  };

  constructor(private restService: RestApiServiceService, private router: Router,public dialog: MatDialog) {
    this.vendorId = Number(sessionStorage.getItem('ID')!);
    const today = new Date();
    const eightYearsAgo = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
    this.maxDate = eightYearsAgo.toISOString().split('T')[0];
    this.restService.getprofileVendor(this.vendorId).subscribe((event)=>{
      if(event.type == HttpEventType.Response && event.body && event.ok){
        let data = Object(event.body)['vendor'];
        this.vendor = data[0];
        this.getCatId();
        this.urlImage = 'data:image/jpeg;base64,'+this.vendor?.photo;
      }
    })
  }

  initForm(){
    this.Form1.controls['firstName'].setValue(this.vendor?.firstName)
    this.Form1.controls['lastName'].setValue(this.vendor?.lastName)
    this.Form1.controls['birthDate'].setValue(moment(this.vendor?.birthDate).utc().format('YYYY-MM-DD'))
    this.Form1.controls['phoneNumber'].setValue(this.vendor?.phoneNumber)
    this.Form1.controls['domicileId'].setValue(this.vendor?.domicile_id)
    this.Form1.controls['phoneBusiness'].setValue(this.vendor?.phoneBusiness)
    this.Form1.controls['categoryId'].setValue(this.subCategory);
    this.Form1.controls['usernameVendor'].setValue(this.vendor?.usernameVendor)
    this.Form1.controls['instagram'].setValue(this.vendor?.instagram_url)
    this.Form1.controls['address'].setValue(this.vendor?.address)
    this.Form1.controls['email'].setValue(this.vendor?.email)
    this.Form1.controls['startTime'].setValue(this.vendor?.startTime)
    this.Form1.controls['endTime'].setValue(this.vendor?.endTime)
    this.Form1.controls['bankAccount'].setValue(this.vendor?.bankAccount)
    this.description = this.vendor?.description;
    if(this.vendor?.inoperative_date != null && this.vendor?.inoperative_date!.length! >= 1){
      this.vendor?.inoperative_date!.forEach(e=>{
        this.model.push(new Date(e));
      })
    }else this.model=[];
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
      categoryId: new FormControl(this.vendor?.categoryVendors, [
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
      usernameVendor: new FormControl(this.vendor?.usernameVendor, [
        Validators.required,
        Validators.maxLength(50),
      ]),
      instagram: new FormControl(this.vendor?.instagram_url, []),
      startTime: new FormControl(this.vendor?.startTime, []),
      endTime: new FormControl(this.vendor?.endTime, []),
      address: new FormControl(this.vendor?.address, []),
      email: new FormControl({value:this.vendor?.email,disabled:true}, [
        Validators.required,
        emailValidator(),
      ]),
      bankAccount:new FormControl(this.vendor?.bankAccount, [
        Validators.required,
      ]),
      bankName:new FormControl(this.vendor?.bankName, [
        Validators.required,
      ]),
      bankType:new FormControl(this.vendor?.bankType, [
        Validators.required,
      ]),
    },{
      validators: this.emailcheckValidator()
    });
  }

  getCatId(){
    this.restService.getcategoryVendorId(this.vendorId).subscribe(event=>{
      this.subCategory = event;
      this.initForm();
    })
  }

  emailcheckValidator(): ValidatorFn {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const email = formGroup.get('email');
      if(email?.value!='' || email?.value!=null){
        this.restService.checkEmailVendor(email?.value).subscribe(e => {
          let vendor:any=e;
          if (e != null && vendor.id != this.vendorId) email?.setErrors({ emailCheck: true });
          return null;
        });
      }
      return null;
    };
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
    return this.Form1.get('categoryId')!;
  }

  get domicileId() {
    return this.Form1.get('domicileId')!;
  }

  get phoneBusiness() {
    return this.Form1.get('phoneBusiness')!;
  }

  get bankAccount() {
    return this.Form1.get('bankAccount')!;
  }

  get bankName() {
    return this.Form1.get('bankName')!;
  }

  get bankType() {
    return this.Form1.get('bankType')!;
  }

  get usernameVendor() {
    return this.Form1.get('usernameVendor')!;
  }

  get instagram() {
    return this.Form1.get('instagram')!;
  }

  get startTime() {
    return this.Form1.get('startTime')!;
  }

  get endTime() {
    return this.Form1.get('endTime')!;
  }

  get address() {
    return this.Form1.get('address')!;
  }

  onFileChanged(event:any) {
    let reader = new FileReader();
    if(event.target.files && event.target.files.length > 0) {
      let file = event.target.files[0];
        if(file.size <= 5000000){
          this.imageFile = event.target.files[0];
          reader.readAsDataURL(file);
          reader.onload = () => {
            this.urlImage = reader.result;
        }
      };
    }
  }

  compareArray(){
    let arrayA:number[]=this.subCategory;
    let arrayB:number[]=this.Form1.value.categoryId;
    return JSON.stringify(arrayA.slice().sort((a,b) => a-b)) === JSON.stringify(arrayB.slice().sort((a,b) => a-b));
  }

  updateVendor(){
    if (this.Form1.invalid) {
      for (const control of Object.keys(this.Form1.controls)) {
        this.Form1.controls[control].markAsTouched();
      }
    }else this.submitForm();
  }

  convertTimeFormat(inputTime: string): any {
    if(inputTime != null){
      const timeParts = inputTime.split(':');
      const hours = timeParts[0];
      const minutes = timeParts[1];
      const convertedTime = `${hours}:${minutes}:00`;
      return convertedTime;
    }
    return null;
  }

  submitForm(){
      let postVendor: Vendor = {};
    postVendor.id = this.vendorId;
    postVendor.subCategory = this.Form1.value.categoryId;
    postVendor.domicile_id = this.Form1.value.domicileId;
    postVendor.firstName = this.Form1.value.firstName;
    postVendor.lastName = this.Form1.value.lastName;
      let dates = this.Form1.value.birthDate;
        var year = dates.substring(0, 4);
        var month = dates.substring(5, 7);
        var day = dates.substring(8, 10);
      const bdate = new DatePipe('en-US');
    postVendor.birthDate = bdate.transform(new Date(parseInt(year),parseInt(month)-1,parseInt(day)),"yyyy-MM-ddThh:mm:ssZZZZZ")!;
    postVendor.phoneNumber = this.Form1.value.phoneNumber;
    postVendor.usernameVendor = this.Form1.value.usernameVendor;
    postVendor.phoneBusiness = this.Form1.value.phoneBusiness;
    postVendor.address = this.Form1.value.address;
    postVendor.startTime = this.convertTimeFormat(this.Form1.value.startTime);
    postVendor.endTime = this.convertTimeFormat(this.Form1.value.endTime);
    postVendor.instagram_url = this.Form1.value.instagram;
    let img = this.urlImage!.split(',')[1];
    postVendor.photo = img;
    postVendor.email = this.vendor?.email;
    postVendor.description = this.description;
    postVendor.bankAccount = this.Form1.value.bankAccount;
    postVendor.bankName = this.Form1.value.bankName;
    postVendor.bankType = this.Form1.value.bankType;

    this.restService.updateProfileVendor(JSON.stringify(postVendor)).subscribe(event=>{
      if(event.statusCode == 200){
        const dialogRef = this.dialog.open(DialogSuccessComponent, {
          data: 'Profil berhasil diperbarui',
        });

        dialogRef.afterClosed().subscribe(result => {
          console.log('The dialog was closed');
        });
        this.redirect();
      }else if(event.statusCode == 500){
      }
    })
  }

  redirect(){
    this.router.navigate(['/profile-vendor'])
  }

}
