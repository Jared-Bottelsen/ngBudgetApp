import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { Subscription } from 'rxjs';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-expense-add',
  templateUrl: './expense-add.component.html',
  styleUrls: ['./expense-add.component.scss']
})
export class ExpenseAddComponent implements OnInit, OnDestroy {

  selectedOption: string;
  categoryOptions: any;
  rawCateories: any = [];
  currentBudgetValue: any;
  getCategoriesObservable$!: Subscription;


  expenseForm = this.fb.group({
    expenseCategory: '',
    expenseAmount: '',
    expenseName: ''
  })

  optionValue(event: any) {
  }

  formOptions = [
    {
      label: 'Expense',
      value: 'expense'
    },
    {
      label: 'Income',
      value: 'income'
    }
  ]

  createDate() {
    let newDate = new Date();
    let month = newDate.getMonth() + 1;
    let day = newDate.getDate();
    return `${month}/${day}`
  }

  findExpenseCategory(budgetCategory: string) {
      for(let i = 0; i < this.rawCateories.length; i++) {
        let index = this.rawCateories[i].subCategory.find((x: any) => x.subCategoryTitle === budgetCategory)
        if (index) {
          this.currentBudgetValue = index
        }
      }
    }
  

  isolateOptions (options: any[]) {
    let categories: any[] = [];
    for (let i = 0; options.length > i; i++) {
      let subCategories = options[i].subCategory
      for (let j = 0; j < subCategories.length; j++) {
        categories.push(subCategories[j].subCategoryTitle)       
      }
    }
    return categories
  }

  onFormSubmit(formData: FormGroup) {
    let categoryData = formData.value.expenseCategory.pop()
    formData.value.expenseCategory = categoryData;
    this.db.addExpense({
      expenseCategory: formData.value.expenseCategory,
      expenseName : formData.value.expenseName,
      expenseAmount: formData.value.expenseAmount, 
      expenseDate: this.createDate(),
      fullDate: new Date()
    });
    this.findExpenseCategory(formData.value.expenseCategory)
    this.db.getExpenseInfo(formData.value.expenseAmount, this.currentBudgetValue.subCategoryValue, this.currentBudgetValue);
    this.db.expenseAddQuery(this.currentBudgetValue)
  }

  constructor(private fb: FormBuilder, private db: FirebaseService) { 
    this.selectedOption = 'expense'
    this.categoryOptions = [];
  }

  ngOnInit(): void {
   this.getCategoriesObservable$ = this.db.getCategories()
    .subscribe((categories) => {
      this.rawCateories = categories
      this.categoryOptions = this.isolateOptions(this.rawCateories);
    })
  }

  ngOnDestroy(): void {
    this.getCategoriesObservable$.unsubscribe();
  }
}