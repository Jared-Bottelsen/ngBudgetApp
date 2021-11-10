import { Component, OnInit } from '@angular/core';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';

interface ExpenseData {
  expenseAmount: string,
  expenseCategory: string,
  expenseDate: string
}

@Component({
  selector: 'app-expense-edit',
  templateUrl: './expense-edit.component.html',
  styleUrls: ['./expense-edit.component.scss']
})
export class ExpenseEditComponent implements OnInit {

  expenseData!: ExpenseData;

  constructor(private config: DynamicDialogConfig) {
    this.expenseData = this.config.data
  }

  ngOnInit(): void {
    console.log(this.expenseData);
  }

}
