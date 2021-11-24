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
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-budget',
  templateUrl: './budget.component.html',
  styleUrls: ['./budget.component.scss'],
  providers: [DialogService, DynamicDialogRef, ConfirmationService]
})
export class BudgetComponent implements OnInit, OnDestroy {

  getBudgetSubscription$!: Subscription;

  faPlusCircle = faPlusCircle

  testValue: number = 100;

  isMenuVisible!: number;

  budgetCategory: any = [];

  menuItems!: MenuItem[];

  budgetAddModalOptions = {
    header: 'Add to Your Budget',
    width: '95%',
    height: '52%',
    showHeader: false,
    styleClass: 'dynamic-dialog-wrapper'
  }

  expenseAddModalOptions = {
    header: 'Add an Expense',
    width: '95%',
    showHeader: false,
    styleClass: 'dynamic-dialog-wrapper'
  }

  constructor(private dialogService: DialogService, private ref: DynamicDialogRef, private db: FirebaseService, private confirmationService: ConfirmationService) { }

  ngOnInit(): void {
    this.getBudgetSubscription$ = this.db.getCategories()
     .subscribe((categories: any) => {
       this.budgetCategory = categories
     })
     this.menuItems = [
       {label: 'New Budget Category', command: () => { this.showBudgetCategoryModal(); }},
       {label: 'Add Expense', command: () => { this.showExpenseModal(); }},
     ]
   }
 
   ngOnDestroy(): void {
     this.getBudgetSubscription$.unsubscribe();
   }

   confirmBudgetReset(event: any) {
     this.confirmationService.confirm({
       target: event.target,
       message: "Are you sure you want to reset your budget? All of your budget values will be reset and all expenses logged will be deleted",
       icon: 'pi pi-exclamation-triangle',
       accept: () => {
         this.db.resetWholeBudget();
         this.confirmationService.close();
       },
       reject: () => {
         this.confirmationService.close();
       }
     })
   }
 
   resetEntireBudget() {
     this.db.resetWholeBudget();
   }

  openBudgetEditModal(index: number) {
    const ref = this.dialogService.open(BudgetEditComponent, {
      data: {
        docId: this.budgetCategory[index].docId,
        categoryTitle: this.budgetCategory[index].categoryTitle,
        subCategories: this.budgetCategory[index].subCategory
      },
      width: '95%',
      styleClass: 'dynamic-dialog-wrapper',
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

  private addStartingValueToSubCategory(subCatArray: any[]) {
    let budgetSubCategory: any[] = [];
    for (let i = 0; i < subCatArray.length; i++) {
      subCatArray[i].startingValue = subCatArray[i].subCategoryValue
      budgetSubCategory.push(subCatArray[i])
    }
    return budgetSubCategory;
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
        this.db.addCategory({categoryTitle: category.categoryTitle, subCategory: this.addStartingValueToSubCategory(category.subCategory)});
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
}