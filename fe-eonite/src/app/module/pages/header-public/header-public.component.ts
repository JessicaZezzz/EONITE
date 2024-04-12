import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Slick } from 'ngx-slickjs';

@Component({
  selector: 'app-header-public',
  templateUrl: './header-public.component.html',
  styleUrls: ['./header-public.component.css']
})
export class HeaderPublicComponent {
  image:any[]=[
    {
      id:75,
      title:'Wedding Organizer',
      images:'../assets/icon/wedding-organizer.jpg'
    },
    {
      id:76,
      title:'Birthday Party Organizer',
      images:'../assets/icon/birthdays.jpg'
    },
    {
      id:77,
      title:'Gathering/Outbound',
      images:'../assets/icon/gathering.png'
    },
    {
      id:78,
      title:'Seminar/Conference',
      images:'../assets/icon/seminar.png'
    },
    {
      id:74,
      title:'Holiday/Travel',
      images:'../assets/icon/holiday.png'
    },
    {
      id:69,
      title:'Concert',
      images:'../assets/icon/concert.png'
    },
    {
      id:68,
      title:'Exhibition',
      images:'../assets/icon/eksbisi.png'
    },
    {
      id:82,
      title:'Graduation',
      images:'../assets/icon/graduation.jpg'
    }
  ];

  config: Slick.Config = {
      infinite: true,
      slidesToShow: 3,
      slidesToScroll: 2,
      dots: true,
      autoplay: true,
      autoplaySpeed: 3000,
      responsive: [
        {
          breakpoint: 768,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 2
          }
        },
        {
          breakpoint: 480,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1
          }
        }
      ]
  }

  constructor(private router:Router){

  }

  ngOnInit(){

  }

  callService(item:any){
    const params = {
      category: item.id
    }
    this.router.navigate(['/services-vendor'],{queryParams:params})
  }
}
