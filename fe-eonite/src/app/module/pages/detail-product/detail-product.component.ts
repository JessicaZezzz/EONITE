import { productReview } from './../../models/auth.model';
import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Product } from '../../models/auth.model';
import { RestApiServiceService } from '../../services/rest-api-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpEventType } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { DialogCartComponent } from '../dialog-cart/dialog-cart.component';

@Component({
  selector: 'app-detail-product',
  templateUrl: './detail-product.component.html',
  styleUrls: ['./detail-product.component.css']
})
export class DetailProductComponent implements OnInit {
  zoomImage:boolean = false;
  vendorId?:number;
  vendorName?:string;
  loader:boolean=false;
  scale:string ='50%';
  review : review[]=[
    {
      rating:'5.0',
      bar:'0%',
      total:'0'
    },
    {
      rating:'4.0',
      bar:'0%',
      total:'0'
    },
    {
      rating:'3.0',
      bar:'0%',
      total:'0'
    },
    {
      rating:'2.0',
      bar:'0%',
      total:'0'
    },
    {
      rating:'1.0',
      bar:'0%',
      total:'0'
    },
  ];
  image:string[]=[]
  cover:string='';
  product? :Product;
  productReview:productReview[]=[];

  constructor(private location: Location,private restService:RestApiServiceService,private router:ActivatedRoute,private routes:Router,private dialog:MatDialog) {
    this.cover =this.image[0];

  }

  ngOnInit(): void {
    this.loader=true;
    this.restService.getDetailProductById(this.router.snapshot.params['id']).subscribe((event)=>{
      if(event.type == HttpEventType.Response && event.body && event.ok){
        let data = Object(event.body)['products'];
        this.product = data[0];
        this.vendorId =  Object(event.body)['vendorId'];
        this.vendorName = Object(event.body)['usernameVendor'];
        console.log(this.product)
      }
      this.product?.photo.forEach(e=>{
        this.image.push('data:image/jpeg;base64,'+e.image)
      })
      if(this.image.length > 0) this.cover=this.image[0];
      this.getReview();
    })
  }

  getReview(){
    this.restService.getReview(this.router.snapshot.params['id']).subscribe((event)=>{
      if(event.type == HttpEventType.Response && event.body && event.ok){
        let data = Object(event.body)['productReview'];
        this.productReview = data;
        if(this.productReview.length>0) this.calcRating();
        this.loader=false;
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
    this.review[0].total = (rate5/this.productReview.length*100).toString().split('.')[0];
    this.review[0].bar = (rate5/this.productReview.length*100).toString() +'%';
    this.review[1].total = (rate4/this.productReview.length*100).toString().split('.')[0];
    this.review[1].bar = (rate4/this.productReview.length*100).toString()+'%';
    this.review[2].total = (rate3/this.productReview.length*100).toString().split('.')[0];
    this.review[2].bar = (rate3/this.productReview.length*100).toString()+'%';
    this.review[3].total = (rate2/this.productReview.length*100).toString().split('.')[0];
    this.review[3].bar = (rate2/this.productReview.length*100).toString()+'%';
    this.review[4].total = (rate1/this.productReview.length*100).toString().split('.')[0];
    this.review[4].bar = (rate1/this.productReview.length*100).toString()+'%';
  }

  getRating(num:number){
    return Array(num).fill(0).map((x, i) => i + 1);
  }

  addtoCart(){
    const dialogRef = this.dialog.open(DialogCartComponent, {
      data:this.product
    });

    dialogRef.afterClosed().subscribe(result => {

    });
  }

  changeImg(index:string){
    this.cover=index;
  }

  onClick(event:any){
    this.zoomImage=true;
  }

  back(){
    this.location.back();
  }

  formatPrice(number:string){
    return number.substring(2)
  }

  redirectVendor(){
    this.routes.navigate([`/details/${this.vendorId}`])
  }

}

export interface review{
  rating:string;
  bar:string;
  total:string;
}
