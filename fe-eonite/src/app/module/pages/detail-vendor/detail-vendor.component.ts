import { Component, OnInit, HostListener } from '@angular/core';

@Component({
  selector: 'app-detail-vendor',
  templateUrl: './detail-vendor.component.html',
  styleUrls: ['./detail-vendor.component.css']
})
export class DetailVendorComponent implements OnInit {
  tabActive: boolean = true;
  show:boolean = false;
  constructor() { }

  ngOnInit(): void {
  }

  myFilter = (d: Date): boolean => {
    const testDates: Date[] = [
       new Date('2024-03-30T00:00'),
       new Date('2024-03-28T00:00'),
       new Date('2024-03-21T00:00'),
       new Date('2024-03-23T00:00')
     ];
     return testDates.findIndex(testDate => d.toDateString() === testDate.toDateString()) <= 0;
  }

  clickit(){
    this.show = !this.show;
  }
}
