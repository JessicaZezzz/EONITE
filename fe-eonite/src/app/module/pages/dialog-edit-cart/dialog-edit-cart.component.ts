import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Inject, OnInit, Output, ViewChild } from '@angular/core';
import { MatDatepicker, MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DialogSuccessComponent } from '../dialog-success/dialog-success.component';
import { RestApiServiceService } from '../../services/rest-api-service.service';

@Component({
  selector: 'app-dialog-edit-cart',
  templateUrl: './dialog-edit-cart.component.html',
  styleUrls: ['./dialog-edit-cart.component.css']
})
export class DialogEditCartComponent implements OnInit {
  public CLOSE_ON_SELECTED = false;
  public init = new Date();
  public resetModel = new Date(0);
  public display = false;
  public model :Date[]=[];
  errorDate:string='';
  errorQty:string='';
  minDate?:Date;
  @Output() openCart = new EventEmitter<boolean>();
  @ViewChild('picker', { static: true }) _picker?: MatDatepicker<Date>;

  constructor(public dialogRef: MatDialogRef<DialogEditCartComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,private dialog:MatDialog, private restService:RestApiServiceService) {
      this.minDate = new Date();
  }

  ngOnInit(): void {
    this.changeFormatDate(this.data.bookdate);
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

  formatPrice(number:string){
    return number.substring(2);
  }

  changeFormatDate(dtae:string){
    let dt = dtae.split(',');
    if(dtae != null){
      for(let i of dt){
        var year = i.substring(6, 10);
        var month = i.substring(3, 5);
        var day = i.substring(0, 2);
        var datePipe = new DatePipe("en-US");
        this.model.push(new Date(parseInt(year),parseInt(month)-1,parseInt(day)));
      }
    }
 }

  add(){
    this.data.quantity++;
    if(this.data.quantity>=1) this.errorQty = '';
  }

  min(){
    if(this.data.quantity > 1){
      this.data.quantity--; this.errorQty = '';
    }
  }

  close(){
    this.openCart.emit(false);
  }

  submit(){
    this.errorDate = '';
    this.errorQty = '';
    if(this.model.length == 0) this.errorDate ='*Silakan pilih tanggal pemesanan!';
    if(this.model.length > this.data.productMax!) this.errorDate ='*Pilihan tanggal pemesanan tidak boleh lebih dari '+this.data.productMax;
    if(this.data.quantity <= 0) this.errorQty = '*Jumlah tidak boleh kurang dari 0!';
    if(this.model.length >= 1 && this.model.length <= this.data.productMax! && this.data.quantity >=1){
       this.updateCart();
    }
  }

  updateCart(){
    let postCart:postCart={};
    postCart.id = this.data.id;
    let bookingDate:string[]=[];
      this.model.forEach(e=>{
        const dDate = new DatePipe('en-US');
        bookingDate.push(dDate.transform(new Date(e),"dd-MM-yyyy")!.toString());
      })
    postCart.bookdate = bookingDate.toString();
    postCart.quantity = this.data.quantity;
    this.restService.updateCart(JSON.stringify(postCart)).subscribe(event=>{
      if(event.statusCode == 200){
        const dialogRef = this.dialog.open(DialogSuccessComponent, {
          data: 'Produk berhasil diperbarui di keranjang',
        });
        this.dialogRef.close(true);

      }else if(event.statusCode == 500){
      }
    })
  }

  onNoClick(): void {
    this.dialogRef.close(false);
  }
}

export interface postCart{
  id?:number;
  bookdate?:string;
  quantity?:number;
}
