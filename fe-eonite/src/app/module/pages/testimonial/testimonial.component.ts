import { Component } from '@angular/core';
import { productReview } from '../../models/auth.model';
import { RestApiServiceService } from '../../services/rest-api-service.service';
import { HttpEventType } from '@angular/common/http';

@Component({
  selector: 'app-testimonial',
  templateUrl: './testimonial.component.html',
  styleUrls: ['./testimonial.component.css']
})
export class TestimonialComponent {
  review:productReview[]=[];
  loader:boolean=false;

  constructor(private restService:RestApiServiceService){
    this.loader=true;
    this.restService.getTop6Review().subscribe((event)=>{
      if(event.type == HttpEventType.Response && event.body && event.ok){
        let data = Object(event.body)['productReview'];
        this.review = data;
        this.loader=false;
      }
    })
  }
}
