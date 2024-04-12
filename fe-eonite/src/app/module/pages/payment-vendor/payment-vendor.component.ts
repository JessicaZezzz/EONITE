import { Component, OnInit } from '@angular/core';
import { refund } from '../../models/auth.model';
import { RestApiServiceService } from '../../services/rest-api-service.service';
import { HttpEventType } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-payment-vendor',
  templateUrl: './payment-vendor.component.html',
  styleUrls: ['./payment-vendor.component.css']
})
export class PaymentVendorComponent implements OnInit {

  listPayment:refund[]=[];
  constructor(private restService:RestApiServiceService,private sanitization:DomSanitizer) { }

  ngOnInit(): void {
    this.restService.getTransactionRefundVendor(Number(sessionStorage.getItem("ID"))).subscribe((event)=>{
      if(event.type == HttpEventType.Response && event.body && event.ok){
        let data = Object(event.body)['fundTransactions'];
        this.listPayment = data;
      }
    })
  }

  getImage(element:refund){
    let data = this.sanitization.bypassSecurityTrustResourceUrl('data:image/jpg;base64,'+element!.transaction?.transDet[0]!.product!.photo[0]!.image!)
    return data;
  }

  getImg(element:refund){
    let data = this.sanitization.bypassSecurityTrustResourceUrl('data:image/jpg;base64,'+element!.tfVendor)
    return data;
  }

  check(){
    if(this.listPayment?.length! == 0) return true;
    else{
      if(this.listPayment?.find(x => x.totalFundVendor! > 0) != undefined) return false;
      return true;
    }
  }

}
