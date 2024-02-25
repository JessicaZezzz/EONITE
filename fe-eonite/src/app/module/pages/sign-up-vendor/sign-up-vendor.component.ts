import { Component } from '@angular/core';

@Component({
  selector: 'app-sign-up-vendor',
  templateUrl: './sign-up-vendor.component.html',
  styleUrls: ['./sign-up-vendor.component.css']
})
export class SignUpVendorComponent {
  phase:number = 1;

  nextPhase(form: number){
    switch (form){
      case 1:{
        //checkForm
        this.phase = 2;
        break;
      }
      case 2:{

        this.phase = 3;
        break;
      }
      case 3:{
        //submit Form
        break;
      }
    }


  }
}
