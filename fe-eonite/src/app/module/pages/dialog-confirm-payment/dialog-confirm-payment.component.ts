import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { RestApiServiceService } from '../../services/rest-api-service.service';
import { Transaction } from '../../models/auth.model';
import { DialogRejectPaymentComponent } from '../dialog-reject-payment/dialog-reject-payment.component';
import { DialogSuccessComponent } from '../dialog-success/dialog-success.component';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-dialog-confirm-payment',
  templateUrl: './dialog-confirm-payment.component.html',
  styleUrls: ['./dialog-confirm-payment.component.css']
})
export class DialogConfirmPaymentComponent implements OnInit {

  imgUrl?:string;
  trans?:Transaction;
  constructor(public dialogRef: MatDialogRef<DialogConfirmPaymentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Transaction,private dialog:MatDialog, private restService:RestApiServiceService,private datePipe:DatePipe) {
      this.trans = data;
      this.imgUrl = 'data:image/jpeg;base64,'+data.payment.image;
  }

  getDate(date:string){
    return this.datePipe.transform(date, 'DD MMMM YYYY') || '';
  }

  ngOnInit(): void {
  }

  reject(){
    const dialogRef = this.dialog.open(DialogRejectPaymentComponent, {
      data:this.trans
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        const dialogRef = this.dialog.open(DialogSuccessComponent, {
          data:"Success Reject Payment"
        });
        dialogRef.afterClosed().subscribe(result => {
          this.dialogRef.close(true);
        });
      }
    });
  }

  confirm(){
    let postTrans :postTransaction={};
    postTrans.id = this.trans?.id;
    postTrans.prevState = this.trans?.state;
    postTrans.action = "ACCEPT";
    postTrans.description = "";
    this.restService.updateTransaction(JSON.stringify(postTrans)).subscribe((event)=>{
      if(event.statusCode == 200){
        const dialogRef = this.dialog.open(DialogSuccessComponent, {
          data:"Success Confirm Payment"
        });
        dialogRef.afterClosed().subscribe(result => {
          this.dialogRef.close(true);
        });
      }
    })
  }

  onNoClick(): void {
    this.dialogRef.close(false);
  }

}

export interface postTransaction{
  id?:number;
  prevState?:string;
  action?:string;
  description?:string;
}
