import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { RestApiServiceService } from '../../services/rest-api-service.service';
import { DialogBookingComponent } from '../dialog-booking/dialog-booking.component';
import { DialogSuccessComponent } from '../dialog-success/dialog-success.component';

@Component({
  selector: 'app-dialog-cancel-transaction',
  templateUrl: './dialog-cancel-transaction.component.html',
  styleUrls: ['./dialog-cancel-transaction.component.css']
})
export class DialogCancelTransactionComponent implements OnInit {

  quest?:string;
  alasanReject?:string;
  loader:boolean=false;
  constructor(public dialogRef: MatDialogRef<DialogBookingComponent>,
    @Inject(MAT_DIALOG_DATA) public data: postTransaction, private restService:RestApiServiceService,private dialog:MatDialog) { }

  ngOnInit(): void {
    this.quest = this.data.quest;
  }

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  check(){
    if(this.data.action == 'DONE' || this.data.action == 'ACCEPT') return false;
    else return true;
  }

  checkBtn(){
    if(this.data.action == 'DONE' || this.data.action == 'ACCEPT') return false;
    else {
      if(this.alasanReject == undefined || this.alasanReject == '') return true;
      else return false;
    }
  }

  submit(){
    this.loader=true;
    let postTrans :postTransaction={};
    postTrans.id = this.data.id;
    postTrans.prevState = this.data.prevState;
    postTrans.action = this.data.action;
    postTrans.description = this.alasanReject;
    this.restService.updateTransaction(JSON.stringify(postTrans)).subscribe(event => {
      if(event.statusCode == 200){
        this.loader=false;
        const dialogRef = this.dialog.open(DialogSuccessComponent, {
          data: 'Transaksi berhasil diperbarui',
        });
        this.dialogRef.close(true);
      }else if(event.statusCode == 500){
      }
    })
  }
}

export interface postTransaction{
  id?:number;
  prevState?:string;
  action?:string;
  description?:string;
  quest?:string;
}
