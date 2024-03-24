import { Component, OnInit } from '@angular/core';
import { RestApiServiceService } from '../../services/rest-api-service.service';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { page, Product, Vendor } from '../../models/auth.model';
import { HttpEventType, HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.css']
})
export class ServicesComponent implements OnInit {
  search?:string;
  listVendor:Vendor[]=[];
  pageVendor:page={
    pageSize:20,
    pageIndex:0,
    length:0
  }
  listProduct:Product[] = [];
  pageProduct:page={
    pageSize:20,
    pageIndex:0,
    length:0
  }

  constructor(private restService: RestApiServiceService,private route:ActivatedRoute,private router:Router){
  }

  ngOnInit(){
    this.search = this.route.snapshot.queryParamMap.get('search')!;
    this.getDataVendor();
    this.getDataProduct();
  }

  getDataVendor(){
    let params = new HttpParams().append('pagination',true)
                                  .append('pageSize',this.pageVendor.pageSize!)
                                  .append('pageIndex',this.pageVendor.pageIndex!);
    if(this.search != null) params = params.append('search',this.search!);
    this.restService.getAllVendor(params).subscribe((event)=>{
      if(event.type == HttpEventType.Response && event.body && event.ok){
        let data = Object(event.body)['vendor'];
        this.listVendor = data;
        this.pageVendor.length = Object(event.body)['length'];
      }
    })
  }

  getDataProduct(){
    let params = new HttpParams().append('pagination',true)
                                .append('pageSize',this.pageProduct.pageSize!)
                                .append('pageIndex',this.pageProduct.pageIndex!);
    if(this.search != null) params = params.append('search',this.search!);

    this.restService.getAllProduct(params).subscribe((event)=>{
      if(event.type == HttpEventType.Response && event.body && event.ok){
        let data = Object(event.body)['products'];
        this.listProduct = data;
        this.pageProduct.length = Object(event.body)['length'];
      }
    })
  }

  emitPagingVendor(event:any){
    this.pageVendor.pageIndex = event.pageIndex;
    this.pageVendor.pageSize = event.pageSize;
    this.getDataVendor();
  }

  emitPagingProduct(event:any){
    this.pageProduct.pageIndex = event.pageIndex;
    this.pageProduct.pageSize = event.pageSize;
    this.getDataProduct();
  }

  redirectVendor(){
    const params = {
      search: this.search
    }
    if(this.search!=''){
      this.router.navigate(['/services-vendor'],{queryParams:params})
    }
  }

  redirectProduct(){
    const params = {
      search: this.search
    }
    if(this.search!=''){
      this.router.navigate(['/services-product'],{queryParams:params})
    }
  }
}
