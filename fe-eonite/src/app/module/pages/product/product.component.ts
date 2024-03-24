import { Component, OnInit } from '@angular/core';
import { Product } from '../../models/auth.model';
import { RestApiServiceService } from '../../services/rest-api-service.service';
import { HttpEventType } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { DetailProductVendorComponent } from '../detail-product-vendor/detail-product-vendor.component';
import { AddProductComponent } from '../add-product/add-product.component';
import { EditProductComponent } from '../edit-product/edit-product.component';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {
  vendorId!:number;
  listProduct:Product[] = [];
  stateVendor?:string;
  tooltip:string='';

  constructor(private restService:RestApiServiceService,public dialog: MatDialog) {
    this.vendorId = Number(sessionStorage.getItem('ID')!);
    this.restService.getprofileVendor(this.vendorId).subscribe((event)=>{
      if(event.type == HttpEventType.Response && event.body && event.ok){
        let data = Object(event.body)['vendor'];
        this.stateVendor = data[0].status;
        if(this.stateVendor == 'PENDING') this.tooltip='Your Status need to be confirmed first!'
      }
    })
  }

  ngOnInit(): void {
    this.getData();
  }

  getData(){
    this.restService.getProductbyVendorId(this.vendorId).subscribe((event)=>{
      if(event.type == HttpEventType.Response && event.body && event.ok){
        let data = Object(event.body)['products'];
        this.listProduct = data;
      }
    })
  }

  clickPreview(id:number){
    const dialogRef = this.dialog.open(DetailProductVendorComponent, {
      height:'600px',
      data: id,
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('Prview Product are closed');
    });
  }

  addProduct(){
    const dialogRef = this.dialog.open(AddProductComponent, {
      height:'600px',
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getData();
    });
  }

  editProduct(id:number){
    const dialogRef = this.dialog.open(EditProductComponent, {
      height:'600px',
      data:id
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getData();
    });
  }

}
