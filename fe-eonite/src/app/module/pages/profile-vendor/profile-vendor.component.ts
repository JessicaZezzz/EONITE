import { Component, OnInit } from '@angular/core';
import { Vendor } from '../../models/auth.model';
import { RestApiServiceService } from '../../services/rest-api-service.service';
import { HttpEventType } from '@angular/common/http';
import { Router } from '@angular/router';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { MatDialog } from '@angular/material/dialog';
import { DialogChangePasswordComponent } from '../dialog-change-password/dialog-change-password.component';
import { DialogSuccessComponent } from '../dialog-success/dialog-success.component';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-profile-vendor',
  templateUrl: './profile-vendor.component.html',
  styleUrls: ['./profile-vendor.component.css']
})

export class ProfileVendorComponent implements OnInit {
  vendor?:Vendor;
  vendorId!:number;
  categoryName:string[]=[];
  domicile:string='-';
  urlImage:any;
  config: AngularEditorConfig = {
    editable: false,
    spellcheck: true,
    minHeight: '20rem',
    maxHeight: '20rem',
    defaultFontName: 'Arial',
    showToolbar: false,
  };

  constructor(private restService:RestApiServiceService, private router:Router,public dialog: MatDialog,private datePipe:DatePipe) {
    this.vendorId = Number(sessionStorage.getItem('ID')!);
  }

  ngOnInit(): void {
    this.getData();
  }

  getData(){
    this.restService.getprofileVendor(this.vendorId).subscribe((event)=>{
      if(event.type == HttpEventType.Response && event.body && event.ok){
        let data = Object(event.body)['vendor'];
        this.vendor = data[0];
        this.getCategory(this.vendor?.categoryVendors)
        this.getDomicile(this.vendor?.domicile_id!)
      }
    })
  }

  onFileChanged(event:any) {
    let reader = new FileReader();
    if(event.target.files && event.target.files.length > 0) {
      let file = event.target.files[0];
        reader.readAsDataURL(file);
        reader.onload = () => {
          this.urlImage = reader.result;
        }
    }
  }

  upload(){
    let postVendor: Vendor = {};
    let img = this.urlImage!.split(',')[1];
    postVendor.id = this.vendorId;
    postVendor.photo_identity = img;
      this.restService.updatePhotoId(JSON.stringify(postVendor)).subscribe(event=>{
        if(event.statusCode == 200){
          const dialogRef = this.dialog.open(DialogSuccessComponent, {
            data: 'Identitas foto berhasil diperbarui',
          });

          dialogRef.afterClosed().subscribe(result => {
            this.getData();
          });
        }else if(event.statusCode == 500){}
      })
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

  edit(){
    this.router.navigate(['edit-profile-vendor'])
  }

  openChangePass(role:string):void{
    const dialogRef = this.dialog.open(DialogChangePasswordComponent, {
      data: role,
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

}

