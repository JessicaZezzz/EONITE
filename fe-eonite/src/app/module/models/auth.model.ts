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
    link : '/about-us'
  }
];

export const MENU_VENDOR:MENU[]=[
  {
    name : 'Dashboard',
    link : '/dashboard'
  },
  {
    name : 'About Us',
    link : '/about-us'
  }
];

export const DROPDOWN_USER:MENU[]=[
  {
    name : 'Profile',
    link : '/profile-user'
  },
  {
    name : 'Chat',
    link : '/chat'
  },
  {
    name : 'Cart',
    link : '/cart'
  },
  {
    name : 'Transaction',
    link : '/transaction'
  },
  {
    name : 'Logout',
    link : '/logout'
  }
];

export const DROPDOWN_VENDOR:MENU[]=[
  {
    name : 'Profile',
    link : '/profile-vendor'
  },
  {
    name : 'Chat',
    link : '/chat'
  },
  {
    name : 'Product',
    link : '/product'
  },
  {
    name : 'Transaction',
    link : '/transaction'
  },
  {
    name : 'Logout',
    link : '/logout'
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
  }
]

export class Category{
  id?: String;
  name?: String;
}

export class Domicile{
  id?: String;
  name?: String;
}

export class User{
  first_name?  :string;
  last_name?   :string;
  birth_date?  :Date | any;
  phone_number?:string;
  photo_id?    :number;
  email?       :string;
  password?    :string;
  role?        :string;
}

export class Vendor{
  role?         :string;
  category_id?  :number;
  domicile_id?  :number;
  first_name?   :string;
  last_name?    :string;
  birth_date?   :string;
  phone_number? :string;
  phone_business?:string;
  address?      :string;
  photo_identity?:any;
  photo_id?     :number;
  status?       :string;
  startTime?    :string;
  endTime?      :string;
  email?        :string;
  password?     :string;
}
