import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { RestApiServiceService } from '../../services/rest-api-service.service';
import { refund } from '../../models/auth.model';
import { DialogSuccessComponent } from '../dialog-success/dialog-success.component';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-dialog-confirm-refund',
  templateUrl: './dialog-confirm-refund.component.html',
  styleUrls: ['./dialog-confirm-refund.component.css']
})
export class DialogConfirmRefundComponent implements OnInit {

  photoTransferVendor?:any;
  photoTransferUser?:any;
  errorUser:string='*Required';
  errorVendor:string='*Required';
  loader:boolean=false;
  constructor(public dialogRef: MatDialogRef<DialogConfirmRefundComponent>,
    @Inject(MAT_DIALOG_DATA) public data: refund, private restService:RestApiServiceService,private dialog:MatDialog,private datePipe:DatePipe) {
      if(this.data.totalFundUser == 0) this.errorUser='';
      if(this.data.totalFundVendor == 0) this.errorVendor='';
  }

  ngOnInit(): void {
  }

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  submit(){
    this.loader=true;
    let postrefund :postRefund={};
    postrefund.id = this.data?.id;
    if(this.photoTransferUser != undefined){
      let img = this.photoTransferUser!.split(',')[1];
      postrefund.tfUser = img;
    }else postrefund.tfUser = null;
    if(this.photoTransferVendor != undefined){
      let imgV = this.photoTransferVendor!.split(',')[1];
      postrefund.tfVendor = imgV;
    }else postrefund.tfVendor = null;

    this.restService.updateRefund(JSON.stringify(postrefund)).subscribe((event)=>{
      if(event.statusCode == 200){
        this.loader=false;
        const dialogRef = this.dialog.open(DialogSuccessComponent, {
          data:"Successfully refunded the user and/or paid the vendor"
        });
        dialogRef.afterClosed().subscribe(result => {
          this.dialogRef.close(true);
        });
      }
    })
  }

  checkSubmit(){
    let flag=0;
    if(this.data.totalFundUser! > 0){
      if(this.errorUser == '') flag++;
    }else flag++;
    if(this.data.totalFundVendor! > 0){
      if(this.errorVendor == '') flag++;
    }else flag++;
    if(flag == 2) return false;
    return true;
  }

  onFileChangedUser(event:any) {
    let reader = new FileReader();
    if(event.target.files && event.target.files.length > 0) {
      let file = event.target.files[0];
      if(file.size > 5000000){
        this.errorUser='*The photo exceeding the maximum file size. Please upload photo <= 5 MB'
        this.photoTransferUser = undefined;
      }else{
        reader.readAsDataURL(file);
        reader.onload = () => {
          this.photoTransferUser = reader.result;
          this.errorUser = '';
      }
      };
    }
  }

  onFileChangedVendor(event:any) {
    let reader = new FileReader();
    if(event.target.files && event.target.files.length > 0) {
      let file = event.target.files[0];
      if(file.size > 5000000){
        this.errorVendor='*The photo exceeding the maximum file size. Please upload photo <= 5 MB'
        this.photoTransferVendor=undefined;
      }else{
        reader.readAsDataURL(file);
        reader.onload = () => {
          this.photoTransferVendor = reader.result;
          this.errorVendor = '';
      }
      };
    }
  }

  deletePhotoUser(){
    this.errorUser='*Required';
    this.photoTransferUser=undefined;
  }

  deletePhotoVendor(){
    this.errorVendor='*Required';
    this.photoTransferVendor=undefined;
  }

  getDate(date:string){
    return this.datePipe.transform(date, 'dd MMMM YYYY HH:mm') || '';
  }
}

export interface postRefund{
  id?:number;
  tfUser?:any;
  tfVendor?:any;
}
