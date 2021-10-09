import { Component, OnInit } from '@angular/core';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { DialogService } from 'primeng/dynamicdialog';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { BudgetAddComponent } from './budget-add/budget-add.component';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { BudgetCategory } from './budget-add/budget-category.model';
import { BudgetSubcategory } from './budget-add/budget-subcategory.model';

@Component({
  selector: 'app-budget',
  templateUrl: './budget.component.html',
  styleUrls: ['./budget.component.scss'],
  providers: [DialogService, DynamicDialogRef]
})
export class BudgetComponent implements OnInit {

  faPlusCircle = faPlusCircle

  testValue: number = 100;

  budgetAddModalOptions = {
    header: 'Add to Your Budget',
    width: '80%',
    height: '80%',
    styleClass: 'budget-add'  
  }

  budgetcategory: any = [
    {
      categoryTitle: new BudgetCategory('A test string'),
      subCategory: [
        new BudgetSubcategory('Test String', 500),
        new BudgetSubcategory('test test', 6500),
        new BudgetSubcategory('Another test', 555),
        new BudgetSubcategory('Tertiary test', 2342),
        new BudgetSubcategory('more tests', 342322)
      ] 
    },
    {
      categoryTitle: new BudgetCategory('Another test string'),
      subCategory: [
        new BudgetSubcategory('Another test', 555),
        new BudgetSubcategory('Tertiary test', 2342),
        new BudgetSubcategory('more tests', 342322)
      ]
    } 
  ]

  constructor(public dialogService: DialogService, public ref: DynamicDialogRef) { 

  }

  showModal() {
    const ref = this.dialogService.open(BudgetAddComponent, this.budgetAddModalOptions)
    
    ref.onClose.subscribe((test) => {
      console.log(test)
      this.budgetcategory.push({
        categoryTitle: new BudgetCategory(test.categoryTitle),
        subCategory: [
          new BudgetSubcategory(test.subCategoryTitle, test.subCategoryValue)
        ]
      })
      console.log(this.budgetcategory);
    })

  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.budgetcategory, event.previousIndex, event.currentIndex);
  }

  ngOnInit(): void {
  }

}
