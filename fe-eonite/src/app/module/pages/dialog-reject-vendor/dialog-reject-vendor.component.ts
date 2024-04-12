import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { RestApiServiceService } from '../../services/rest-api-service.service';
import { DialogBookingComponent } from '../dialog-booking/dialog-booking.component';
import { DialogSuccessComponent } from '../dialog-success/dialog-success.component';
import { Vendor } from '../../models/auth.model';

@Component({
  selector: 'app-dialog-reject-vendor',
  templateUrl: './dialog-reject-vendor.component.html',
  styleUrls: ['./dialog-reject-vendor.component.css']
})
export class DialogRejectVendorComponent implements OnInit {
  quest?:string;
  alasanReject:string='';
  dataVendor?:Vendor;
  loader:boolean=false;
  constructor(public dialogRef: MatDialogRef<DialogRejectVendorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Vendor, private restService:RestApiServiceService,private dialog:MatDialog) {
      this.dataVendor=data;
  }

  ngOnInit(): void {

  }

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  submit(){
    this.loader=true;
    let dt : vendorState={
      id : this.dataVendor?.id,
      status : "PENDING",
      status_reject:this.alasanReject
    }

    this.restService.updateVendorState(JSON.stringify(dt)).subscribe((event)=>{
      if(event.statusCode == 200){
        this.loader=false;
        this.dialogRef.close(true);
      }
    })
  }
}

export interface vendorState{
  id?:number;
  status?:string;
  status_reject?:string;
}
