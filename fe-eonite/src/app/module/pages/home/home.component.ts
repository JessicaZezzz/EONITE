import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  role:string='';
  constructor(private router:Router){
    this.role = sessionStorage.getItem('AUTH')!;
    if(this.role == 'ADMIN') this.router.navigate(['/home-admin']);
  }
}
