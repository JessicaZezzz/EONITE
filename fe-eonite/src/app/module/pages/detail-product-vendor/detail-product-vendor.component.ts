import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { RestApiServiceService } from '../../services/rest-api-service.service';
import { Product, productReview } from '../../models/auth.model';
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
      bar:'0%',
      total:0
    },
    {
      rating:'4.0',
      bar:'0%',
      total:0
    },
    {
      rating:'3.0',
      bar:'0%',
      total:0
    },
    {
      rating:'2.0',
      bar:'0%',
      total:0
    },
    {
      rating:'1.0',
      bar:'0%',
      total:0
    },
  ];
  image:string[]=[];
  cover:string='';
  product? :Product;
  productReview:productReview[]=[];

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
    this.restService.getReview(this.data).subscribe((event)=>{
      if(event.type == HttpEventType.Response && event.body && event.ok){
        let data = Object(event.body)['productReview'];
        this.productReview = data;
        if(this.productReview.length>0) this.calcRating();
      }
    })
  }

  calcRating(){
    let rate5:number=0;
    let rate4:number=0;
    let rate3:number=0;
    let rate2:number=0;
    let rate1:number=0;
  this.productReview.forEach((e)=>{
    if(e.rating == 5) rate5++;
    if(e.rating == 4) rate4++;
    if(e.rating == 3) rate3++;
    if(e.rating == 2) rate2++;
    if(e.rating == 1) rate1++;
  })
    this.review[0].total = rate5/this.productReview.length*100;
    this.review[0].bar = (rate5/this.productReview.length*100).toString()+'%';
    this.review[1].total = rate4/this.productReview.length*100;
    this.review[1].bar = (rate4/this.productReview.length*100).toString()+'%';
    this.review[2].total = rate3/this.productReview.length*100;
    this.review[2].bar = (rate3/this.productReview.length*100).toString()+'%';
    this.review[3].total = rate2/this.productReview.length*100;
    this.review[3].bar = (rate2/this.productReview.length*100).toString()+'%';
    this.review[4].total = rate1/this.productReview.length*100;
    this.review[4].bar = (rate1/this.productReview.length*100).toString()+'%';
  }

  getRating(num:number){
    return Array(num).fill(0).map((x, i) => i + 1);
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
