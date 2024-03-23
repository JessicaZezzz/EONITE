import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { RestApiServiceService } from '../../services/rest-api-service.service';
import { Product } from '../../models/auth.model';
import { HttpEventType } from '@angular/common/http';
import { review } from '../detail-product/detail-product.component';

@Component({
  selector: 'app-detail-product-vendor',
  templateUrl: './detail-product-vendor.component.html',
  styleUrls: ['./detail-product-vendor.component.css']
})
export class DetailProductVendorComponent implements OnInit {
  zoomImage:boolean = false;
  scale:string ='50%';
  review : review[]=[
    {
      rating:'5.0',
      bar:'20%',
      total:30.0
    },
    {
      rating:'4.0',
      bar:'50%',
      total:60.5
    },
    {
      rating:'3.0',
      bar:'66.7%',
      total:10.7
    },
    {
      rating:'2.0',
      bar:'80%',
      total:80
    },
    {
      rating:'1.0',
      bar:'20%',
      total:20
    },
  ];
  image:string[]=[];
  cover:string='';
  product? :Product;

  constructor(public dialogRef: MatDialogRef<DetailProductVendorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: number,private restService:RestApiServiceService) { }

  ngOnInit(): void {
    this.restService.getDetailProductById(this.data).subscribe((event)=>{
      if(event.type == HttpEventType.Response && event.body && event.ok){
        let data = Object(event.body)['products'];
        this.product = data[0];
      }
      this.product?.photo.forEach(e=>{
        this.image.push('data:image/jpeg;base64,'+e.image)
      })
      if(this.image.length > 0) this.cover=this.image[0];
    })
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onClick(event:any){
    this.zoomImage=true;
  }

  changeImg(index:string){
    this.cover=index;
  }

  formatPrice(number:string){
    return number.substring(2)
  }
}
