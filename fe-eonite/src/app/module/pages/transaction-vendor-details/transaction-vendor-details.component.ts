import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RestApiServiceService } from '../../services/rest-api-service.service';
import { HttpEventType } from '@angular/common/http';
import { Transaction } from '../../models/auth.model';
import * as moment from 'moment';
import { DialogCancelTransactionComponent } from '../dialog-cancel-transaction/dialog-cancel-transaction.component';
import { MatDialog } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-transaction-vendor-details',
  templateUrl: './transaction-vendor-details.component.html',
  styleUrls: ['./transaction-vendor-details.component.css']
})
export class TransactionVendorDetailsComponent implements OnInit {
  Form!: FormGroup;
  payments: any;
  urlImage?:any;
  openDialogErrorDiv: boolean = false;
  error:string='';
  starRating:number = 0;
  list?: Transaction;
  loader:boolean=false;
  rejectedBY?:string;
  alasanreject?:string;
  constructor(private dialog:MatDialog,private route: ActivatedRoute,private datePipe: DatePipe,private routes:Router,private restService:RestApiServiceService) {
    this.getData(this.route.snapshot.params['id']);
  }

  ngOnInit(): void {
  }

  getData(id:number): void {
    this.loader=true;
    this.restService.getDetailTransaction(id).subscribe((event)=>{
      if(event.type == HttpEventType.Response && event.body && event.ok){
        let data = Object(event.body)['transaction'];
        this.list=data;
        let fund = Object(event.body)['fund'];
        if(fund.length>0){
          this.rejectedBY=fund[0].rejectedBy;
          this.alasanreject = fund[0].alasanRejected;
        }
        this.loader=false;
      }
    })
  }

  changeDate(date:string){
    return this.datePipe.transform(date, 'dd MMMM YYYY HH:mm') || '';
  }

  check(text:string){
    if(text=='' || text==null) return '-';
    else return text;
  }

  back(){
    this.routes.navigate([`/transaction-vendor`])
  }

  changeFormatDate(dtae:string){
    let dt = dtae.split(',');
    let dates:string[]=[];
    if(dtae != null){
      for(let i of dt){
        var year = i.substring(6, 10);
        var month = i.substring(3, 5);
        var day = i.substring(0, 2);
        var datePipe = new DatePipe("en-US");
        dates.push(datePipe.transform(new Date(parseInt(year),parseInt(month)-1,parseInt(day)),"dd MMMM YYYY")!)
      }
      return dates.toString();
    }else return '-';
  }

  submitState(action:string, state:string,quest:string){
    let postTrans :postTransaction={};
    postTrans.id = this.list?.id;
    postTrans.prevState = state;
    postTrans.action = action;
    postTrans.quest = quest;
    const dialogRef = this.dialog.open(DialogCancelTransactionComponent, {
      data: postTrans,
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result == true) this.back();
    });
  }

}

export interface postTransaction{
  id?:number;
  prevState?:string;
  action?:string;
  description?:string;
  quest?:string;
}
