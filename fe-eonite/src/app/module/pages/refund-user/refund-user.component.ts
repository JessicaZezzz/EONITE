import { Component, OnInit } from '@angular/core';
import { refund } from '../../models/auth.model';
import { RestApiServiceService } from '../../services/rest-api-service.service';
import { DomSanitizer } from '@angular/platform-browser';
import { HttpEventType } from '@angular/common/http';

@Component({
  selector: 'app-refund-user',
  templateUrl: './refund-user.component.html',
  styleUrls: ['./refund-user.component.css']
})
export class RefundUserComponent implements OnInit {
  listPayment:refund[]=[];
  loader:boolean=false;
  constructor(private restService:RestApiServiceService,private sanitization:DomSanitizer) { }

  ngOnInit(): void {
    this.loader=true;
    this.restService.getTransactionRefundUser(Number(sessionStorage.getItem("ID"))).subscribe((event)=>{
      if(event.type == HttpEventType.Response && event.body && event.ok){
        let data = Object(event.body)['fundTransactions'];
        this.listPayment = data;
        this.loader=false;
      }
    })
  }

  getImage(element:refund){
    let data = this.sanitization.bypassSecurityTrustResourceUrl('data:image/jpg;base64,'+element!.transaction?.transDet[0]!.product!.photo[0]!.image!)
    return data;
  }

  getImg(element:refund){
    let data = this.sanitization.bypassSecurityTrustResourceUrl('data:image/jpg;base64,'+element!.tfUser)
    return data;
  }

  check(){
    if(this.listPayment?.length! == 0) return true;
    else{
      if(this.listPayment?.find(x => x.totalFundUser! > 0) != undefined) return false;
      return true;
    }
  }

}
