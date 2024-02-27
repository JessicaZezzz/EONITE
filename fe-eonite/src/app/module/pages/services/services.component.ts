import { Component } from '@angular/core';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.css']
})
export class ServicesComponent {
  sortOpen: boolean = false;

  sort(){
    if(this.sortOpen == true)this.sortOpen = false;
    else this.sortOpen = true;
  }
}
