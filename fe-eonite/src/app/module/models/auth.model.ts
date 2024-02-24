export interface MENU{
  name : string;
  link : string;
};

export const MENU_PUBLIC:MENU[]=[
  {
    name : 'Home',
    link : '/home'
  },
  {
    name : 'Services',
    link : '/services'
  },
  {
    name : 'About Us',
    link : '/about_us'
  }
];

export const MENU_VENDOR:MENU[]=[
  {
    name : 'Home',
    link : '/home'
  },
  {
    name : 'About Us',
    link : '/about_us'
  }
]

export const MENU_ADMIN:MENU[]=[
  {
    name : 'Manage User',
    link : '/manage_user'
  },
  {
    name : 'Manage Vendor',
    link : '/manage_vendor'
  },
  {
    name : 'Manage About Us',
    link : '/manage_about_us'
  }
]
