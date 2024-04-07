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
    link : '/home'
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
    name : 'Refund',
    link : '/refund'
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
    name : 'Chat',
    link : '/chat'
  },
  {
    name : 'Transaction',
    link : '/transaction-vendor'
  },
  {
    name : 'Payment',
    link : '/payment'
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
  bankAccount?:string;
  categoryVendors?  :number[];
  description?      :string;
  inoperative_date?  :string[];
  instagram_url?    :string;
  rating?           :Number;
  status_reject? :any;
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
  photo        : Photo[];
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

export interface Transaction{
  id?           :number;
  description?  :string;
  payment?      :any;
  state?        :string;
  total?        :number;
  transdate?    :string;
  invoice?      :string;
  transDet      :TransDet[];
  vendor?       :Vendor;
  user?         :User;
}

export interface TransDet{
  id?           :number;
  bookdate?     :string;
  product?      :Product;
  productReview?:any;
  quantity?     :number;
}

export interface refund{
  id?             : number;
  rejectedBy?     :string;
  alasanRejected? :string;
  timestamp?      :string;
  bankAccountUser? :string
  state?          :string;
  totalFundUser?  :number;
  totalFundVendor?:number;
  tfUser?         :any;
  tfVendor?       :any;
  transaction?    :Transaction;
}

export interface productReview{
  id?:number;
  rating?:number;
  review?:string;
  user?:User;
}

export interface ChatMessage {
  id:number;
  chatId:string;
  senderId:string;
  recipientId:string;
  senderName:string;
  recipientName:string;
  content:string;
  timestamp:any;
  status:any;
}
