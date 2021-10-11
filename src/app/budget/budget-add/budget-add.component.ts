import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-budget-add',
  templateUrl: './budget-add.component.html',
  styleUrls: ['./budget-add.component.scss']
})
export class BudgetAddComponent implements OnInit {

  budgetForm = this.fb.group({
    categoryTitle: '',
    subCategory: this.fb.array([]),
  });

  get subCategories() {
    return this.budgetForm.get('subCategory') as FormArray
  }

  addSubcategory() {
    const subCategory = this.fb.group({
      subCategoryTitle: [],
      subCategoryValue: []
    })

    this.subCategories.push(subCategory);
  }

  deleteSubCategory(i: any) {
    this.subCategories.removeAt(i);
  }

  onSubmit(budgetForm: FormGroup) {
    if (budgetForm.pristine) {
      this.ref.close();
    }
    this.ref.close(budgetForm);
  }

  constructor(private fb: FormBuilder, public ref: DynamicDialogRef) {
  }
  ngOnInit(): void {
  }
}