import { Component, OnInit } from '@angular/core';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { RestApiServiceService } from '../../services/rest-api-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpEventType, HttpParams } from '@angular/common/http';
import { page, Product, Vendor } from '../../models/auth.model';
import { DatePipe, Location } from '@angular/common';

@Component({
  selector: 'app-detail-vendor',
  templateUrl: './detail-vendor.component.html',
  styleUrls: ['./detail-vendor.component.css']
})
export class DetailVendorComponent implements OnInit {
  tabActive: boolean = true;
  show:boolean = false;
  categoryName:string[]=[];
  listProduct:Product[] = [];
  vendor?:Vendor;
  domicile:string='-';
  config: AngularEditorConfig = {
    editable: false,
    spellcheck: true,
    minHeight: '20rem',
    maxHeight: '20rem',
    defaultFontName: 'Arial',
    showToolbar: false,
  };
  page:page={
    pageSize:20,
    pageIndex:0,
    length:0
  }

  constructor(private restService:RestApiServiceService, private router:ActivatedRoute,private routes:Router,private datePipe:DatePipe) { }

  ngOnInit(): void {
    this.restService.getprofileVendor(this.router.snapshot.params['id']).subscribe((event)=>{
      if(event.type == HttpEventType.Response && event.body && event.ok){
        let data = Object(event.body)['vendor'];
        this.vendor = data[0];
        this.getCategory(this.vendor?.categoryVendors)
        this.getDomicile(this.vendor?.domicile_id!)
        this.getDataProduct();
      }
    })
  }

  getDataProduct(){
    let params = new HttpParams().append('pagination',true)
                                .append('pageSize',this.page.pageSize!)
                                .append('pageIndex',this.page.pageIndex!)
                                .append('id',this.vendor?.id!);
    this.restService.getAllProduct(params).subscribe((event)=>{
      if(event.type == HttpEventType.Response && event.body && event.ok){
        let data = Object(event.body)['products'];
        this.listProduct = data;
        this.page.length = Object(event.body)['length'];
      }
    })
  }

  myFilter = (d: Date): boolean => {
    const testDates: Date[] = [];
     this.vendor?.inoperative_date?.forEach(e=>{
      testDates.push(new Date(e));
     })
     const tmp = testDates.find(x=> x.toDateString() === d.toDateString());
    //  return testDates.findIndex(testDate =>d.toDateString() === testDate.toDateString() ) <= 0;
    return tmp==undefined;

  }

  clickit(){
    this.show = !this.show;
  }

  changeDate(date:string){
    return this.datePipe.transform(date, 'dd MMMM YYYY') || '';
  }

  changeFormatInoperative(listDate: string[]){
    let dates:string[]=[];
    if(listDate != null){
      for(let i of listDate){
        dates.push(this.changeDate(i))
      }
      return dates.toString();
    }else return '-';
  }

  checkData(data:any){
    if(data == null) return '-';
    else return data;
  }

  checkTime(data:any){
    if(data == null) return '00:00';
    else return data.toString().substring(0,5);
  }

  getCategory(categoryId :any){
    if(categoryId != null){
      categoryId.forEach((e: any)=>{
        this.restService.getCategorybyId(e.id).subscribe((data) => {
          this.categoryName.push(data);
        });
      })
    }
  }

  getDomicile(id: number){
    this.restService.getDomicilebyId(id).subscribe((data) => {
      this.domicile = data.name;
    });
  }

  back(){
    this.routes.navigate([`/services-vendor`])
  }

  emitPaging(event:any){
    this.page.pageIndex = event.pageIndex;
    this.page.pageSize = event.pageSize;
    this.getDataProduct();
  }

  chatVendor(id:number){
    const params = {
      vendorId: id,
      userId:sessionStorage.getItem('ID')
    }
    this.routes.navigate(['/chat'],{queryParams:params})
  }

}
