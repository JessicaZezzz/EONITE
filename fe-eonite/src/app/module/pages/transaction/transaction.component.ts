import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RestApiServiceService } from '../../services/rest-api-service.service';
import { HttpEventType } from '@angular/common/http';
import { Transaction } from '../../models/auth.model';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.css']
})
export class TransactionComponent implements OnInit {
  listAll?       : Transaction[]     =[];
  listConfirmation? : Transaction[]  =[];
  listPayment?   :Transaction[]      =[];
  listOnGoing?   : Transaction[]     =[];
  listCompleted? : Transaction[]     =[];
  listCancelled? : Transaction[]     =[];
  loader:boolean=false;
  pages: number = 1;
  // state:string[]=['ALL','WAITING-CONFIRMATION','WAITING-PAYMENT','ON-GOING','COMPLETED','CANCELLED'];
  constructor(private sanitization:DomSanitizer,private router: Router,private restService:RestApiServiceService) { }

  ngOnInit(): void {
    this.loader=true;
    this.getTransaction('ALL');
    this.getTransaction('WAITING-CONFIRMATION');
    this.getTransaction('WAITING-PAYMENT');
    this.getTransaction('ON-GOING');
    this.getTransaction('COMPLETED');
    this.getTransaction('CANCELLED');
  }

  getTransaction(state:string): void {
    this.restService.getTransactionUser(Number(sessionStorage.getItem('ID')),state).subscribe((event)=>{
      if(event.type == HttpEventType.Response && event.body && event.ok){
        let data = Object(event.body)['transactions'];
        switch(state){
          case('ALL'):{
            this.listAll = data;
            this.loader=false;
            break;
          }
          case('WAITING-CONFIRMATION'):{
            this.listConfirmation = data;
            break;
          }
          case('WAITING-PAYMENT'):{
            this.listPayment = data;
            break;
          }
          case('ON-GOING'):{
            this.listOnGoing = data;
            break;
          }
          case('COMPLETED'):{
            this.listCompleted = data;
            break;
          }
          case('CANCELLED'):{
            this.listCancelled = data;

            break;
          }
        }
      }
    })
  }

  getImage(element:Transaction){
    let data:any;
    if(element.transDet.length>0) data = this.sanitization.bypassSecurityTrustResourceUrl('data:image/jpg;base64,'+element!.transDet[0]!.product!.photo[0]!.image!);
    else data = '';
    return data;
  }

  redirectDetail(id:number){
    this.router.navigate(['transaction-details', id]);
  }
}
