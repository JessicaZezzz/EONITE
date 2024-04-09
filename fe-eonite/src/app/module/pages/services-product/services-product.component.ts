import { Component, OnInit } from '@angular/core';
import { RestApiServiceService } from '../../services/rest-api-service.service';
import { Category, Domicile, page, Product } from '../../models/auth.model';
import { HttpEventType, HttpParams } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';

export interface filter{
  search?:string;
  min?:number;
  max?:number;
  rating?:number;
  sortBy?:string;
}

@Component({
  selector: 'app-services-product',
  templateUrl: './services-product.component.html',
  styleUrls: ['./services-product.component.css']
})
export class ServicesProductComponent implements OnInit {
  panelOpenState = false;
  category : Category[] = [];
  domicile : Domicile[] = [];
  listProduct:Product[] = [];
  filter:filter={};
  page:page={
    pageSize:20,
    pageIndex:0,
    length:0
  }
  loader:boolean=false;
  constructor(private restService: RestApiServiceService,private router:ActivatedRoute) {

  }

  ngOnInit() {
    if(this.router.snapshot.queryParamMap.get('search')! != null) this.filter.search = this.router.snapshot.queryParamMap.get('search')!;
    this.restService.getCategory().subscribe((data) => {
      this.category = data;
    });
    this.restService.getDomicile().subscribe((data) => {
      this.domicile = data;
    });
    this.getDataProduct();
  }

  getDataProduct(){
    this.loader=true;
    let params = new HttpParams().append('pagination',true)
                                .append('pageSize',this.page.pageSize!)
                                .append('pageIndex',this.page.pageIndex!);
    if(this.filter.min != null) params = params.append('min',this.filter.min!);
    if(this.filter.max != null) params = params.append('max',this.filter.max!);
    if(this.filter.rating != null) params = params.append('rating',this.filter.rating!);
    if(this.filter.search != null) params = params.append('search',this.filter.search!);
    if(this.filter.sortBy == 'nameAsc'){
      params = params.append('sortBy','name');
      params = params.append('sortDir','asc');
    }
    if(this.filter.sortBy == 'nameDesc'){
      params = params.append('sortBy','name');
      params = params.append('sortDir','desc');
    }
    if(this.filter.sortBy == 'priceAsc'){
      params = params.append('sortBy','price');
      params = params.append('sortDir','asc');
    }
    if(this.filter.sortBy == 'priceDesc'){
      params = params.append('sortBy','price');
      params = params.append('sortDir','desc');
    }
    if(this.filter.sortBy == 'ratingAsc'){
      params = params.append('sortBy','rating');
      params = params.append('sortDir','asc');
    }
    if(this.filter.sortBy == 'ratingDesc'){
      params = params.append('sortBy','rating');
      params = params.append('sortDir','desc');
    }
    this.restService.getAllProduct(params).subscribe((event)=>{
      if(event.type == HttpEventType.Response && event.body && event.ok){
        let data = Object(event.body)['products'];
        this.listProduct = data;
        this.page.length = Object(event.body)['length'];
        this.loader=false;
      }
    })
  }

  setSort(event:any){
    this.getDataProduct();
  }

  reset(){
    this.filter = {};
    this.getDataProduct();
  }

  apply(){
    this.getDataProduct();
  }

  emitPaging(event:any){
    this.page.pageIndex = event.pageIndex;
    this.page.pageSize = event.pageSize;
    this.getDataProduct();
  }
}
