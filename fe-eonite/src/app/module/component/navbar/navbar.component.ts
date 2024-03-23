import { Component, OnInit } from '@angular/core';
import { DROPDOWN_ADMIN, DROPDOWN_USER, DROPDOWN_VENDOR, MENU, MENU_ADMIN, MENU_PUBLIC, MENU_VENDOR } from '../../models/auth.model';
import { Router } from '@angular/router';
import { RestApiServiceService } from '../../services/rest-api-service.service';
import { HttpEventType } from '@angular/common/http';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})

export class NavbarComponent implements OnInit {
  tabMobile: boolean = false;
  tabUser: boolean = false;
  role: string = '';
  menu : MENU[] = [];
  dropdown : MENU[] = [];
  imgProfile: string='';

  constructor(private router: Router,private restService:RestApiServiceService){

  }

  ngOnInit() {
    this.role = sessionStorage.getItem('AUTH')!;
    if(this.role=='USER' || this.role==null){
      this.menu = MENU_PUBLIC;
      this.dropdown = DROPDOWN_USER;
      this.restService.getprofileUser(Number(sessionStorage.getItem('ID'))).subscribe((event)=>{
        if(event.type == HttpEventType.Response && event.body && event.ok){
          let data = Object(event.body)['users'];
          this.imgProfile = data[0].photo;
        }
      })
    }else if(this.role=='VENDOR'){
      this.menu = MENU_VENDOR;
      this.dropdown = DROPDOWN_VENDOR;
      this.restService.getprofileVendor(Number(sessionStorage.getItem('ID'))).subscribe((event)=>{
        if(event.type == HttpEventType.Response && event.body && event.ok){
          let data = Object(event.body)['vendor'];
          this.imgProfile = data[0].photo;
        }
      })
    }else if(this.role=='ADMIN'){
      this.menu = MENU_ADMIN;
      this.dropdown = DROPDOWN_ADMIN;
    }
  }

  tabMobiles(){
    this.tabMobile == true? this.tabMobile = false : this.tabMobile = true;
  }

  tabUsers(){
    this.tabUser == true? this.tabUser = false : this.tabUser = true;
  }

  isActive(url: string): boolean {
    return this.router.isActive(url,false);
  }

  redirectPage(number: number){
    if(number == 1) this.router.navigateByUrl('/login');
    else this.router.navigateByUrl('/signup');
  }

}
