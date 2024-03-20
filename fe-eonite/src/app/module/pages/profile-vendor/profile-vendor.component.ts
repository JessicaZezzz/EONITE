import { Component, OnInit } from '@angular/core';
import { Vendor } from '../../models/auth.model';
import { RestApiServiceService } from '../../services/rest-api-service.service';
import { HttpEventType } from '@angular/common/http';


@Component({
  selector: 'app-profile-vendor',
  templateUrl: './profile-vendor.component.html',
  styleUrls: ['./profile-vendor.component.css']
})

export class ProfileVendorComponent implements OnInit {
  vendor?:Vendor;
  vendorId!:number;

  constructor(private restService:RestApiServiceService) {
    this.vendorId = Number(sessionStorage.getItem('ID')!);
  }

  ngOnInit(): void {
    this.restService.getprofileVendor(this.vendorId).subscribe((event)=>{
      if(event.type == HttpEventType.Response && event.body && event.ok){
        let data = Object(event.body)['vendor'];
        this.vendor = data[0];
      }
    })
  }
}

