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
    name : 'Vendor',
    link : '/services-vendor'
  },
  {
    name : 'Product',
    link : '/services-product'
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
    name : 'Product',
    link : '/product-vendor'
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

export const DROPDOWN_ADMIN:MENU[]=[
  {
    name : 'Profile',
    link : '/profile-vendor'
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
  id?: string;
  name: string='';
  subCategories?:Category[];
}

export class Domicile{
  id?: string;
  name?: string;
}

export class User{
  id?         :number;
  firstName?  :string;
  lastName?   :string;
  birthDate?  :Date | any;
  phoneNumber?:string;
  photo?      :any;
  email?      :string;
  password?   :string;
  role?       :string;
}

export class Vendor{
  id?             :number;
  role?           :string;
  subCategory?    :number[];
  domicile_id?    :number;
  firstName?      :string;
  lastName?       :string;
  birthDate?      :string;
  phoneNumber?    :string;
  phoneBusiness?  :string;
  address?        :string;
  photo_identity? :any;
  photo?          :any;
  status?         :string;
  startTime?      :string;
  endTime?        :string;
  email?          :string;
  password?       :string;
  usernameVendor?   :string;
  categoryVendors?  :number[];
  description?      :string;
  inoperative_date?  :string[];
  instagram_url?    :string;
  rating?           :Number;
  surat_ijin_usaha? :any;
  flag?             :string;
}

export class Cart{
  id?           : number;
  name?         : string;
  qty?          : number;
  date?         : string[];
}

export interface Product{
  id?           : number;
  name?         : string;
  price?        : number;
  description?  : string;
  capacity?     : number;
  rating?       : number;
  photo         : Photo[];
}

export class Photo{
  id?           : number;
  image?        : any;
}

export interface page{
  pageSize?:number;
  pageIndex?:number;
  length?:number;
}
