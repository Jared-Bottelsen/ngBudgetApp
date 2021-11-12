import { Component, OnInit } from '@angular/core';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FirebaseService } from 'src/app/services/firebase.service';

interface ExpenseData {
  expenseAmount: number,
  expenseCategory: string,
  expenseName: string,
  expenseDate: string
}

@Component({
  selector: 'app-expense-edit',
  templateUrl: './expense-edit.component.html',
  styleUrls: ['./expense-edit.component.scss']
})
export class ExpenseEditComponent implements OnInit {

  expenseData!: ExpenseData;

  expenseEditForm: FormGroup = this.fb.group({
    expenseName: [this.config.data.expenseName],
    expenseAmount: [this.config.data.expenseAmount],
    expenseDate: [this.config.data.expenseDate]
  })

  constructor(private config: DynamicDialogConfig, private ref: DynamicDialogRef, private fb: FormBuilder, private db: FirebaseService) {
    this.expenseData = this.config.data
  }

  submitForm(formData: ExpenseData) {
    let originalWithNewData: Object = {
      original: this.config.data,
      new: formData
    }
    this.ref.close(originalWithNewData)
  }

  closeModal() {
    this.ref.close();
  }

  deleteExpense() {
    this.db.deleteExpense(this.expenseData.expenseName, this.expenseData.expenseAmount, this.expenseData.expenseCategory);
    this.ref.close()
  }

  ngOnInit(): void {
    console.log(this.expenseData);
  }

}
