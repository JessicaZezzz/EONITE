import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-admin',
  templateUrl: './home-admin.component.html',
  styleUrls: ['./home-admin.component.css']
})
export class HomeAdminComponent implements OnInit {

  tabmanagevendor:boolean=true;
  tabmanagetransaction:boolean=false;

  constructor(private router:Router) {
    
  }

  ngOnInit(): void {
    if(sessionStorage.getItem('tab') == "managevendor"){
      this.tabmanagevendor = true;
      this.tabmanagetransaction=false;
    }else{
      this.tabmanagetransaction = true;
      this.tabmanagevendor=false;
    }
  }

  tabManageV(){
    sessionStorage.setItem('tab',"managevendor")
    this.tabmanagevendor = true;
    this.tabmanagetransaction=false;
  }

  tabManageT(){
    sessionStorage.setItem('tab',"managetransaction")
    this.tabmanagetransaction = true;
    this.tabmanagevendor=false;
  }

  logout(){
    sessionStorage.clear();
    this.router.navigate(['/logout']);
  }

}
