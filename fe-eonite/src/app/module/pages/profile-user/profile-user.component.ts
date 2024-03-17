import { Component, OnInit } from '@angular/core';
import { RestApiServiceService } from '../../services/rest-api-service.service';
import { Router } from '@angular/router';

import { FormControl, FormGroup, Validators } from '@angular/forms';
import { emailValidator } from '../../services/email-validator.directive';
import { User } from '../../models/auth.model';

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

  constructor(private restService: RestApiServiceService, private router: Router) {
    this.user = {} as User;
  }

  ngOnInit(): void {
    this.reactiveForm = new FormGroup({
      firstName: new FormControl(this.user?.first_name, [
        Validators.required,
      ]),
      lastName: new FormControl(this.user?.last_name, [
        Validators.required,
      ]),
      birthDate: new FormControl(this.user?.birth_date, [
        Validators.required,
      ]),
      phoneNumber: new FormControl(this.user?.phone_number, [
        Validators.required,
        Validators.pattern("^[0-9]*$"),
        Validators.minLength(10)
      ]),
      email: new FormControl(this.user?.email, [
        Validators.required,
        emailValidator(),
      ])
    });
  }

  get firstName() {
    return this.reactiveForm.get('firstName')!;
  }

  get lastName() {
    return this.reactiveForm.get('lastName')!;
  }

  get birthDate() {
    return this.reactiveForm.get('birthDate')!;
  }

  get phoneNumber() {
    return this.reactiveForm.get('phoneNumber')!;
  }

  get email() {
    return this.reactiveForm.get('email')!;
  }
}
