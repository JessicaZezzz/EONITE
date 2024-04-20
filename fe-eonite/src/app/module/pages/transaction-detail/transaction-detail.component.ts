import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RestApiServiceService } from '../../services/rest-api-service.service';
import { HttpEventType } from '@angular/common/http';
import { Transaction, TransDet } from '../../models/auth.model';
import { DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { DialogCancelTransactionComponent } from '../dialog-cancel-transaction/dialog-cancel-transaction.component';
import { DialogSuccessComponent } from '../dialog-success/dialog-success.component';
import { DialogReviewComponent } from '../dialog-review/dialog-review.component';

@Component({
  selector: 'app-transaction-detail',
  templateUrl: './transaction-detail.component.html',
  styleUrls: ['./transaction-detail.component.css']
})
export class TransactionDetailComponent implements OnInit {
  Form!: FormGroup;
  payments: any;
  urlImage?:any;
  openDialogErrorDiv: boolean = false;
  error:string='';
  list?: Transaction;
  bankAccount?: string;
  bankName?:string;
  bankType?:string;
  loader:boolean=false;
  rejectedBY?:string;
  alasanreject?:string;
  constructor(private datePipe:DatePipe,private route: ActivatedRoute,private routes:Router,private restService:RestApiServiceService,private dialog:MatDialog) {
    this.getData(this.route.snapshot.params['id']);
  }

  ngOnInit(): void {
    this.Form = new FormGroup({
      name: new FormControl(this.bankName, [
        Validators.required,
      ]),
      nomor: new FormControl(this.bankAccount, [
        Validators.required,
      ]),
      bank: new FormControl(this.bankType, [
        Validators.required,
      ]),
      payment: new FormControl(this.payments, [
        Validators.required,
      ])
    });
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
        if(this.list?.payment.state != 'NONE'){
          this.urlImage = 'data:image/jpg;base64,'+this.list?.payment.image;
          this.Form.get('payment')!.setValue(this.urlImage);
          this.Form.get('name')!.setValue(this.list?.payment.bankName);
          this.Form.get('nomor')!.setValue(this.list?.payment.bankAccount);
          this.Form.get('bank')!.setValue(this.list?.payment.bankType);
        }
      }
    })
  }

  get name() {
    return this.Form.get('name')!;
  }

  get nomor() {
    return this.Form.get('nomor')!;
  }

  get bank() {
    return this.Form.get('bank')!;
  }

  get payment() {
    return this.Form.get('payment')!;
  }

  deletePhoto(){
    this.urlImage = null;
    this.Form.get('payment')!.setValue(null);
  }

  onFileChanged(event:any) {
    let reader = new FileReader();
    if(event.target.files && event.target.files.length > 0) {
      let file = event.target.files[0];
      if(file.size > 5000000){
        this.openDialogErrorDiv = true;
        this.error='Foto melebihi ukuran file maksimum. Silakan unggah foto <= 5 MB'
        this.deletePhoto();
      }else{
        reader.readAsDataURL(file);
        reader.onload = () => {
          this.urlImage = reader.result;
      }
      };
    }
  }

  changeDate(date:string){
    return this.datePipe.transform(date, 'dd MMMM YYYY HH:mm') || '';
  }

  check(text:string){
    if(text=='' || text==null) return '-';
    else return text;
  }

  back(){
    this.routes.navigate([`/transaction`])
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

  onSubmit(){
    if (this.Form.invalid) {
      for (const control of Object.keys(this.Form.controls)) {
        this.Form.controls[control].markAsTouched();
      }
    }else this.updatePayment();
  }

  updatePayment(){
    this.loader = true;
    let postTrans :uploadPayment={};
    postTrans.transId = this.list?.id;
    postTrans.bankAccount = this.Form.value.nomor;
    postTrans.bankName = this.Form.value.name;
    postTrans.bankType = this.Form.value.bank;
    let img = this.urlImage!.split(',')[1];
    postTrans.image = img;
    this.restService.updatePayment(JSON.stringify(postTrans)).subscribe(event => {
      if(event.statusCode == 200){
        this.loader=false;
        const dialogRef = this.dialog.open(DialogSuccessComponent, {
          data: 'Transaksi berhasil diperbarui',
        });
        this.back();
      }else if(event.statusCode == 500){
      }
    })
  }

  review(element:TransDet,state:string){
    let review:reviewProduct={};
    review.state = state;
    review.transaction_detail_id = element.id;
    review.product_id = element.product?.id;
    review.user_id = Number(sessionStorage.getItem('ID'));
    if(element.productReview == null){
      review.rating=0;
      review.review='';
    }else{
      review.id = element.productReview.id;
      review.rating=element.productReview.rating;
      review.review=element.productReview.review;
    }

    const dialogRef = this.dialog.open(DialogReviewComponent, {
      data: review
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result) window.location.reload();
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

export interface uploadPayment{
  transId?:number;
  bankAccount?:string;
  bankName?:string;
  bankType?:string;
  image?:any;
}

export interface reviewProduct{
    state?:string;
    transaction_detail_id?:number;
    id?:number;
    rating?:number;
    review?:string;
    user_id?:number;
    product_id?:number;
}
