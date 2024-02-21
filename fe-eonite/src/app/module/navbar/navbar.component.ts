import { Component } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})

export class NavbarComponent {
  tabNav : boolean = false;
  role: string = 'Public';
  menu : MENU[] = [];

  constructor(){
    if(this.role == 'Public' || this.role == 'User') this.menu = MENU_PUBLIC;
    else if(this.role == 'Vendor') this.menu = MENU_VENDOR;
    else if(this.role == 'Admin') this.menu = MENU_ADMIN;
  }

  navClose(){
    this.tabNav = false;
  }

  navOpen(){
    this.tabNav = true;
  }

}

export interface MENU{
  name : string;
  link : string;
};

const MENU_PUBLIC:MENU[]=[
  {
    name : 'Home',
    link : '/home'
  },
  {
    name : 'Services',
    link : '/service'
  },
  {
    name : 'About Us',
    link : '/about_us'
  }
];

const MENU_VENDOR:MENU[]=[
  {
    name : 'Home',
    link : '/home'
  },
  {
    name : 'About Us',
    link : '/about_us'
  }
]

const MENU_ADMIN:MENU[]=[
  {
    name : 'Manage User',
    link : '/manage_user'
  },
  {
    name : 'Manage Vendor',
    link : '/manage_vendor'
  },
  {
    name : 'Manage About Us',
    link : '/manage_about_us'
  }
]
