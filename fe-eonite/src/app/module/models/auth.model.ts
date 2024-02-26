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
    name : 'Home',
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
  },
  {
    name : 'Manage About Us',
    link : '/manage_about_us'
  }
]
