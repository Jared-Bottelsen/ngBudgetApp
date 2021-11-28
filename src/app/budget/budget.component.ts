import { Component, OnInit, OnDestroy } from '@angular/core';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { DialogService } from 'primeng/dynamicdialog';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { BudgetAddComponent } from './budget-add/budget-add.component';
import { FirebaseService } from '../services/firebase.service';
import { BudgetEditComponent } from './budget-edit/budget-edit.component';
import { Subscription } from 'rxjs';
import { MenuItem } from 'primeng/api';
import { ExpenseAddComponent } from './expense-add/expense-add.component';
import { ConfirmationService } from 'primeng/api';
import { ArchiveTitleComponent } from './archive-title/archive-title.component';

@Component({
  selector: 'app-budget',
  templateUrl: './budget.component.html',
  styleUrls: ['./budget.component.scss'],
  providers: [DialogService, DynamicDialogRef, ConfirmationService]
})
export class BudgetComponent implements OnInit, OnDestroy {

  getBudgetSubscription$!: Subscription;

  getExpensesSubscription$!: Subscription;

  getIncomeSubscription$!: Subscription;

  faPlusCircle = faPlusCircle

  testValue: number = 100;

  isMenuVisible!: number;

  budgetCategories: any = [];

  expenses: any = [];

  income: any;

  menuItems!: MenuItem[];

  budgetAddModalOptions = {
    width: '95%',
    height: '52%',
    showHeader: false,
    styleClass: 'dynamic-dialog-wrapper'
  }

  expenseAddModalOptions = {
    width: '95%',
    showHeader: false,
    styleClass: 'dynamic-dialog-wrapper'
  }

  archiveTitleModalOptions = {
    width: '95%',
    showHeader: false,
    styleClass: 'dynamic-dialog-wrapper'
  }

  constructor(private dialogService: DialogService, private ref: DynamicDialogRef, private db: FirebaseService, private confirmationService: ConfirmationService) { }

  ngOnInit(): void {
    this.getBudgetSubscription$ = this.db.getCategories()
     .subscribe((categories: any) => {
       this.budgetCategories = categories
     })
     this.menuItems = [
       {label: 'New Budget Category', command: () => { this.showBudgetCategoryModal(); }},
       {label: 'Add Expense', command: () => { this.showExpenseModal(); }},
     ]
     this.getExpensesSubscription$ = this.db.getExpenses().subscribe(result => {
       result.forEach(final => {
        this.expenses.push(final);
        console.log(this.expenses);
       })
     })
     this.getIncomeSubscription$ = this.db.getIncome().subscribe((result: any) => {
       this.income = result.income;
     })
   }
 
   ngOnDestroy(): void {
     this.getBudgetSubscription$.unsubscribe();
     this.getExpensesSubscription$.unsubscribe();
     this.getIncomeSubscription$.unsubscribe();
   }

   confirmBudgetReset(event: any) {
     this.confirmationService.confirm({
       target: event.target,
       message: "Are you sure you want to reset your budget? All of your budget values will be reset and all expenses logged will be deleted",
       icon: 'pi pi-exclamation-triangle',
       accept: () => {
        this.showArchiveTitleModal();
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
        docId: this.budgetCategories[index].docId,
        categoryTitle: this.budgetCategories[index].categoryTitle,
        subCategories: this.budgetCategories[index].subCategory
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

  addUpBudgetCategories() {
    let budgetTotal: number = 0
    for (let i = 0; i < this.budgetCategories.length; i++) {
      let subCategories = this.budgetCategories[i].subCategory
      for (let j = 0; j < subCategories.length; j++) {
        budgetTotal += subCategories[j].startingValue     
      }
    }
    return budgetTotal
  }

  addExpenses() {
    let expenseTotal: number = 0;
    for (let i = 0; i < this.expenses.length; i++) {
      expenseTotal += this.expenses[i].expenseAmount
    }
    return expenseTotal
  }

  showArchiveTitleModal() {
    const ref = this.dialogService.open(ArchiveTitleComponent, this.archiveTitleModalOptions);

    ref.onClose.subscribe(result => {
      if (!result) {
        this.db.resetWholeBudget()
        return
      } else {
        console.log(result);
        this.db.addBudgetToArchive(result.budgetName ,this.addUpBudgetCategories(), this.income, this.expenses, this.addExpenses());
      }
    })
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