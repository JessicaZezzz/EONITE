import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { page, Product } from '../../models/auth.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-product',
  templateUrl: './list-product.component.html',
  styleUrls: ['./list-product.component.css']
})
export class ListProductComponent implements OnInit {
  @Input() data?:Product[];
  @Input() paging?:page;
  @Output() pages = new EventEmitter<page>();

  constructor(private router: Router) { }

  ngOnInit(): void {
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
