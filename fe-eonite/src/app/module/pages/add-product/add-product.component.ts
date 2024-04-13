import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { RestApiServiceService } from '../../services/rest-api-service.service';
import { Category, Product } from '../../models/auth.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DialogSuccessComponent } from '../dialog-success/dialog-success.component';
import { HttpEventType } from '@angular/common/http';

export interface category{
  id?:number;
  subcategory:subcategory;
}

export interface subcategory{
  id?:number;
  name?:string;
}

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent implements OnInit {
  product:Product={
    photo: []
  };
  imagePreview=""
  imageError: string = '';
  isImageSaved?: boolean;
  cardImageBase64?: string;
  rawFileArray:string[] = [];
  base64ImgArray:string[] = [];
  Form1!: FormGroup;
  category : category[] = [];

  constructor(public dialogRef: MatDialogRef<AddProductComponent>,
    @Inject(MAT_DIALOG_DATA) public data: number,private restService:RestApiServiceService,public dialog: MatDialog) { }

  ngOnInit(): void {
    this.restService.getprofileVendor(Number(sessionStorage.getItem('ID'))).subscribe((event)=>{
      if(event.type == HttpEventType.Response && event.body && event.ok){
        let data = Object(event.body)['vendor'];
        this.category = data[0].categoryVendors;
      }
    })
    this.Form1 = new FormGroup({
      name: new FormControl(this.product?.name, [
        Validators.required,
      ]),
      price: new FormControl(this.product?.price, [
        Validators.required,
      ]),
      capacity: new FormControl(this.product?.capacity, [
        Validators.required,
      ]),
      max: new FormControl(this.product?.max, [
        Validators.required,
      ]),
      categoryid: new FormControl(this.product?.categoryid, [
        Validators.required,
      ]),
      description: new FormControl(this.product?.description, [
        Validators.required,
      ]),
    });
  }

  get name() {
    return this.Form1.get('name')!;
  }

  get price() {
    return this.Form1.get('price')!;
  }

  get capacity() {
    return this.Form1.get('capacity')!;
  }

  get max() {
    return this.Form1.get('max')!;
  }

  get categoryid() {
    return this.Form1.get('categoryid')!;
  }

  get description() {
    return this.Form1.get('description')!;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onImagePicked(fileInput:any) {
    this.imageError = '';
    if (fileInput.target.files && fileInput.target.files[0] && this.rawFileArray.indexOf(fileInput.target.files[0])==-1) {
      // Size Filter Bytes
      this.rawFileArray.push(fileInput.target.files[0]);
      const max_size = 10000000;
      const allowed_types = ['image/png', 'image/jpeg', 'image/jpg'];
      const max_height = 15200;
      const max_width = 25600;

      if (fileInput.target.files[0].size > max_size) {
        this.imageError = 'Ukuran maksimum yang diperbolehkan adalah ' + max_size / 1000 + 'Mb';

        return false;
      }
      const reader = new FileReader();
      reader.onload = (e: any) => {
        let image = new Image();
        image.src = e.target.result;
        image.onload = (rs:any) => {
          const img_height = rs.currentTarget['height'];
          const img_width = rs.currentTarget['width'];

          console.log(img_height, img_width);

          if (img_height > max_height && img_width > max_width) {
            this.imageError =
              'Dimensi maksimum diperbolehkan ' +
              max_height +
              '*' +
              max_width +
              'px';
            return false;
          } else {
            if(img_width - img_height <=400){
              this.imageError='';
              let imgBase64Path = e.target.result;
              this.cardImageBase64 = imgBase64Path;
              this.isImageSaved = true;
              this.base64ImgArray.push(imgBase64Path);
            }else{
              this.imageError =
              'Dimensi gambar terlalu lebar/tinggi';
              return false;
            }
            // this.previewImagePath = imgBase64Path;
          }
          return;
        };
      };

      reader.readAsDataURL(fileInput.target.files[0]);
    }
    return;
  }

  removeImage(index:any){
    this.rawFileArray.splice(index,1);
    this.base64ImgArray.splice(index,1)
  }

  onSubmit(){
    if (this.Form1.invalid) {
      for (const control of Object.keys(this.Form1.controls)) {
        this.Form1.controls[control].markAsTouched();
      }
    }else this.addProduct();
  }

  addProduct(){
    let postProduct : any = {};
      postProduct.vendorId = sessionStorage.getItem('ID');
      postProduct.name = this.Form1.value.name;
      postProduct.price = this.Form1.value.price;
      postProduct.max = this.Form1.value.max;
      postProduct.capacity = this.Form1.value.capacity;
      postProduct.categoryid = this.Form1.value.categoryid;
      postProduct.description = this.Form1.value.description;
    let photo:string[]=[];
      this.base64ImgArray.forEach(e=>{
        let img = e.split(',')[1];
        photo.push(img)
      })
      postProduct.photo = photo;
    this.restService.addProduct(JSON.stringify(postProduct)).subscribe(event=>{
      if(event.statusCode == 200){
        const dialogRef = this.dialog.open(DialogSuccessComponent, {
          data: 'Berhasil menambahkan produk baru',
        });
        this.onNoClick();
      }else if(event.statusCode == 500){

      }
    })
  }
}
