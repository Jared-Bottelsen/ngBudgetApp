import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { FirebaseService } from '../services/firebase.service';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { IncomeAddComponent } from './income-add/income-add.component';

@Component({
  selector: 'app-budget-overview',
  templateUrl: './budget-overview.component.html',
  styleUrls: ['./budget-overview.component.scss'],
  providers: [DialogService, DynamicDialogRef]
})
export class BudgetOverviewComponent implements OnInit, OnDestroy {

  isButtonMenuVisible: number = -1;

  getExpensesObservable$!: Subscription;

  getBudgetCategoriesObservable$!: Subscription;

  individualExpenses: Array<any> = []; 

  budgetCategories: Array<any> = [];

  budgetCategoryTotal: number = 0;

  expenseTotal: number = 0;

  income: number = 0;

  overBudgeted: boolean = false;

  overSpent: boolean = false;

  menuSelectOptions: any;

  selectedButtonOption: string = 'expenses';

  budgetSubCategoryArray: Array<any> = [];
  
  constructor(private db: FirebaseService, private dialogService: DialogService, private ref: DynamicDialogRef) { 
    this.menuSelectOptions = [{
      label: "Expenses",
      value: "expenses"
    }, {
      label: "Overview",
      value: "overview"
    }]
  }

  ngOnInit(): void {
    this.getExpensesObservable$ = this.db.getExpenses()
    .subscribe((expenses) => {
        this.individualExpenses = expenses;
        this.expenseTotal = this.addExpenses();
    })
    this.getBudgetCategoriesObservable$ = this.db.getCategories()
    .subscribe(categories => {
      this.budgetCategories = categories;
      this.budgetSubCategoryArray = this.buildSubCategoryArray();
      this.budgetCategoryTotal = this.addUpBudgetCategories();
    })
    this.db.getIncome().subscribe((result: any) => {
      this.income = result.income || 0;
    })

    this.db.createUser();
  }

  ngOnDestroy(): void {
    this.getExpensesObservable$.unsubscribe();
    this.getBudgetCategoriesObservable$.unsubscribe();
  }

  isOverBudget() {
    if (this.budgetCategoryTotal < this.income || this.income === 0) return
    return this.overBudgeted = true;
  }

  isOverSpent() {
    if (this.expenseTotal <= this.budgetCategoryTotal || this.expenseTotal === 0) return
    return this.overSpent = true;
  }

  showButtons(index: number) {
      this.isButtonMenuVisible = index;
  }

  hideButtons() {
     this.isButtonMenuVisible = -1;
  }

  buildSubCategoryArray() {
    let subCategoryArray = [];
    for (let i = 0; i < this.budgetCategories.length; i++) {
      let subCategories = this.budgetCategories[i].subCategory;
      for (let j = 0; j < subCategories.length; j++) {
        subCategoryArray.push(subCategories[j]);
      }
    }
    return subCategoryArray;
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
    for (let i = 0; i < this.individualExpenses.length; i++) {
      expenseTotal += this.individualExpenses[i].expenseAmount
    }
    return expenseTotal
  }

  openIncomeModal() {
    let ref = this.dialogService.open(IncomeAddComponent, {
      width: '95%',
      height: '40%',
      showHeader: false,
      styleClass: 'income-add-modal-container'
    })
  }

  findBudgetCategoryObject(categoryTitle: string) {
    for (let i = 0; i < this.budgetCategories.length; i++) {
      let index = this.budgetCategories[i].subCategory.find((x: any) => x.subCategoryTitle === categoryTitle)
      if (index) {
        return index
      }
    }
  }

  deleteExpense(index: number) {
    let payload = {
      currentBudgetCategoryData: this.findBudgetCategoryObject(this.individualExpenses[index].expenseCategory),
      submittedData: {
        expenseAmount: this.individualExpenses[index].expenseAmount
      }
    }
    this.isButtonMenuVisible = -1;
    this.db.expenseDeleteOperation(payload);
    this.db.deleteExpense(this.individualExpenses[index].expenseName, this.individualExpenses[index].expenseAmount, this.individualExpenses[index].expenseCategory)
  }
}