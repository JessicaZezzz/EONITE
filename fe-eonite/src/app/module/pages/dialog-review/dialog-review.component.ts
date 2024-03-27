import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { RestApiServiceService } from '../../services/rest-api-service.service';
import { DialogSuccessComponent } from '../dialog-success/dialog-success.component';

@Component({
  selector: 'app-dialog-review',
  templateUrl: './dialog-review.component.html',
  styleUrls: ['./dialog-review.component.css']
})
export class DialogReviewComponent implements OnInit {
  starRating:number = 0;
  comment:string='';
  error:boolean = false;
  constructor(public dialogRef: MatDialogRef<DialogReviewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: reviewProduct, private restService:RestApiServiceService,private dialog:MatDialog) { }

  ngOnInit(): void {
    this.starRating = this.data.rating!;
    this.comment = this.data.review!;
  }

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  submit(){
    if(this.starRating == 0 || this.comment == '') this.error=true;
    else this.postReview();
  }

  postReview(){
    if(this.data.state == 'UPDATE'){
      let review:any={
        id:this.data.id,
        rating:this.starRating,
        review:this.comment,
        product_id:this.data.product_id
      }
      this.restService.updateReview(JSON.stringify(review)).subscribe(event => {
        if(event.statusCode == 200){
          const dialogRef = this.dialog.open(DialogSuccessComponent, {
            data: 'Review successfully updated',
          });
          this.dialogRef.close(true);

        }else if(event.statusCode == 500){
        }
      })
    }else if(this.data.state == 'ADD'){
      let review:any={
        transaction_detail_id:this.data.transaction_detail_id,
        rating:this.starRating,
        review:this.comment,
        user_id:this.data.user_id,
        product_id:this.data.product_id
      }
      this.restService.addReview(JSON.stringify(review)).subscribe(event => {
        if(event.statusCode == 200){
          const dialogRef = this.dialog.open(DialogSuccessComponent, {
            data: 'Review added successfully',
          });
          this.dialogRef.close(true);

        }else if(event.statusCode == 500){
        }
      })
    }
  }

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
