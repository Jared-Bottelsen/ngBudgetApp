import { Component, OnInit } from '@angular/core';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog'; 
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-budget-edit',
  templateUrl: './budget-edit.component.html',
  styleUrls: ['./budget-edit.component.scss']
})
export class BudgetEditComponent implements OnInit {

  currentSubcategories: any = []

  editForm!: FormGroup;

  constructor(private ref: DynamicDialogRef, private config: DynamicDialogConfig, private fb: FormBuilder) { 
    this.currentSubcategories = this.config.data.subCategories
    this.editForm = this.fb.group({
      categoryTitle: [this.config.data.categoryTitle],
      currentCategories: this.fb.array([]),   
      newSubCategories: this.fb.array([])
    })
  }

  ngOnInit(): void {
      this.currentSubcategories.map((data:any) => {
      this.createCategoryGroup(data)
    })
  }

  createCategoryGroup(data: any) {
    const newCategory =  this.fb.group({
      subCategoryTitle: [data.subCategoryTitle],
      startingValue: [data.startingValue],
      subCategoryValue: [data.subCategoryValue]
    });
    this.currentSubCats.push(newCategory);
  }


  get newSubCats() {
    return this.editForm.get('newSubCategories') as FormArray
  }

  get currentSubCats() {
    return this.editForm.get('currentCategories') as FormArray;
  }

  addNewSubCategory() {
    const newCategory = this.fb.group({
      subCategoryTitle: [],
      subCategoryValue: [],
      startingValue: []
    })
    this.newSubCats.push(newCategory)
  }

  onSubmit(payload: any) {
    let newArray = [...payload.currentCategories, ...payload.newSubCategories]
    console.log(newArray);
    this.ref.close()
  }

  close() {
    this.ref.close();
  }
}