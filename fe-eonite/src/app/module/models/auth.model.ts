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
    name : 'Produk',
    link : '/services-product'
  },
  {
    name : 'Tentang Kami',
    link : '/about-us'
  }
];

export const MENU_VENDOR:MENU[]=[
  {
    name : 'Dashboard',
    link : '/home'
  },
  {
    name : 'Tentang Kami',
    link : '/about-us'
  }
];

export const DROPDOWN_USER:MENU[]=[
  {
    name : 'Profil',
    link : '/profile-user'
  },
  {
    name : 'Chat',
    link : '/chat'
  },
  {
    name : 'Keranjang',
    link : '/cart'
  },
  {
    name : 'Transaksi',
    link : '/transaction'
  },
  {
    name : 'Pengembalian Dana',
    link : '/refund'
  },
  {
    name : 'Keluar',
    link : '/logout'
  }
];

export const DROPDOWN_VENDOR:MENU[]=[
  {
    name : 'Profil',
    link : '/profile-vendor'
  },
  {
    name : 'Produk',
    link : '/product-vendor'
  },
  {
    name : 'Chat',
    link : '/chat'
  },
  {
    name : 'Transaksi',
    link : '/transaction-vendor'
  },
  {
    name : 'Pembayaran',
    link : '/payment'
  },
  {
    name : 'Keluar',
    link : '/logout'
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
  rating?           :number;
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
  max?          :number;
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
