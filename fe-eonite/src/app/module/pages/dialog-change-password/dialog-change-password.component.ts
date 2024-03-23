import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { passwordConfirmationValidator } from '../../services/confirm-password';
import { RestApiServiceService } from '../../services/rest-api-service.service';
import { DialogSuccessComponent } from '../dialog-success/dialog-success.component';

export const StrongPasswordRegx: RegExp = /^(?=[^A-Z]*[A-Z])(?=[^a-z]*[a-z])(?=\D*\d).{8,}$/;

@Component({
  selector: 'app-dialog-change-password',
  templateUrl: './dialog-change-password.component.html',
  styleUrls: ['./dialog-change-password.component.css']
})
export class DialogChangePasswordComponent implements OnInit {
  Form1!: FormGroup;
  id?:number;
  oldpassword:string='';
  newpassword:string='';
  confpassword:string='';
  role:string='';

  constructor( public dialogRef: MatDialogRef<DialogChangePasswordComponent>,
    @Inject(MAT_DIALOG_DATA) public data: string,private restService: RestApiServiceService,public dialog: MatDialog) {
      this.id = Number(sessionStorage.getItem('ID')!);
      this.role=data;
  }

  ngOnInit(): void {
    this.Form1 = new FormGroup({
      oldpasswords: new FormControl(this.oldpassword, [
        Validators.required,
      ]),
      newpasswords: new FormControl(this.newpassword, [
        Validators.required,
        Validators.pattern(StrongPasswordRegx),
        Validators.minLength(12),
      ]),
      confirmPassword: new FormControl(this.confpassword, [
        Validators.required
      ]),
    },{
      validators: [passwordConfirmationValidator('newpasswords', 'confirmPassword'),this.passwordValidator()]
    });
  }

  get oldpasswords() {
    return this.Form1.get('oldpasswords')!;
  }

  get newpasswords() {
    return this.Form1.get('newpasswords')!;
  }

  get confirmPassword() {
    return this.Form1.get('confirmPassword')!;
  }

  passwordValidator(): ValidatorFn {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const oldpassword = formGroup.get('oldpasswords');
      if(oldpassword?.value!=''){
        let idpass = {
          id:this.id,
          password:oldpassword!.value
        }
        if(this.role=='VENDOR'){
          this.restService.checkPasswordVendor(JSON.stringify(idpass)).subscribe(e => {
            if (e.statusCode == 500) oldpassword?.setErrors({ passwordMatch: true });
            return null;
          });
        }else if(this.role=='USER'){
        // this.restService.checkEmailVendor(email?.value).subscribe(e => {
        //   let vendor:any=e;
        //   if (e != null && vendor.id != this.id) email?.setErrors({ emailCheck: true });
        //   return null;
        // });
        }
      }
      return null;
    };
  }

  changePass(){
    if (this.Form1.invalid) {
      for (const control of Object.keys(this.Form1.controls)) {
        this.Form1.controls[control].markAsTouched();
      }
    }else this.submit();
  }

  submit(){
    let newpass={
      id: this.id,
      password: this.Form1.controls['newpasswords'].value
    }
    this.restService.changePasswordVendor(JSON.stringify(newpass)).subscribe(e => {
      if(e.statusCode == 200){
        const dialogRef = this.dialog.open(DialogSuccessComponent, {
          data: 'Success Update Password',
        });

        dialogRef.afterClosed().subscribe(result => {
          console.log('The dialog was closed');
        });
        this.dialogRef.close();
      }
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
