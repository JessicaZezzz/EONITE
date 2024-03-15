import { Component } from '@angular/core';
import { RestApiServiceService } from '../../services/rest-api-service.service';
import { Category, Domicile } from '../../models/auth.model';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.css']
})
export class ServicesComponent {
  sortOpen: boolean = false;
  category : Category[] = [];
  domicile : Domicile[] = [];
  availDate : any;

  constructor(private restApi: RestApiServiceService,private datePipe: DatePipe){
    // this.restApi.getCategory().subscribe((data) => {
    //   this.category = data;
    // });
    // this.restApi.getDomicile().subscribe((data) => {
    //   this.domicile = data;
    // });
  }

  sort(){
    if(this.sortOpen == true)this.sortOpen = false;
    else this.sortOpen = true;
  }
}
