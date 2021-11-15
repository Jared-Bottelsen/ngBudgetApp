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

  indexOfSubCategoryDeleteButton: number = -1;

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
    this.indexOfSubCategoryDeleteButton = this.subCategories.length - 1
  }

  deleteSubCategory(i: any) {
    this.subCategories.removeAt(i);
    this.hideDeleteButton();
  }

  onSubmit(budgetForm: FormGroup) {
    if (budgetForm.pristine) {
      this.ref.close();
    } else {
      this.ref.close(budgetForm.value);
    }
    this.hideDeleteButton();
  }

  closeModal() {
    this.ref.close();
    this.hideDeleteButton();
  }

  showDeleteButton(index: number) {
    this.indexOfSubCategoryDeleteButton = index
  }

  hideDeleteButton() {
    this.indexOfSubCategoryDeleteButton = -1;
  }
}
