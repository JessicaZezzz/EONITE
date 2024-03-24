import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Product } from '../../models/auth.model';
import { RestApiServiceService } from '../../services/rest-api-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpEventType } from '@angular/common/http';

@Component({
  selector: 'app-detail-product',
  templateUrl: './detail-product.component.html',
  styleUrls: ['./detail-product.component.css']
})
export class DetailProductComponent implements OnInit {
  openCart: boolean = false;
  zoomImage:boolean = false;
  vendorId?:number;
  vendorName?:string;
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
  image:string[]=[]
  cover:string='';
  product? :Product;

  constructor(private location: Location,private restService:RestApiServiceService,private router:ActivatedRoute,private routes:Router) {
    this.cover =this.image[0];
  }

  ngOnInit(): void {
    this.restService.getDetailProductById(this.router.snapshot.params['id']).subscribe((event)=>{
      if(event.type == HttpEventType.Response && event.body && event.ok){
        let data = Object(event.body)['products'];
        this.product = data[0];
        this.vendorId =  Object(event.body)['vendorId'];
        this.vendorName = Object(event.body)['usernameVendor'];
      }
      this.product?.photo.forEach(e=>{
        this.image.push('data:image/jpeg;base64,'+e.image)
      })
      if(this.image.length > 0) this.cover=this.image[0];
    })
  }

  addtoCart(){
    this.openCart = true;
  }

  closeCart(event:boolean){
    this.openCart = event;
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
  total:number;
}
