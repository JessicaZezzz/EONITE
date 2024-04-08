import { Component, OnInit } from '@angular/core';
import { RestApiServiceService } from '../../services/rest-api-service.service';
import { HttpEventType } from '@angular/common/http';

export const COLOR_BLUE = 'rgb(53,117,221)';
export const COLOR_PURPLE = '#5C06E4';

@Component({
  selector: 'app-home-vendor',
  templateUrl: './home-vendor.component.html',
  styleUrls: ['./home-vendor.component.css']
})
export class HomeVendorComponent implements OnInit {
  data: any;
  options: any;
  dashboarddata:dashboard={};

  constructor(private restService:RestApiServiceService){
    this.restService.getDashboard(Number(sessionStorage.getItem('ID'))).subscribe((event)=>{
      if(event.type == HttpEventType.Response && event.body && event.ok){
        let totalProduct = Object(event.body)['totalProduct'];
        this.dashboarddata!.totalProduct = totalProduct;

        let totalReview = Object(event.body)['totalReview'];
        this.dashboarddata!.totalReview = totalReview;

        let totalRequest = Object(event.body)['totalRequest'];
        this.dashboarddata!.totalRequest = totalRequest;

        let orderCancelled = Object(event.body)['orderCancelled'];
        this.dashboarddata!.orderCancelled = orderCancelled;

        let orderCompleted = Object(event.body)['orderCompleted'];
        this.dashboarddata!.orderCompleted = orderCompleted;
        console.log(this.dashboarddata.orderCancelled)
        this.setDashboard();
      }
    })
  }

  ngOnInit() {

  }

  setDashboard(){
    const documentStyle = getComputedStyle(document.documentElement);
      const textColor = COLOR_PURPLE;
      const textColorSecondary = COLOR_BLUE;
      const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

      this.data = {
          labels: ['January', 'February', 'March', 'April', 'May', 'June'],
          datasets: [
              {
                  label: 'Completed Order',
                  data: this.dashboarddata.orderCompleted,
                  fill: false,
                  borderColor: COLOR_BLUE,
                  tension: 0.4
              },
              {
                  label: 'Cancelled Order',
                  data: this.dashboarddata.orderCancelled,
                  fill: false,
                  borderColor: COLOR_PURPLE,
                  tension: 0.4
              }
          ]
      };

      this.options = {
          maintainAspectRatio: false,
          aspectRatio: 0.6,
          plugins: {
              legend: {
                  labels: {
                      color: textColor
                  }
              }
          },
          scales: {
              x: {
                  ticks: {
                      color: textColorSecondary
                  },
                  grid: {
                      color: surfaceBorder,
                      drawBorder: false
                  }
              },
              y: {
                  ticks: {
                      color: textColorSecondary
                  },
                  grid: {
                      color: surfaceBorder,
                      drawBorder: false
                  }
              }
          }
      };
  }
}

export interface dashboard{
  totalProduct?:number;
  totalReview?:number;
  totalRequest?:number;
  orderCancelled?:number;
  orderCompleted?:number;
}
