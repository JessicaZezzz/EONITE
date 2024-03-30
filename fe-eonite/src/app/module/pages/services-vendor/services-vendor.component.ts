import { Component, OnInit } from '@angular/core';
import { RestApiServiceService } from '../../services/rest-api-service.service';
import { Category, Domicile, page, Vendor } from '../../models/auth.model';
import { HttpEventType, HttpParams } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

export interface filter{
  search?:string;
  categoryId?:number[];
  domicileId?:number;
  rating?:number;
  sortBy?:string;
}

@Component({
  selector: 'app-services-vendor',
  templateUrl: './services-vendor.component.html',
  styleUrls: ['./services-vendor.component.css']
})
export class ServicesVendorComponent implements OnInit {
  panelOpenState = false;
  category : Category[] = [];
  domicile : Domicile[] = [];
  filter:filter={};
  listVendor:Vendor[]=[];
  page:page={
    pageSize:20,
    pageIndex:0,
    length:0
  }

  constructor(private restService: RestApiServiceService,private router:ActivatedRoute) {

  }

  ngOnInit() {
    if(this.router.snapshot.queryParamMap.get('search')! != null) this.filter.search = this.router.snapshot.queryParamMap.get('search')!;
    if(this.router.snapshot.queryParamMap.get('category')! != null){
      this.filter.categoryId = [];
      this.filter.categoryId?.push(Number(this.router.snapshot.queryParamMap.get('category')!));
    }
    this.restService.getCategory().subscribe((data) => {
      this.category = data;
    });
    this.restService.getDomicile().subscribe((data) => {
      this.domicile = data;
    });
    console.log( this.router.snapshot.queryParamMap.get('category'))
    this.getDataVendor();
  }

  getDataVendor(){
    let params = new HttpParams().append('pagination',true)
                                  .append('pageSize',this.page.pageSize!)
                                  .append('pageIndex',this.page.pageIndex!);
    if(this.filter.categoryId != null) params = params.append('category',this.filter.categoryId!.toString());
    if(this.filter.domicileId != null) params = params.append('domicile',this.filter.domicileId!);
    if(this.filter.rating != null) params = params.append('rating',this.filter.rating!);
    if(this.filter.search != null) params = params.append('search',this.filter.search!);
    if(this.filter.sortBy == 'nameAsc'){
      params = params.append('sortBy','usernameVendor');
      params = params.append('sortDir','asc');
    }
    if(this.filter.sortBy == 'nameDesc'){
      params = params.append('sortBy','usernameVendor');
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
    this.restService.getAllVendor(params).subscribe((event)=>{
      if(event.type == HttpEventType.Response && event.body && event.ok){
        let data = Object(event.body)['vendor'];
        this.listVendor = data;
        this.page.length = Object(event.body)['length'];
      }
    })
  }

  reset(){
    this.filter = {};
    this.getDataVendor();
  }

  apply(){
    this.getDataVendor();
  }

  setSort(event:any){
    this.getDataVendor();
  }

  emitPaging(event:any){
    console.log(event)
    this.page.pageIndex = event.pageIndex;
    this.page.pageSize = event.pageSize;
    this.getDataVendor();
  }
}
