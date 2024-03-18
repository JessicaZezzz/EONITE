import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { passwordConfirmationValidator } from '../../services/confirm-password';
import { Vendor } from '../../models/auth.model';
import { emailValidator } from '../../services/email-validator.directive';
import { AngularEditorConfig } from '@kolkov/angular-editor';

export const StrongPasswordRegx: RegExp = /^(?=[^A-Z]*[A-Z])(?=[^a-z]*[a-z])(?=\D*\d).{8,}$/;

@Component({
  selector: 'app-profile-vendor',
  templateUrl: './profile-vendor.component.html',
  styleUrls: ['./profile-vendor.component.css']
})
export class ProfileVendorComponent implements OnInit {
  Form1!: FormGroup;
  vendor?:Vendor;

  constructor() { }

  ngOnInit(): void {
    this.Form1 = new FormGroup({
      firstName: new FormControl(this.vendor?.first_name, [
        Validators.required,
      ]),
      lastName: new FormControl(this.vendor?.last_name, [
        Validators.required,
      ]),
      birthDate: new FormControl(this.vendor?.birth_date, [
        Validators.required,
      ]),
      phoneNumber: new FormControl(this.vendor?.phone_number, [
        Validators.required,
        Validators.pattern("^[0-9]*$"),
        Validators.minLength(10)
      ]),
      email: new FormControl(this.vendor?.email, [
        Validators.required,
        emailValidator(),
      ]),
    },{
      validators: passwordConfirmationValidator('password', 'confirmPassword')
    });
  }

  config: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    minHeight: '20rem',
    maxHeight: '20rem',
    placeholder: 'Enter text here...',
    translate: 'no',
    sanitize: false,
    toolbarPosition: 'top',
    defaultFontName: 'Arial',
    toolbarHiddenButtons: [
      [
        'subscript',
        'superscript',
      ],
      [
        'link',
        'unlink',
        'insertImage',
        'insertVideo',
      ]
    ],
    customClasses: [
      {
        name: 'quote',
        class: 'quote',
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: 'titleText',
        class: 'titleText',
        tag: 'h1',
      },
    ]
  };

  get firstName() {
    return this.Form1.get('firstName')!;
  }

  get lastName() {
    return this.Form1.get('lastName')!;
  }

  get birthDate() {
    return this.Form1.get('birthDate')!;
  }

  get phoneNumber() {
    return this.Form1.get('phoneNumber')!;
  }

  get email() {
    return this.Form1.get('email')!;
  }

}

