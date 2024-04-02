import { Component, Inject, OnInit } from '@angular/core';
import { RestApiServiceService } from '../../services/rest-api-service.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { emailValidator } from '../../services/email-validator.directive';
import { DialogSuccessComponent } from '../dialog-success/dialog-success.component';

@Component({
  selector: 'app-dialog-reset-password',
  templateUrl: './dialog-reset-password.component.html',
  styleUrls: ['./dialog-reset-password.component.css']
})
export class DialogResetPasswordComponent implements OnInit {

  error:string='';
  emails?:string;
  Form1!: FormGroup;
  constructor(public dialogRef: MatDialogRef<DialogResetPasswordComponent>,private dialog:MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: string,private restService:RestApiServiceService) { }

  ngOnInit(): void {
    this.Form1 = new FormGroup({
      email: new FormControl(this.emails, [
        Validators.required,
        emailValidator(),
      ])
    },{});
  }

  get email() {
    return this.Form1.get('email')!;
  }

  submitReset(){
    if (this.Form1.invalid) {
      for (const control of Object.keys(this.Form1.controls)) {
        this.Form1.controls[control].markAsTouched();
      }
    }else this.resetPassword();
  }

  resetPassword(){
    let form:emailreset={
      userType:this.data,
      email:this.Form1.value.email
    }
    this.restService.resetPassword(JSON.stringify(form)).subscribe(event=>{
      if(event.statusCode == 200){
        const dialogRef = this.dialog.open(DialogSuccessComponent, {
          data: 'Success Reset Password',
        });
        this.dialogRef.close();
      }else if(event.statusCode == 500){
        this.error = event.error;
        this.Form1.controls['email'].setValue('');
      }
    })
  }

}

export interface emailreset{
  userType: string;
  email: string;
}
