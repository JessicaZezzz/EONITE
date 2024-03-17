import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

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
  starRating:number = 0;
  constructor() { }

  ngOnInit(): void {
    this.Form = new FormGroup({
      payment: new FormControl(this.payments, [
        Validators.required,
      ])
    });
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
        this.error='The photo exceeding the maximum file size. Please upload photo <= 5 MB'
        this.deletePhoto();
      }else{
        reader.readAsDataURL(file);
        reader.onload = () => {
          this.urlImage = reader.result;
      }
      };
    }
  }

}
