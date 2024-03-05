import { Component, OnInit } from '@angular/core';
import { DROPDOWN_ADMIN, DROPDOWN_USER, DROPDOWN_VENDOR, MENU, MENU_ADMIN, MENU_PUBLIC, MENU_VENDOR } from '../../models/auth.model';
import { Router } from '@angular/router';

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

  constructor(private router: Router){

  }

  ngOnInit() {
    this.role = sessionStorage.getItem('AUTH')!;
    if(this.role=='USER' || this.role==null){
      this.menu = MENU_PUBLIC;
      this.dropdown = DROPDOWN_USER;
    }else if(this.role=='VENDOR'){
      this.menu = MENU_VENDOR;
      this.dropdown = DROPDOWN_VENDOR;
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
