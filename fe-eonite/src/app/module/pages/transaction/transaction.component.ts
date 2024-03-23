import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.css']
})
export class TransactionComponent implements OnInit {

  pages: number = 1;
  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  redirectDetail(){
    this.router.navigate(['transaction-details', 1]);
  }
}
