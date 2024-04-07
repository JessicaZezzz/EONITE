import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogManagDetailVendorComponent } from '../dialog-manag-detail-vendor/dialog-manag-detail-vendor.component';
import { RestApiServiceService } from '../../services/rest-api-service.service';
import { Vendor } from '../../models/auth.model';
import { HttpEventType } from '@angular/common/http';

@Component({
  selector: 'app-manage-vendor',
  templateUrl: './manage-vendor.component.html',
  styleUrls: ['./manage-vendor.component.css']
})
export class ManageVendorComponent implements OnInit {
  listVendor:Vendor[]=[];
  constructor(private dialog:MatDialog,private restService:RestApiServiceService) { }

  ngOnInit(): void {
    this.restService.getAllVendorPending().subscribe((event)=>{
      if(event.type == HttpEventType.Response && event.body && event.ok){
        let data = Object(event.body)['vendor'];
        this.listVendor = data;
      }
    })
  }

  getData(){
    this.restService.getAllVendorPending().subscribe((event)=>{
      if(event.type == HttpEventType.Response && event.body && event.ok){
        let data = Object(event.body)['vendor'];
        this.listVendor = data;
      }
    })
  }

  confirm(i:Vendor){
    const dialogRef = this.dialog.open(DialogManagDetailVendorComponent, {
      data:i
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result) this.getData();
    });
  }

}
