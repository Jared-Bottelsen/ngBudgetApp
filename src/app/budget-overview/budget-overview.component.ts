import { Component, OnInit, OnDestroy } from '@angular/core';
import { faHandHoldingUsd } from '@fortawesome/free-solid-svg-icons';
import { DeviceDetectorService } from 'ngx-device-detector';
import { Subscription } from 'rxjs';
import { FirebaseService } from '../services/firebase.service';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ExpenseEditComponent } from './expense-edit/expense-edit.component';

@Component({
  selector: 'app-budget-overview',
  templateUrl: './budget-overview.component.html',
  styleUrls: ['./budget-overview.component.scss'],
  providers: [DialogService, DynamicDialogRef]
})
export class BudgetOverviewComponent implements OnInit, OnDestroy {

  isButtonMenuVisible: number = -1;

  getExpensesObservable$!: Subscription;

  faHandHoldingUsd = faHandHoldingUsd

  isMobile: boolean = this.deviceService.isMobile();

  isDesktop: boolean = this.deviceService.isDesktop();

  individualExpenses:any = []; 

  constructor(private deviceService: DeviceDetectorService, private db: FirebaseService, private dialogService: DialogService, private ref: DynamicDialogRef) { }

  ngOnInit(): void {
    this.getExpensesObservable$ = this.db.getExpenses()
    .subscribe((expenses) => {
      expenses.map((expenseList) => {
        this.individualExpenses.push(expenseList);
      })
    })
    this.db.createUser();
  }

  ngOnDestroy(): void {
    this.getExpensesObservable$.unsubscribe();
  }

  showButtons(index: number) {
      this.isButtonMenuVisible = index;
  }

  hideButtons() {
     this.isButtonMenuVisible = -1
  }

  openEditModal(index: number) {
    const ref: DynamicDialogRef = this.dialogService.open(ExpenseEditComponent, {
      header: 'Make an Edit to an Expense',
      width: '90%',
      height: '50%',
    })
    ref.onClose.subscribe((options: any) => {
      this.isButtonMenuVisible = -1
    })
  }
}