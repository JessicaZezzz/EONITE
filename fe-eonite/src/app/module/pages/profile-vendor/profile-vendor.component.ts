import { Component, OnInit } from '@angular/core';
import { Vendor } from '../../models/auth.model';
import { RestApiServiceService } from '../../services/rest-api-service.service';
import { HttpEventType } from '@angular/common/http';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { AngularEditorConfig } from '@kolkov/angular-editor';

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
  config: AngularEditorConfig = {
    editable: false,
    spellcheck: true,
    minHeight: '20rem',
    maxHeight: '20rem',
    defaultFontName: 'Arial',
    showToolbar: false,
  };

  constructor(private restService:RestApiServiceService, private router:Router) {
    this.vendorId = Number(sessionStorage.getItem('ID')!);
  }

  ngOnInit(): void {
    this.restService.getprofileVendor(this.vendorId).subscribe((event)=>{
      if(event.type == HttpEventType.Response && event.body && event.ok){
        let data = Object(event.body)['vendor'];
        this.vendor = data[0];
        this.getCategory(this.vendor?.categoryVendors)
        this.getDomicile(this.vendor?.domicile_id!)
      }
    })
  }

  changeDate(date:string){
    let dt = moment(date).utc().format('DD MMMM YYYY');
    return dt;
  }

  changeFormatInoperative(listDate: string[]){
    let dates:string[]=[];
    for(let i of listDate){
      dates.push(this.changeDate(i))
    }
    return dates.toString();
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

}

