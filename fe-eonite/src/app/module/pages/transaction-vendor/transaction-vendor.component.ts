import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RestApiServiceService } from '../../services/rest-api-service.service';
import { HttpEventType } from '@angular/common/http';
import { Transaction } from '../../models/auth.model';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-transaction-vendor',
  templateUrl: './transaction-vendor.component.html',
  styleUrls: ['./transaction-vendor.component.css']
})
export class TransactionVendorComponent implements OnInit {
  listAll?       : Transaction[]     =[];
  listConfirmation? : Transaction[]  =[];
  listPayment?   :Transaction[]      =[];
  listOnGoing?   : Transaction[]     =[];
  listCompleted? : Transaction[]     =[];
  listCancelled? : Transaction[]     =[];
  loader:boolean=false;
  pages: number = 1;
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
    this.restService.getTransactionVendor(Number(sessionStorage.getItem('ID')),state).subscribe((event)=>{
      if(event.type == HttpEventType.Response && event.body && event.ok){
        let data = Object(event.body)['transactions'];
        switch(state){
          case('ALL'):{
            this.listAll = data;
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
            this.loader=false;
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
    this.router.navigate(['transaction-vendor-details', id]);
  }

}
