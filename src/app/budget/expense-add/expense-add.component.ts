import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-expense-add',
  templateUrl: './expense-add.component.html',
  styleUrls: ['./expense-add.component.scss']
})
export class ExpenseAddComponent implements OnInit {

  selectedOption: string;
  categoryOptions: any;
  rawCateories: any = [];


  expenseForm = this.fb.group({
    expenseCategory: '',
    expenseAmount: ''
  })

  optionValue(event: any) {
    console.log(event);
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
    console.log(`${month}/${day}`);
    return `${month}/${day}`
  }

  isolateOptions (options: any) {
    let categories: any = [];
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
    console.log(formData.value);
    this.db.addExpense({expenseCategory: formData.value.expenseCategory,
    expenseAmount: formData.value.expenseAmount, expenseDate: this.createDate()});
  }

  constructor(private fb: FormBuilder, private db: FirebaseService) { 
    this.selectedOption = 'expense'
    this.categoryOptions = [];
  }

  ngOnInit(): void {
    this.db.getCategories()
    .subscribe((categories) => {
      this.rawCateories = categories
      this.categoryOptions = this.isolateOptions(this.rawCateories);
    })
  }
}