import { Component } from '@angular/core';
import { MENU, MENU_ADMIN, MENU_PUBLIC, MENU_VENDOR } from '../../models/auth.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})

export class NavbarComponent {
  tabMobile: boolean = false;
  tabUser: boolean = false;

  role: string = 'User';
  menu : MENU[] = [];

  constructor(private router: Router){
    if(this.role == 'Public' || this.role == 'User') this.menu = MENU_PUBLIC;
    else if(this.role == 'Vendor') this.menu = MENU_VENDOR;
    else if(this.role == 'Admin') this.menu = MENU_ADMIN;
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

}
