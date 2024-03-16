import { Component, ViewChild, ViewChildren, QueryList} from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})

export class CartComponent{
  @ViewChild('outerSort', { static: true }) sort!: MatSort;
  @ViewChildren('innerSort') innerSort!: QueryList<MatSort>;
  @ViewChildren('innerTables') innerTables!: QueryList<MatTable<Address>>;

  data: User[] = USERS;
  openCart: boolean = false;
  deleteItem:boolean = false;
  dataSource!: MatTableDataSource<User>;
  usersData: User[] = [];
  columnsToDisplay = ['image','name','action'];
  innerDisplayedColumns = ['select','image', 'productName', 'qty','date','price','action'];
  userSelection = new SelectionModel<any>(true, []);
  userSSelection = new SelectionModel<any>(true, []);
  userSelectionMap: Map<number, SelectionModel<any>> = new Map<number,SelectionModel<any>>();
  bookingDialog:boolean = true;

  constructor() {}

  ngOnInit() {
    USERS.forEach(user => {
      if (
        user.addresses &&
        Array.isArray(user.addresses) &&
        user.addresses.length
      ) {
        this.usersData = [
          ...this.usersData,
          { ...user, addresses: new MatTableDataSource(user.addresses) }
        ];
      } else {
        this.usersData = [...this.usersData, user];
      }
    });
    this.dataSource = new MatTableDataSource(this.usersData);
    this.dataSource.sort = this.sort;
    this.dataSource.data.forEach(row=>{
      this.userSelectionMap.set(row.id, new SelectionModel<any>(true,[]));
    })
  }

  createBooking(){
    this.bookingDialog = !this.bookingDialog;
  }

  closeCart(event:boolean){
    this.openCart = event;
  }

  openDialogCart(element:any){
    this.openCart =true;
  }

  dm(){
    console.log(this.userSSelection.selected)
  }

  checkSelected(element:any){
    if(this.userSSelection.selected.find(x => x.id == element.id) != undefined){
      return true;
    }return false;
  }

  checkIndeterminate(elementId:number){
    return this.userSelectionMap.get(elementId)?.hasValue() && !this.isAllUserSelected(elementId);
  }

  // Child Checkbox
  isAllUserSelected(elementId: number) {
    const numSelected = this.userSelectionMap.get(elementId)!.selected.length;
    let temp = this.dataSource.data.find(x=>x.id == elementId);
    const numRows = temp?.addresses?.filteredData!.length;
    return numSelected == numRows;
  }

  UserMasterToggle(elementId: number) {
    this.isAllUserSelected(elementId) ? this.userSelectionMap.get(elementId)!.clear()
      : this.dataSource.data.find(x=>x.id == elementId)?.addresses.filteredData.forEach((row: any) =>
          this.userSelectionMap.get(elementId)!.select(row)
        );
  }

  // Parent checkbox
  isAllUserSSelected() {
    const numSelected = this.userSSelection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected == numRows;
  }

  UserSMasterToggle() {
    if(this.isAllUserSSelected()){
      this.dataSource.data.forEach(row =>{
        this.getAllChildCheck(row);
      })
        this.userSSelection.clear();
    }else{
      this.userSSelection.clear();
      this.dataSource.data.forEach(row =>{
        this.getAllChildCheck(row);
        this.userSSelection.select(row);
      })
    }
  }

  getAllChildCheck(row:any){
    if(this.checkSelected(row)){
      this.userSelectionMap.get(row.id)!.clear();
    }else{
      this.userSelectionMap.get(row.id)!.clear();
      this.dataSource.data.find(x=>x.id == row.id)?.addresses.filteredData.forEach((row: any) =>
          this.userSelectionMap.get(row.id)!.select(row)
        );
    }
  }

}

export interface User {
  id:number;
  name: string;
  email: string;
  phone: string;
  addresses?: any | MatTableDataSource<Address>;
}

export interface Address {
  id:number;
  image: string;
  productName: string;
  qty: string;
  price:number;
  date?: string[];
}

const USERS: User[] = [
  {
    id:1,
    name: 'Mason',
    email: 'mason@test.com',
    phone: '9864785214',
    addresses: [
      {
        id:1,
        image: 'Image 1',
        productName: '78542',
        qty: 'Kansas',
        price:1500000,
        date: [
          "14-03-20023",
          "15-03-2023"
        ]
      },
      {
        id:1,
        image: 'Image 2',
        productName: '78554',
        qty: 'Texas',
        price:1500000,
        date: [
          "14-03-20023",
          "15-03-2023"
        ]
      }
    ]
  },
  {
    id:2,
    name: 'Eugene',
    email: 'eugene@test.com',
    phone: '8786541234',
    addresses: [
      {
        id:2,
        image: 'Image 5',
        productName: '23547',
        qty: 'Utah',
        price:1500000,
        date: [
          "14-03-20023",
          "15-03-2023"
        ]
      },
      {
        id:2,
        image: 'Image 5',
        productName: '23547',
        qty: 'Ohio',
        price:1500000,
        date: [
          "14-03-20023",
          "15-03-2023"
        ]
      }
    ]
  },
  {
    id:3,
    name: 'Jason',
    email: 'jason@test.com',
    phone: '7856452187',
    addresses: [
      {
        id:3,
        image: 'Image 5',
        productName: '23547',
        qty: 'Utah',
        price:1500000,
        date: [
          "14-03-20023",
          "15-03-2023"
        ]
      }
    ]
  }
];
