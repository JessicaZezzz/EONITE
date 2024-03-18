import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-add-edit-product',
  templateUrl: './add-edit-product.component.html',
  styleUrls: ['./add-edit-product.component.css']
})
export class AddEditProductComponent implements OnInit {
  imagePreview=""

  imageError!: string;
  isImageSaved?: boolean;
  cardImageBase64?: string;
  rawFileArray:string[] = [];
  base64ImgArray:string[] = [];

  constructor() {}

  ngOnInit() {}

  onImagePicked(fileInput:any) {
    this.imageError = '';
    if (fileInput.target.files && fileInput.target.files[0] && this.rawFileArray.indexOf(fileInput.target.files[0])==-1) {
      // Size Filter Bytes
      this.rawFileArray.push(fileInput.target.files[0]);
      const max_size = 20971520;
      const allowed_types = ['image/png', 'image/jpeg'];
      const max_height = 15200;
      const max_width = 25600;

      if (fileInput.target.files[0].size > max_size) {
        this.imageError = 'Maximum size allowed is ' + max_size / 1000 + 'Mb';

        return false;
      }

      // if (!_.includes(allowed_types, fileInput.target.files[0].type)) {
      //     this.imageError = 'Only Images are allowed ( JPG | PNG )';
      //     return false;
      // }
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
              'Maximum dimentions allowed ' +
              max_height +
              '*' +
              max_width +
              'px';
            return false;
          } else {
            let imgBase64Path = e.target.result;
            this.cardImageBase64 = imgBase64Path;
            this.isImageSaved = true;
            this.base64ImgArray.push(imgBase64Path);
            // this.previewImagePath = imgBase64Path;
          }
          return;
        };
      };

      reader.readAsDataURL(fileInput.target.files[0]);
    }
    return;
    // console.log(this.rawFileArray)
  }
  removeImage(index:any){
    this.rawFileArray.splice(index,1);
    this.base64ImgArray.splice(index,1)
  }
}
