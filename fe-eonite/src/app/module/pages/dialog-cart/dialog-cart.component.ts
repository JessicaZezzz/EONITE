import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Inject, OnInit, Output, ViewChild } from '@angular/core';
import { MatCalendarCellClassFunction, MatDatepicker, MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DialogSuccessComponent } from '../dialog-success/dialog-success.component';
import { RestApiServiceService } from '../../services/rest-api-service.service';
import { Product } from '../../models/auth.model';

@Component({
  selector: 'app-dialog-cart',
  templateUrl: './dialog-cart.component.html',
  styleUrls: ['./dialog-cart.component.css']
})
export class DialogCartComponent implements OnInit {
  public CLOSE_ON_SELECTED = false;
  public init = new Date();
  public resetModel = new Date(0);
  public qty = 1;
  public model:Date[] = [];
  errorDate:string='';
  errorQty:string='';
  minDate?:Date;

  @Output() openCart = new EventEmitter<boolean>();
  @ViewChild('picker', { static: true }) _picker?: MatDatepicker<Date>;
  constructor(public dialogRef: MatDialogRef<DialogCartComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Product, private router: Router,private restService:RestApiServiceService,public dialog: MatDialog) {
      this.minDate = new Date();
  }

  ngOnInit(): void {
  }


  public dateClass = (date: Date) => {
    if (this._findDate(date) !== -1) {
      return [ 'selected' ];
    }
    return [ ];
  }

  public dateChanged(event: MatDatepickerInputEvent<Date>): void {
    if (event.value) {
      const date = event.value;
      const index = this._findDate(date);
      if (index === -1) {
        this.model.push(date);
      } else {
        this.model.splice(index, 1)
      }
      this.resetModel = new Date(0);
      if (!this.CLOSE_ON_SELECTED) {
        const closeFn = this._picker!.close;
        this._picker!.close = () => { };
        this._picker!['_componentRef'].instance._calendar.monthView._createWeekCells()
        setTimeout(() => {
          this._picker!.close = closeFn;
        });
      }
    }
    if(this.model.length>=1) this.errorDate = '';
  }

  public remove(date: Date): void {
    const index = this._findDate(date);
    this.model.splice(index, 1)
  }

  private _findDate(date: Date): number {
    return this.model.map((m) => +m).indexOf(+date);
  }

  add(){
    this.qty++;
    if(this.qty>=1) this.errorQty = '';
  }

  min(){
    if(this.qty > 1){
      this.qty--; this.errorQty = '';
    }
  }

  submit(){
    this.errorDate = '';
    this.errorQty = '';
    if(this.model.length == 0) this.errorDate ='*Silakan pilih tanggal pemesanan!';
    if(this.model.length > this.data.max!) this.errorDate ='*Pilihan tanggal pemesanan tidak boleh lebih dari '+this.data.max;
    if(this.qty <=0) this.errorQty = '*Jumlah tidak boleh kurang dari 0!';
    if(this.model.length >= 1 && this.model.length <= this.data.max! && this.qty >=1){
      if(sessionStorage.getItem('ID') == null){
        this.router.navigate(['/login']);
        this.onNoClick();
      }
      else this.addToCart();
    }
  }

  addToCart(){
    let postCart:postCart={};
    postCart.userId = Number(sessionStorage.getItem('ID'));
    postCart.productId = this.data.id;
    let bookingDate:string[]=[];
      this.model.forEach(e=>{
        const dDate = new DatePipe('en-US');
        bookingDate.push(dDate.transform(new Date(e),"dd-MM-yyyy")!.toString());
      })
    postCart.bookdate = bookingDate.toString();
    postCart.quantity = this.qty;
    this.restService.addCart(JSON.stringify(postCart)).subscribe(event=>{
      if(event.statusCode == 200){
        const dialogRef = this.dialog.open(DialogSuccessComponent, {
          data: 'Berhasil menambahkan produk ke troli',
        });
        this.onNoClick();

      }else if(event.statusCode == 500){
      }
    })
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}

export interface postCart{
  userId?:number;
  productId?:number;
  bookdate?:string;
  quantity?:number;
}
