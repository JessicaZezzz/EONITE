import { Component, OnInit, ViewChild } from '@angular/core';
import {
  ApexAxisChartSeries,
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexPlotOptions,
  ApexYAxis,
  ApexLegend,
  ApexStroke,
  ApexXAxis,
  ApexFill,
  ApexTooltip
} from "ng-apexcharts";

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  fill: ApexFill;
  tooltip: ApexTooltip;
  stroke: ApexStroke;
  legend: ApexLegend;
};

@Component({
  selector: 'app-home-vendor',
  templateUrl: './home-vendor.component.html',
  styleUrls: ['./home-vendor.component.css']
})
export class HomeVendorComponent implements OnInit {
  @ViewChild("chart") chart?: ChartComponent;
  public chartOptions: Partial<ChartOptions>;
  constructor() {
    this.chartOptions = {
      series: [
        {
          name: "Waiting Confirmation",
          data: [44, 55, 57, 56, 61]
        },
        {
          name: "Waiting Payment",
          data: [44, 55, 57, 56, 61]
        },
        {
          name: "On Going",
          data: [76, 85, 101, 98, 87]
        },
        {
          name: "Completed",
          data: [35, 41, 36, 26, 45]
        },
        {
          name: "Cancelled",
          data: [76, 85, 101, 98, 87]
        }
      ],
      chart: {
        type: "bar",
        height: 350
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "55%",
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        show: true,
        width: 2,
        colors: ["transparent"]
      },
      xaxis: {
        categories: [
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
        ]
      },
      yaxis: {
        title: {
          text: "Total (orders)"
        }
      },
      fill: {
        opacity: 1
      },
      tooltip: {
        y: {
          formatter: function(val) {
            return "Total " + val + " Order";
          }
        }
      }
    };
  }
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }
}
