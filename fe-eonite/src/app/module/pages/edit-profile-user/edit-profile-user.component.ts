import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { User } from '../../models/auth.model';
import { RestApiServiceService } from '../../services/rest-api-service.service';
import { HttpEventType } from '@angular/common/http';
import { emailValidator } from '../../services/email-validator.directive';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import * as moment from 'moment';
import { DatePipe } from '@angular/common';
import { DialogSuccessComponent } from '../dialog-success/dialog-success.component';

@Component({
  selector: 'app-edit-profile-user',
  templateUrl: './edit-profile-user.component.html',
  styleUrls: ['./edit-profile-user.component.css']
})
export class EditProfileUserComponent implements OnInit {
  reactiveForm!: FormGroup;
  user?:User;
  confPassword?:string;
  openDialogErrorDiv: boolean = false;
  openDialogSuccessDiv: boolean = false;
  urlImage?:any;
  imageFile:any;
  maxDate: string;

  constructor(public dialogRef: MatDialogRef<EditProfileUserComponent>,
    @Inject(MAT_DIALOG_DATA) public data: string,private restService: RestApiServiceService,public dialog: MatDialog) {
    this.user = {} as User;
    const today = new Date();
    const eightYearsAgo = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
    this.maxDate = eightYearsAgo.toISOString().split('T')[0];
  }

  ngOnInit(): void {
    this.restService.getprofileUser(Number(sessionStorage.getItem('ID'))).subscribe((event)=>{
      if(event.type == HttpEventType.Response && event.body && event.ok){
        let data = Object(event.body)['users'];
        this.user = data[0];
      }
      this.reactiveForm.controls['firstName'].setValue(this.user?.firstName);
      this.reactiveForm.controls['lastName'].setValue(this.user?.lastName);
      this.reactiveForm.controls['birthDate'].setValue(moment(this.user?.birthDate).utc().format('YYYY-MM-DD'));
      this.reactiveForm.controls['phoneNumber'].setValue(this.user?.phoneNumber);
      this.reactiveForm.controls['email'].setValue(this.user?.email);
      this.urlImage = 'data:image/jpeg;base64,'+this.user?.photo;
    })

    this.reactiveForm = new FormGroup({
      firstName: new FormControl(this.user?.firstName, [
        Validators.required,
      ]),
      lastName: new FormControl(this.user?.lastName, [
        Validators.required,
      ]),
      birthDate: new FormControl(this.user?.birthDate, [
        Validators.required,
      ]),
      phoneNumber: new FormControl(this.user?.phoneNumber, [
        Validators.required,
        Validators.pattern("^[0-9]*$"),
        Validators.minLength(10)
      ]),
      email: new FormControl({value:this.user?.email, disabled: true}, [
        Validators.required,
        emailValidator(),
      ])
    },{
      // validators: this.emailcheckValidator()
    });
  }

  emailcheckValidator(): ValidatorFn {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const email = formGroup.get('email');
      if(email?.value!=''){
        this.restService.checkEmailUser(email?.value).subscribe(e => {
          let user:any=e;
          if (e != null && user.id != this.user?.id) email?.setErrors({ emailCheck: true });
          return null;
        });
      }
      return null;
    };
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

  get firstName() {
    return this.reactiveForm.get('firstName')!;
  }

  get lastName() {
    return this.reactiveForm.get('lastName')!;
  }

  get birthDate() {
    return this.reactiveForm.get('birthDate')!;
  }

  get phoneNumber() {
    return this.reactiveForm.get('phoneNumber')!;
  }

  get email() {
    return this.reactiveForm.get('email')!;
  }

  onSubmit() {
    if (this.reactiveForm.invalid) {
      for (const control of Object.keys(this.reactiveForm.controls)) {
        this.reactiveForm.controls[control].markAsTouched();
      }
    }else this.updateUser();
  }

  updateUser(){
    let postUser: User = {};
    postUser.id = this.user?.id;
    postUser.firstName = this.reactiveForm.value.firstName;
    postUser.lastName = this.reactiveForm.value.lastName;
      let dates = this.reactiveForm.value.birthDate;
        var year = dates.substring(0, 4);
        var month = dates.substring(5, 7);
        var day = dates.substring(8, 10);
      const bdate = new DatePipe('en-US');
    postUser.birthDate = bdate.transform(new Date(parseInt(year),parseInt(month)-1,parseInt(day)),"yyyy-MM-ddThh:mm:ssZZZZZ")!;
    postUser.phoneNumber = this.reactiveForm.value.phoneNumber;
    let img = this.urlImage!.split(',')[1];
    postUser.photo = img;
    postUser.email = this.user?.email;

    this.restService.updateProfileUser(JSON.stringify(postUser)).subscribe(event=>{
      if(event.statusCode == 200){
        const dialogRef = this.dialog.open(DialogSuccessComponent, {
          data: 'Profil berhasil diperbarui',
        });

        dialogRef.afterClosed().subscribe(result => {
          console.log('The dialog was closed');
        });
        this.onNoClick();
      }else if(event.statusCode == 500){
      }
    })
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
