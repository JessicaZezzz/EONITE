import { Component, OnInit } from '@angular/core';
import { DialogConfirmPaymentComponent } from '../dialog-confirm-payment/dialog-confirm-payment.component';
import { MatDialog } from '@angular/material/dialog';
import { RestApiServiceService } from '../../services/rest-api-service.service';
import { refund, Transaction } from '../../models/auth.model';
import { HttpEventType } from '@angular/common/http';
import { DialogConfirmRefundComponent } from '../dialog-confirm-refund/dialog-confirm-refund.component';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-manage-transaction',
  templateUrl: './manage-transaction.component.html',
  styleUrls: ['./manage-transaction.component.css']
})
export class ManageTransactionComponent implements OnInit {

  listTrans:Transaction[]=[];
  listRefund:refund[] = [];
  loader:boolean=false;
  constructor(private dialog:MatDialog, private restService:RestApiServiceService,private datePipe:DatePipe) { }

  ngOnInit(): void {
    this.loader = true;
    this.getData();
    this.getRefund();
  }

  getData(){
    this.restService.getTransactionPending().subscribe((event)=>{
      if(event.type == HttpEventType.Response && event.body && event.ok){
        let data = Object(event.body)['transactions'];
        this.listTrans = data;
      }
    })
  }

  getRefund(){
    this.restService.getTransactionRefund().subscribe((event)=>{
      if(event.type == HttpEventType.Response && event.body && event.ok){
        let data = Object(event.body)['fundTransactions'];
        this.listRefund = data;
        this.loader = false;
      }
    })
  }

  confirmPayment(i:Transaction){
    const dialogRef = this.dialog.open(DialogConfirmPaymentComponent, {
      data:i
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.getData();
      }
    });
  }

  confirmRefund(i:refund){
    const dialogRef = this.dialog.open(DialogConfirmRefundComponent, {
      data:i
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.getRefund();
      }
    });
  }

  getDate(date:string){
    return this.datePipe.transform(date, 'dd MMMM YYYY') || '';
  }
}
