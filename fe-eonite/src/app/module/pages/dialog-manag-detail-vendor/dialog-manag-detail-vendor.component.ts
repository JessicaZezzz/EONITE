import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { RestApiServiceService } from '../../services/rest-api-service.service';
import { DialogRejectVendorComponent } from '../dialog-reject-vendor/dialog-reject-vendor.component';
import { Vendor } from '../../models/auth.model';
import { DialogSuccessComponent } from '../dialog-success/dialog-success.component';
import * as moment from 'moment';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-dialog-manag-detail-vendor',
  templateUrl: './dialog-manag-detail-vendor.component.html',
  styleUrls: ['./dialog-manag-detail-vendor.component.css']
})
export class DialogManagDetailVendorComponent implements OnInit {

  dataVendor!:Vendor;
  zoomImage:boolean = false;
  cover:string='';
  constructor(public dialogRef: MatDialogRef<DialogManagDetailVendorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Vendor,private dialog:MatDialog, private restService:RestApiServiceService,private datePipe:DatePipe) {
      this.dataVendor = data;
      this.cover = 'data:image/jpeg;base64,'+data.photo_identity;
  }

  ngOnInit(): void {

  }

  confirm(){
    let dt : vendorState={
      id : this.dataVendor.id,
      status : "CONFIRMED",
      status_reject:''
    }

    this.restService.updateVendorState(JSON.stringify(dt)).subscribe((event)=>{
      if(event.statusCode == 200){
        const dialogRef = this.dialog.open(DialogSuccessComponent, {
          data:"Success Confirm Vendor"
        });
        dialogRef.afterClosed().subscribe(result => {
          this.dialogRef.close(true);
        });
      }
    })
  }

  reject(){
    const dialogRef = this.dialog.open(DialogRejectVendorComponent, {
      data:this.dataVendor
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        const dialogRef = this.dialog.open(DialogSuccessComponent, {
          data:"Success Reject Vendor"
        });
        dialogRef.afterClosed().subscribe(result => {
          this.dialogRef.close(true);
        });
      }
    });
  }

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  getDate(date:string){
    return this.datePipe.transform(date, 'DD MMMM YYYY') || '';
  }

}

export interface vendorState{
  id?:number;
  status?:string;
  status_reject?:string;
}
