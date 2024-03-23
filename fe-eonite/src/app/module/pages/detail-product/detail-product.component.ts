import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-detail-product',
  templateUrl: './detail-product.component.html',
  styleUrls: ['./detail-product.component.css']
})
export class DetailProductComponent implements OnInit {
  openCart: boolean = false;
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
  image:string[]=[
    'https://flowbite.s3.amazonaws.com/docs/gallery/featured/image.jpg',
    'https://flowbite.s3.amazonaws.com/docs/gallery/square/image-1.jpg',
    'https://flowbite.s3.amazonaws.com/docs/gallery/square/image-2.jpg',
    'https://flowbite.s3.amazonaws.com/docs/gallery/square/image-3.jpg',
    'https://flowbite.s3.amazonaws.com/docs/gallery/square/image-4.jpg',
    'https://flowbite.s3.amazonaws.com/docs/gallery/square/image-5.jpg',
    'https://flowbite.s3.amazonaws.com/docs/gallery/square/image-6.jpg'
  ]
  cover:string='';

  constructor(private location: Location) {
    this.cover =this.image[0];
  }

  ngOnInit(): void {
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
}

export interface review{
  rating:string;
  bar:string;
  total:number;
}
