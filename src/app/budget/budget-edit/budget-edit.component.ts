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

  editForm: FormGroup;

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
  }

  deleteCurrentSubcategory(i: number) {
    if (this.config.data.subCategories[i].subCategoryValue < this.config.data.subCategories[i].startingValue) {
      this.db.deleteExpensesOfDeletedSubCategory(this.config.data.subCategories[i].subCategoryTitle, this.config.data.docId);
      this.currentSubCats.removeAt(i);
      return
    }
    this.currentSubCats.removeAt(i);
  }

  deleteNewSubcategory(i: number) {
    this.newSubCats.removeAt(i);
  }

  deleteEntireCategory() {
    for (let i = 0; i < this.currentSubcategories.length; i++) {
      this.db.deleteExpensesOfDeletedSubCategory(this.currentSubcategories[i].subCategoryTitle, this.config.data.docId);
    }
    this.db.deleteDocument(this.config.data.docId, 'budgetCategory');
    setTimeout(() => {
      this.ref.close();
    }, 500);
  }

  onSubmit(payload: any) {
    if (_.isEqual(payload.currentCategories, this.currentSubcategories) && this.config.data.categoryTitle === payload.categoryTitle && payload.newSubCategories.length === 0) {
      this.ref.close();
    }
     for (let i = 0; i < payload.currentCategories.length; i++) {
       payload.currentCategories[i].parentDocId = this.config.data.docId;
       if(payload.currentCategories[i].subCategoryValue === null) {
        payload.currentCategories[i].subCategoryValue = payload.currentCategories[i].startingValue;
       } else if (this.config.data.subCategories[i].subCategoryValue < this.config.data.subCategories[i].startingValue) {
         let difference = this.config.data.subCategories[i].startingValue - this.config.data.subCategories[i].subCategoryValue;
         payload.currentCategories[i].subCategoryValue = payload.currentCategories[i].startingValue - difference;
       } else {
         payload.currentCategories[i].subCategoryValue = payload.currentCategories[i].startingValue
       }
     }
     for (let i = 0; i < payload.newSubCategories.length; i++) {
        payload.newSubCategories[i].parentDocId = this.config.data.docId;
        payload.newSubCategories[i].subCategoryValue = payload.newSubCategories[i].startingValue;
     }
    let newArray = [...payload.currentCategories, ...payload.newSubCategories];
    let returnedObject = {
      categoryTitle: payload.categoryTitle,
      subCategory: newArray
    }
    this.db.updateBudgetCategoryData(this.config.data.docId, returnedObject);
    this.ref.close()  
}

  close() {
    this.ref.close();
  }
}