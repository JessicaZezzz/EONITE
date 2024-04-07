import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { RestApiServiceService } from '../../services/rest-api-service.service';
import { Transaction } from '../../models/auth.model';

@Component({
  selector: 'app-dialog-reject-payment',
  templateUrl: './dialog-reject-payment.component.html',
  styleUrls: ['./dialog-reject-payment.component.css']
})
export class DialogRejectPaymentComponent implements OnInit {

  alasanReject:string='';
  trans?:Transaction;
  constructor(public dialogRef: MatDialogRef<DialogRejectPaymentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Transaction, private restService:RestApiServiceService,private dialog:MatDialog) {
      this.trans=data;
  }

  ngOnInit(): void {
  }

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  submit(){
    let postTrans :postTransaction={};
    postTrans.id = this.trans?.id;
    postTrans.prevState = this.trans?.state;
    postTrans.action = "REJECT";
    postTrans.description = this.alasanReject;

    this.restService.updateTransaction(JSON.stringify(postTrans)).subscribe((event)=>{
      if(event.statusCode == 200){
        this.dialogRef.close(true);
      }
    })
  }
}

export interface postTransaction{
  id?:number;
  prevState?:string;
  action?:string;
  description?:string;
}
