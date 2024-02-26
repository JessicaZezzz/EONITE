import { Component } from '@angular/core';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.css']
})
export class FaqComponent {
  openFaq1: boolean = false;
  openFaq2: boolean = false;
  openFaq3: boolean = false;
  openFaq4: boolean = false;
  openFaq5: boolean = false;
  openFaq6: boolean = false;

  openFaq(num : number){
    switch(num){
      case 1:{
        if(this.openFaq1 == true) this.openFaq1 = false;
        else this.openFaq1 = true;
        break;
      }
      case 2:{
        if(this.openFaq2 == true) this.openFaq2 = false;
        else this.openFaq2 = true;
        break;
      }
      case 3:{
        if(this.openFaq3 == true) this.openFaq3 = false;
        else this.openFaq3 = true;
        break;
      }
      case 4:{
        if(this.openFaq4 == true) this.openFaq4 = false;
        else this.openFaq4 = true;
        break;
      }
      case 5:{
        if(this.openFaq5 == true) this.openFaq5 = false;
        else this.openFaq5 = true;
        break;
      }
      case 6:{
        if(this.openFaq6 == true) this.openFaq6 = false;
        else this.openFaq6 = true;
        break;
      }
    }
  }
}
