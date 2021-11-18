import { Component, OnInit, OnDestroy } from '@angular/core';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { DialogService } from 'primeng/dynamicdialog';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { BudgetAddComponent } from './budget-add/budget-add.component';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { FirebaseService } from '../services/firebase.service';
import { BudgetEditComponent } from './budget-edit/budget-edit.component';
import { Subscription } from 'rxjs';
import { MenuItem } from 'primeng/api';
import { ExpenseAddComponent } from './expense-add/expense-add.component';

@Component({
  selector: 'app-budget',
  templateUrl: './budget.component.html',
  styleUrls: ['./budget.component.scss'],
  providers: [DialogService, DynamicDialogRef]
})
export class BudgetComponent implements OnInit, OnDestroy {

  getBudgetSubscription$!: Subscription;

  faPlusCircle = faPlusCircle

  testValue: number = 100;

  isMenuVisible!: number;

  budgetCategory: any[] = [];

  budgetSubCategory: any[] = [];

  menuItems!: MenuItem[];

  budgetAddModalOptions = {
    header: 'Add to Your Budget',
    width: '95%',
    height: '50%',
    showHeader: false
  }

  expenseAddModalOptions = {
    header: 'Add an Expense',
    width: '95%',
    showHeader: false,
  }

  constructor(public dialogService: DialogService, public ref: DynamicDialogRef, public db: FirebaseService) { }

  ngOnInit(): void {
    this.getBudgetSubscription$ = this.db.getCategories()
     .subscribe((categories: any) => {
       this.budgetCategory = categories
     })
     this.menuItems = [
       {label: 'New Budget Category', command: () => { this.showBudgetCategoryModal(); }},
       {label: 'Add Expense', command: () => { this.showExpenseModal(); }}
     ]
   }
 
   ngOnDestroy(): void {
     this.getBudgetSubscription$.unsubscribe();
   }
 

  openBudgetEditModal(index: number) {
    const ref = this.dialogService.open(BudgetEditComponent, {
      data: {
        categoryTitle: this.budgetCategory[index].categoryTitle,
        subCategories: this.budgetCategory[index].subCategory
      },
      width: '100%',
      styleClass: 'customDialogStyles',
      showHeader: false
    });

    ref.onClose.subscribe((options) => {
      this.isMenuVisible = -1;
    })
  }

  showMenu(index: number) {
    this.isMenuVisible = index;
  }

  hideMenu() {
    this.isMenuVisible = -1;
  }

  private createSubCategoryObj(subCatArray: any[]) {
    for (let i = 0; i < subCatArray.length; i++) {
      subCatArray[i].startingValue = subCatArray[i].subCategoryValue
      this.budgetSubCategory.push(subCatArray[i])
    }
    return this.budgetSubCategory;
  }

  calcRemainingPercent(subCategories: any) {
    if(subCategories.startingValue === subCategories.subCategoryValue) {
      return 100;
    } else if (subCategories.startingValue !== subCategories.subCategoryValue && subCategories.subCategoryValue > 0) {
      let calc = (subCategories.subCategoryValue / subCategories.startingValue) * 100
      return calc
    } else {
      return 0
    }
  }

  showBudgetCategoryModal() {
    const ref = this.dialogService.open(BudgetAddComponent, this.budgetAddModalOptions)
    
    ref.onClose.subscribe((category) => {
      if (category === undefined) {
        console.log('No form data sent');
      } else {
        this.createSubCategoryObj(category.subCategory)
        this.budgetCategory.push({categoryTitle: category.categoryTitle, subCategory: this.budgetSubCategory});
        this.db.addCategory({categoryTitle: category.categoryTitle, subCategory: this.budgetSubCategory});
      }
    })
  }

  showExpenseModal() {
    const ref = this.dialogService.open(ExpenseAddComponent, this.expenseAddModalOptions);

    ref.onClose.subscribe(result => {
      if (result) {
        this.db.expenseSubtractOperation(result)
      }
    })
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.budgetCategory, event.previousIndex, event.currentIndex);
  }
}