import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-budget-add',
  templateUrl: './budget-add.component.html',
  styleUrls: ['./budget-add.component.scss']
})
export class BudgetAddComponent implements OnInit {

  faTimes = faTimes;

  budgetForm = this.fb.group({
    categoryTitle: '',
    subCategory: this.fb.array([]),
  });

  constructor(private fb: FormBuilder, public ref: DynamicDialogRef) {}

  ngOnInit(): void {}

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
    } else {
      this.ref.close(budgetForm.value);
    }
  }

  closeModal() {
    this.ref.close();
  }
}
