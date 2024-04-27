import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Domicile, page, Vendor } from '../../models/auth.model';
import { RestApiServiceService } from '../../services/rest-api-service.service';
import { Router } from '@angular/router';
import { MatPaginatorIntl } from '@angular/material/paginator';

@Component({
  selector: 'app-list-vendor',
  templateUrl: './list-vendor.component.html',
  styleUrls: ['./list-vendor.component.css']
})
export class ListVendorComponent implements OnInit {

  @Input() data?:Vendor[];
  @Input() paging?:page;
  @Output() pages = new EventEmitter<page>();
  domicile : Domicile[] = [];

  constructor(private restService: RestApiServiceService,private router: Router,public _MatPaginatorIntl: MatPaginatorIntl) { }

  ngOnInit(): void {
    this._MatPaginatorIntl.itemsPerPageLabel = 'Total item per halaman : ';
    this._MatPaginatorIntl.firstPageLabel = 'Halaman pertama';
    this._MatPaginatorIntl.lastPageLabel = 'Halaman terakhir';
    this._MatPaginatorIntl.nextPageLabel = 'Halaman selanjutnya';
    this._MatPaginatorIntl.previousPageLabel = 'Halaman sebelumnya';
    this.restService.getDomicile().subscribe((data) => {
      this.domicile = data;
    });
  }

  onPageChange(event: any): void {
    this.paging!.pageIndex = event.pageIndex;
    this.paging!.pageSize = event.pageSize;
    this.pages.emit(this.paging)
  }

  getCategory(i:any) {
    let category:string[]=[];
    i.forEach((e: { subcategory: { name: string; }; }) =>{
      category.push(e.subcategory.name)
    })
    return category.toString();
  }

  getDomicile(id:number){
    return this.domicile.find(x => x.id == id.toString())?.name;
  }

  redirect(id:number){
    this.router.navigate([`/details/${id}`]);
  }

  chatVendor(id:number){
    const params = {
      vendorId: id,
      userId:sessionStorage.getItem('ID')
    }
    this.router.navigate(['/chat'],{queryParams:params})
  }

  round(i:number){
    return i.toFixed(1);
  }

}
