import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { Subscription } from 'rxjs';
import { FirebaseService } from 'src/app/services/firebase.service';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-expense-add',
  templateUrl: './expense-add.component.html',
  styleUrls: ['./expense-add.component.scss']
})
export class ExpenseAddComponent implements OnInit, OnDestroy {

  faTimes = faTimes;

  categoryOptions: any;

  rawCategories: any = [];

  getCategoriesObservable$!: Subscription;

  expenseForm = this.fb.group({
    expenseCategory: '',
    expenseAmount: '',
    expenseName: ''
  })

  constructor(private fb: FormBuilder, private db: FirebaseService, private config: DynamicDialogConfig, private ref: DynamicDialogRef) { 
    this.categoryOptions = [];
  }

  ngOnInit(): void {
   this.getCategoriesObservable$ = this.db.getCategories()
    .subscribe((categories) => {
      this.rawCategories = categories
      this.categoryOptions = this.isolateOptions(this.rawCategories);
    })
  }

  ngOnDestroy(): void {
    this.getCategoriesObservable$.unsubscribe();
  }

  createDate() {
    let newDate = new Date();
    let month = newDate.getMonth() + 1;
    let day = newDate.getDate();
    return `${month}/${day}`
  }

/**
 * Used to find the entire subCategory entry that we are targetting an expense withdraw from to be used in
 * the query to firebase
 * @param budgetCategory 
 * @returns the object value of the current budget subcategory {subCategoryValue: number, subCategoryTitle: string, startingValue: number}
 */
  findExpenseCategory(budgetCategory: string) {
    for(let i = 0; i < this.rawCategories.length; i++) {
      let index = this.rawCategories[i].subCategory.find((x: any) => x.subCategoryTitle === budgetCategory)
      if (index) {
        return index
      }
    }
  }

/**
 * Takes in the getCategories data from the database and isolates the subCategoryTitle's to be used in the dropdown in the
 * expenseForm expenseCategory control
 * @param options 
 * @returns the array used in the expenseCategory control multiSelect dropdown
 */
  isolateOptions (options: any[]) {
    let categories: any[] = [];
    for (let i = 0; options.length > i; i++) {
      let subCategories = options[i].subCategory
      for (let j = 0; j < subCategories.length; j++) {
        categories.push(subCategories[j].subCategoryTitle);       
      }
    }
    return categories
  }

  onFormSubmit(formData: FormGroup) {
    if (!formData.pristine) {
      let expenseCat = formData.value.expenseCategory.pop();
      let docId = this.findExpenseCategory(expenseCat)
      this.db.addExpense({
        parentDocId: docId.parentDocId,
        expenseCategory: expenseCat,
        expenseName : formData.value.expenseName,
        expenseAmount: formData.value.expenseAmount, 
        expenseDate: this.createDate(),
        fullDate: new Date()
      });
      let expensePayload = {
        currentBudgetCategoryData: this.findExpenseCategory(expenseCat),
        submittedData: {
          subCategoryTitle: expenseCat,
          expenseName: formData.value.expenseName,
          expenseAmount: formData.value.expenseAmount
        }
      }
      this.ref.close(expensePayload);
    }
  }

  closeModal() {
    this.ref.close();
  }
}