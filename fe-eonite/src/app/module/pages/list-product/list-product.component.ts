import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { page, Product } from '../../models/auth.model';
import { Router } from '@angular/router';
import { MatPaginatorIntl } from '@angular/material/paginator';

@Component({
  selector: 'app-list-product',
  templateUrl: './list-product.component.html',
  styleUrls: ['./list-product.component.css']
})
export class ListProductComponent implements OnInit {
  @Input() data?:Product[];
  @Input() paging?:page;
  @Output() pages = new EventEmitter<page>();
  constructor(private router: Router,public _MatPaginatorIntl: MatPaginatorIntl) { }

  ngOnInit(): void {
    this._MatPaginatorIntl.itemsPerPageLabel = 'Total item per halaman : ';
    this._MatPaginatorIntl.firstPageLabel = 'Halaman pertama';
    this._MatPaginatorIntl.lastPageLabel = 'Halaman terakhir';
    this._MatPaginatorIntl.nextPageLabel = 'Halaman selanjutnya';
    this._MatPaginatorIntl.previousPageLabel = 'Halaman sebelumnya';
  }

  clickDetail(id:number){
    this.router.navigate([`/product/${id}`]);
  }

  onPageChange(event: any): void {
    this.paging!.pageIndex = event.pageIndex;
    this.paging!.pageSize = event.pageSize;
    this.pages.emit(this.paging)
  }
}
