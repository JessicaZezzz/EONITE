import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Inject, OnInit, Output, ViewChild } from '@angular/core';
import { MatDatepicker } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Vendor } from '../../models/auth.model';
import { HttpEventType } from '@angular/common/http';
import { RestApiServiceService } from '../../services/rest-api-service.service';
import { DialogSuccessComponent } from '../dialog-success/dialog-success.component';

@Component({
  selector: 'app-dialog-booking',
  templateUrl: './dialog-booking.component.html',
  styleUrls: ['./dialog-booking.component.css']
})
export class DialogBookingComponent implements OnInit {
  public CLOSE_ON_SELECTED = false;
  grandTotal:number=0;
  cartData: Product[] = [];
  vendor?:Vendor;
  desc:string='';

  @Output() openBooking = new EventEmitter<boolean>();
  @ViewChild('picker', { static: true }) _picker?: MatDatepicker<Date>;

  constructor(public dialogRef: MatDialogRef<DialogBookingComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private restService:RestApiServiceService,private dialog:MatDialog,) {  }

  ngOnInit(): void {
    this.cartData = this.data
    this.cartData.forEach(element => {
      let price = element.productPrice * element.quantity;
      this.grandTotal += price;
    });
    this.getDataVendor();
  }

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  getDataVendor(){
    this.restService.getprofileVendor(this.cartData[0]?.vendorId!).subscribe((event)=>{
      if(event.type == HttpEventType.Response && event.body && event.ok){
        let data = Object(event.body)['vendor'];
        this.vendor = data[0];
      }
    })
  }

  changeFormatDate(dtae:string){
    let dt = dtae.split(',');
    let dates:string[]=[];
    if(dtae != null){
      for(let i of dt){
        var year = i.substring(6, 10);
        var month = i.substring(3, 5);
        var day = i.substring(0, 2);
        var datePipe = new DatePipe("en-US");
        dates.push(datePipe.transform(new Date(parseInt(year),parseInt(month)-1,parseInt(day)),"dd MMMM YYYY")!)
      }
      return dates.toString();
    }else return '-';
  }

  submitBooking(){
    let carts:postCart={
      userId: 0,
      vendorId: 0,
      cartId: [],
      description:'',
    };
    carts.userId = Number(sessionStorage.getItem('ID'));
    carts.vendorId = this.vendor?.id!;
    this.cartData.forEach(element => {
      carts.cartId.push(element.id);
    });
    carts.description = this.desc;

    this.restService.addBooking(JSON.stringify(carts)).subscribe(event => {
      if(event.statusCode == 200){
        const dialogRef = this.dialog.open(DialogSuccessComponent, {
          data: 'Successfully made a booking',
        });
        this.dialogRef.close(true);

      }else if(event.statusCode == 500){
      }
    })
  }
}

export interface postCart{
  userId:number;
  vendorId:number;
  cartId:number[];
  description:string;
}
export interface Product {
  id:number;
  photo:string;
  productId:number;
  productName:string;
  productPrice:number;
  productRating:number;
  quantity: number;
  usernameVendor:string;
  bookdate?: string;
  vendorId?:number;
}
