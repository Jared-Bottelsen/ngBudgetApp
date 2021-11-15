import { Component, OnInit, OnDestroy } from '@angular/core';
import { faHandHoldingUsd } from '@fortawesome/free-solid-svg-icons';
import { DeviceDetectorService } from 'ngx-device-detector';
import { Subscription } from 'rxjs';
import { FirebaseService } from '../services/firebase.service';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';

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

  faHandHoldingUsd = faHandHoldingUsd

  isMobile: boolean = this.deviceService.isMobile();

  isDesktop: boolean = this.deviceService.isDesktop();

  individualExpenses: Array<any> = []; 

  budgetCategories: Array<any> = []

  constructor(private deviceService: DeviceDetectorService, private db: FirebaseService, private dialogService: DialogService, private ref: DynamicDialogRef) { }

  ngOnInit(): void {
    this.getExpensesObservable$ = this.db.getExpenses()
    .subscribe((expenses) => {
        this.individualExpenses = expenses;
    })
    this.getBudgetCategoriesObservable$ = this.db.getCategories()
    .subscribe(categories => {
      this.budgetCategories = categories
    })
    this.db.createUser();
  }

  ngOnDestroy(): void {
    this.getExpensesObservable$.unsubscribe();
    this.getBudgetCategoriesObservable$.unsubscribe();
  }

  showButtons(index: number) {
      this.isButtonMenuVisible = index;
  }

  hideButtons() {
     this.isButtonMenuVisible = -1;
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