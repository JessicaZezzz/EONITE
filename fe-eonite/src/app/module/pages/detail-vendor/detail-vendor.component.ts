import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-detail-vendor',
  templateUrl: './detail-vendor.component.html',
  styleUrls: ['./detail-vendor.component.css']
})
export class DetailVendorComponent implements OnInit {
  tabActive: boolean = true;
  constructor() { }

  ngOnInit(): void {
  }

}
