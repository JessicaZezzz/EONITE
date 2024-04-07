import { DialogChangePasswordComponent } from './../dialog-change-password/dialog-change-password.component';
import { Component, OnInit } from '@angular/core';
import { RestApiServiceService } from '../../services/rest-api-service.service';
import { Router } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { User } from '../../models/auth.model';
import { HttpEventType } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { EditProfileUserComponent } from '../edit-profile-user/edit-profile-user.component';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-profile-user',
  templateUrl: './profile-user.component.html',
  styleUrls: ['./profile-user.component.css']
})
export class ProfileUserComponent implements OnInit {
  reactiveForm!: FormGroup;
  user?:User;
  confPassword?:string;
  openDialogErrorDiv: boolean = false;
  openDialogSuccessDiv: boolean = false;
  urlImage?:any;

  constructor(private restService: RestApiServiceService, private router: Router,public dialog: MatDialog,private datePipe:DatePipe) {
    this.user = {} as User;
  }

  ngOnInit(): void {
    this.getDataProfile();
  }

  getDataProfile(){
    this.restService.getprofileUser(Number(sessionStorage.getItem('ID'))).subscribe((event)=>{
      if(event.type == HttpEventType.Response && event.body && event.ok){
        let data = Object(event.body)['users'];
        this.user = data[0];
        this.urlImage = 'data:image/jpeg;base64,'+this.user?.photo;
      }
    })
  }

  changeDate(date:string){
    return this.datePipe.transform(date, 'DD MMMM YYYY') || '';
  }

  changePassword(role:string){
    const dialogRef = this.dialog.open(DialogChangePasswordComponent, {
      data: role,
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  editProfile(){
    const dialogRef = this.dialog.open(EditProfileUserComponent, {
      data: '',
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getDataProfile();
    });
  }

}
