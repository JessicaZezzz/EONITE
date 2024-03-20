import { Component, OnInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import {NestedTreeControl} from '@angular/cdk/tree';
import {MatTreeNestedDataSource} from '@angular/material/tree';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';


interface TestNode {
  display: string;
  value: any;
  children?: TestNode[];
  isSelected: boolean;
}

@Component({
  selector: 'app-services-product',
  templateUrl: './services-product.component.html',
  styleUrls: ['./services-product.component.css']
})
export class ServicesProductComponent implements OnInit {
  panelOpenState = false;
  test_data: TestNode[] = [
    {
      display: 'Fruits',
      value: 'Fruits',
      isSelected: false,
      children: [
        {display: 'Apple', value:'Apple', isSelected: false,},
        {display: 'Banana', value: 'Banana', isSelected: false,},
        {display: 'Fruit loops', value: 'Fruit loops', isSelected: false,},
      ]
    },
    {
      display: 'Vegetables',
      value: 'Vegetables',
      isSelected: false,
      children: [
        {
          display: 'Greens',
          value: 'Greens',
          isSelected: false,
          children: [
            {display: 'Broccoli', value: 'Broccoli', isSelected: false,},
            {display: 'Brussels sprouts', value: 'Brussels sprouts', isSelected: false,},
            {display: 'Spinach', value: 'Spinach', isSelected: false,},
          ]
        },
        {
          display: 'Non-greens',
          value: 'Non-greens',
          isSelected: false,
          children: [
            {display: 'Pumpkins', value: 'Pumpkins', isSelected: false,},
            {display: 'Carrots', value: 'Carrots', isSelected: false,},
          ]
        },
      ]
    },
  ];





  treeControl = new NestedTreeControl<TestNode> (node => node.children);
  dataSource = new MatTreeNestedDataSource<TestNode> ();

  childIsSelectedList:any[] = [];

  selections: any[] = [];

  // [START] possibly for search feature...? //
  nestedSelectControl = new FormControl()
  test_data_options: Observable<TestNode[]> | undefined;

  private _filterTree(value: string) {
    const filterValue = value.toLowerCase();
    const result = this.test_data.filter(nodes => {
      if (nodes) {
        console.log('logging fiter node: ', nodes);
        return true;
      }
      return;
    });
    return result
  }
  // [END] possibly for search feature...? //

  constructor() {
    this.dataSource.data = this.test_data;
  }

  hasChild = (_: number, node: TestNode) => !!node.children && node.children.length > 0;

  ngOnInit() {
    this.test_data_options = this.nestedSelectControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filterTree(value))
    );
  }

  selectionToggleLeaf(isChecked:any, node:any) {
    // console.log('leaf selected: ', node);
    node.isSelected = isChecked;
    if (node.isSelected && !this.selections.includes(node.value)) {
      this.selections.push(node.value);
      console.log('selections list: ', this.selections)
    } else if (!node.isSelected && this.selections.includes(node.value)) {
      let deleteIndex = this.selections.indexOf(node.value);
      this.selections.splice(deleteIndex, 1);
    }
  }

  selectionToggle(isChecked:any, node:any) {
    // console.log('branch node selected: ', node);
    node.isSelected = isChecked;
    if (node.isSelected && !this.selections.includes(node.value)) {
      this.selections.push(node.value);
      console.log('selections list: ', this.selections)
    } else if (!node.isSelected && this.selections.includes(node.value)) {
      let deleteIndex = this.selections.indexOf(node.value);
      this.selections.splice(deleteIndex, 1);
    }
    if (node.children) {
      node.children.forEach((child: any) => {
        this.selectionToggle(isChecked, child);
      });
    }
  }

  descendantsAllSelected(node:any) {
    let childIsSelectedList: any[] = [];
    if (node.children && node.children.length) {
        node.children.forEach((child: { isSelected: any; }) => {
        childIsSelectedList.push(child.isSelected);
      })
    }

    // scans to see if children are all true
    if (childIsSelectedList.length && childIsSelectedList.every(item => {return item})) {
      console.log('All Selected for node: ', node)
      console.log('Child isSelected List: ', childIsSelectedList)
      if (!this.selections.includes(node.value)) {
        this.selections.push(node.value);
        // console.log('selections list: ', this.selections)
      }
      return true;
    }

    if (node.children && node.children.length) {
        node.children.forEach((child: any) => {
          this.descendantsAllSelected(child);
        })
    }
    return;
  }

  // descendantsPartiallySelected(node) {
  //   let childIsSelectedList = [];
  //   if (node.children && node.children.length) {
  //       node.children.forEach(child => {
  //       childIsSelectedList.push(child.isSelected);
  //     })
  //   }

  //   // scans to see if children contain any false, but not all false
  //   if (childIsSelectedList.includes(false) && !childIsSelectedList.every(item => {return !item})) {
  //     return true;
  //   }
  //   if (node.children && node.children.length) {
  //       node.children.forEach(child => {
  //         this.descendantsPartiallySelected(child);
  //       })
  //   }
  // }

  addChildSelection(node:any) {
    if (node.children && node.children.length) {
        node.children.forEach((child:any) => {
        this.childIsSelectedList.push(child.isSelected);
        this.addChildSelection(child)
      });
    }
  }

  checkDescPartSelection(node:any) {
    this.childIsSelectedList = [];

    this.addChildSelection(node);
    // scans to see if children contain any false, but not all false
    console.log('this.childSelectedList: ', this.childIsSelectedList)
    if (this.childIsSelectedList.includes(false) && !this.childIsSelectedList.every(item => {return !item})) {
      // let deleteIndex = this.selections.indexOf(node.value);
      // this.selections.splice(deleteIndex, 1);
      return true;
    }
    return;
  }


  filterChanged(inputValue:any) {
    console.log('filtering for...', inputValue)

  }
}
