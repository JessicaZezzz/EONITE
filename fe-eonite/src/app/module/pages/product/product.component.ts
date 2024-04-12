import { Component, OnInit } from '@angular/core';
import { Product } from '../../models/auth.model';
import { RestApiServiceService } from '../../services/rest-api-service.service';
import { HttpEventType } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { DetailProductVendorComponent } from '../detail-product-vendor/detail-product-vendor.component';
import { AddProductComponent } from '../add-product/add-product.component';
import { EditProductComponent } from '../edit-product/edit-product.component';
import { DialogSuccessComponent } from '../dialog-success/dialog-success.component';

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
  deleteItem:boolean=false;
  deleteItemId?:number;
  rekening?:string;

  constructor(private restService:RestApiServiceService,public dialog: MatDialog) {
    this.vendorId = Number(sessionStorage.getItem('ID')!);
    this.restService.getprofileVendor(this.vendorId).subscribe((event)=>{
      if(event.type == HttpEventType.Response && event.body && event.ok){
        let data = Object(event.body)['vendor'];
        this.stateVendor = data[0].status;
        this.rekening = data[0].bankAccount;
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

  deleteProduct(id:number){
    this.deleteItem = true;
    this.deleteItemId = id;
  }

  onDelete(){
    let postDelete ={
      id:this.deleteItemId!
    }
    this.restService.deleteProduct(JSON.stringify(postDelete)).subscribe(event=>{
      if(event.statusCode == 200){
        const dialogRef = this.dialog.open(DialogSuccessComponent, {
          data: 'Berhasil menghapus produk',
        });
        this.deleteItem=false;
        dialogRef.afterClosed().subscribe(result => {
          this.getData();
        });
      }else if(event.statusCode == 500){
      }
    })
  }

}
