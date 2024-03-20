import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AngularEditorConfig } from '@kolkov/angular-editor';

export const StrongPasswordRegx: RegExp = /^(?=[^A-Z]*[A-Z])(?=[^a-z]*[a-z])(?=\D*\d).{8,}$/;

@Component({
  selector: 'app-edit-profile-vendor',
  templateUrl: './edit-profile-vendor.component.html',
  styleUrls: ['./edit-profile-vendor.component.css']
})
export class EditProfileVendorComponent implements OnInit {
  Form1!: FormGroup;
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

  constructor() { }

  ngOnInit(): void {
    // this.Form1 = new FormGroup({
    //   firstName: new FormControl(this.vendor?.firstName, [
    //     Validators.required,
    //   ]),
    //   lastName: new FormControl(this.vendor?.lastName, [
    //     Validators.required,
    //   ]),
    //   birthDate: new FormControl(this.vendor?.birthDate, [
    //     Validators.required,
    //   ]),
    //   phoneNumber: new FormControl(this.vendor?.phoneNumber, [
    //     Validators.required,
    //     Validators.pattern("^[0-9]*$"),
    //     Validators.minLength(10)
    //   ]),
    //   email: new FormControl(this.vendor?.email, [
    //     Validators.required,
    //     emailValidator(),
    //   ]),
    // },{
    //   validators: passwordConfirmationValidator('password', 'confirmPassword')
    // });
  }

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
