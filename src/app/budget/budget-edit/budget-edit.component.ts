import { Component, OnInit } from '@angular/core';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog'; 
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { FirebaseService } from 'src/app/services/firebase.service';
import * as _ from 'lodash';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-budget-edit',
  templateUrl: './budget-edit.component.html',
  styleUrls: ['./budget-edit.component.scss']
})
export class BudgetEditComponent implements OnInit {

  currentSubcategories: any = []

  editForm!: FormGroup;

  isDeleteButtonVisibleCurrent: number = -1;

  isDeleteButtonVisibleNew: number = -1;

  faTimes = faTimes;

  constructor(private ref: DynamicDialogRef, private config: DynamicDialogConfig, private fb: FormBuilder, private db: FirebaseService) { 
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
    this.newSubCats.push(newCategory);
    this.isDeleteButtonVisibleCurrent = -1;
    this.isDeleteButtonVisibleNew = -1;
  }

  deleteCurrentSubcategory(i: number) {
    if (this.config.data.subCategories[i].subCategoryValue < this.config.data.subCategories[i].startingValue) {
      console.log('Cant Delete without removing expenses');
      this.db.deleteExpensesOfDeletedSubCategory(this.config.data.subCategories[i].subCategoryTitle);
      this.currentSubCats.removeAt(i);
      this.isDeleteButtonVisibleCurrent = -1;
      this.isDeleteButtonVisibleNew = -1;  
      return
    }
    this.currentSubCats.removeAt(i);
    this.isDeleteButtonVisibleCurrent = -1;
    this.isDeleteButtonVisibleNew = -1;
  }

  deleteNewSubcategory(i: number) {
    this.newSubCats.removeAt(i);
    this.isDeleteButtonVisibleCurrent = -1;
    this.isDeleteButtonVisibleNew = -1;
  }

  deleteEntireCategory() {
    for (let i = 0; i < this.currentSubcategories.length; i++) {
      this.db.deleteExpensesOfDeletedSubCategory(this.currentSubcategories[i].subCategoryTitle);
    }
    this.db.deleteDocument(this.currentSubcategories, 'budgetCategory', 'subCategory');
    setTimeout(() => {
      this.ref.close();
    }, 500);
  }

  showDeleteButtonCurrent(i: number) {
    this.isDeleteButtonVisibleNew = -1
    this.isDeleteButtonVisibleCurrent = i;
  }

  showDeleteButtonNew(i: number) {
    this.isDeleteButtonVisibleNew = i
    this.isDeleteButtonVisibleCurrent = -1
  }

  onSubmit(payload: any) {
    if (_.isEqual(payload.currentCategories, this.currentSubcategories) && this.config.data.categoryTitle === payload.categoryTitle && payload.newSubCategories.length === 0) {
      this.ref.close();
      console.log("No updates were made");
    } else {
     for (let i = 0; i < payload.currentCategories.length; i++) {
       if(payload.currentCategories[i].subCategoryValue === null) {
        payload.currentCategories[i].subCategoryValue = payload.currentCategories[i].startingValue;
       } else if (this.config.data.subCategories[i].subCategoryValue < this.config.data.subCategories[i].startingValue) {
         let difference = this.config.data.subCategories[i].startingValue - this.config.data.subCategories[i].subCategoryValue;
         payload.currentCategories[i].subCategoryValue = payload.currentCategories[i].startingValue - difference;
       }
     }
     for (let i = 0; i < payload.newSubCategories.length; i++) {
        payload.newSubCategories[i].subCategoryValue = payload.newSubCategories[i].startingValue;
     }
    let newArray = [...payload.currentCategories, ...payload.newSubCategories];
    let returnedObject = {
      categoryTitle: payload.categoryTitle,
      subCategory: newArray
    }
    this.db.updateBudgetCategoryData(this.currentSubcategories, returnedObject);
    this.ref.close()  
  }
}

  close() {
    this.ref.close();
  }
}