import { Component, Inject, OnInit } from '@angular/core';
import { Subscription, take, timer } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { RestApiServiceService } from '../../services/rest-api-service.service';

@Component({
  selector: 'app-generate-otp',
  templateUrl: './generate-otp.component.html',
  styleUrls: ['./generate-otp.component.css']
})
export class GenerateOtpComponent implements OnInit {
  totalSeconds = 300;
  minutes = 0;
  seconds = 0;
  timerSubscription?: Subscription;
  otp:string[]=['','','','','',''];
  error:string='';
  loader:boolean=false;
  constructor(public dialogRef: MatDialogRef<GenerateOtpComponent>,
    @Inject(MAT_DIALOG_DATA) public data: otp,private restService:RestApiServiceService) {
      this.resendOTP();
  }

  ngOnInit(): void {

  }

  startTimer(): void {
    this.totalSeconds = 300;
    const source = timer(0, 1000);
    this.timerSubscription = source.pipe(
      take(300)
    ).subscribe(() => {
      this.totalSeconds--;
      this.updateTime();
    });
  }

  updateTime(): void {
    this.minutes = Math.floor(this.totalSeconds / 60);
    this.seconds = this.totalSeconds % 60;
  }

  ngOnDestroy(): void {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }

  resendOTP(){
    this.loader=true;
    if(this.data.option=='signup'){
      let sendOTP:otp={
        userType: this.data.userType,
        email: this.data.email,
      }
      this.restService.generateOTP(JSON.stringify(sendOTP)).subscribe(event=>{
        if(event.statusCode == 200){
          this.startTimer();
          this.loader=false;
        }else if(event.statusCode == 500){
          this.dialogRef.close(false);
        }
      });
    }else if(this.data.option=='login'){
      let sendOTP:otp={
        userType: this.data.userType,
        email: this.data.email,
      }
      this.restService.generateOTPlogin(JSON.stringify(sendOTP)).subscribe(event=>{
        if(event.statusCode == 200){
          this.startTimer();
          this.loader=false;
        }else if(event.statusCode == 500){
          this.dialogRef.close(false);
        }
      });
    }
  }

  submitOTP(){
    let sendOTP:otp={
      userType: this.data.userType,
      email: this.data.email,
      confirmationToken:this.otp.join('')
    }
    this.restService.checkOTP(JSON.stringify(sendOTP)).subscribe(event=>{
      if(event.statusCode == 200){
        this.dialogRef.close(true);
      }else if(event.statusCode == 500){
        this.otp=['','','','','',''];
        this.error = event.error;
      }
    });
  }

  checkSubmitOTP(){
    let flag=6;
    this.otp.forEach(i=>{
      if(i != ''){
        if(!(/^\d+$/.test(i))) flag--;
      }else if(i == '') flag--;
    })
    if(flag == 6 && this.totalSeconds > 0){
      this.error = '';
      return false;
    }else return true;
  }

  checkOTP(){
    if(this.totalSeconds == 0) return false;
    else return true;
  }

}

export interface otp{
  userType: string;
  email: string;
  option?:string;
  confirmationToken?:string;
}
