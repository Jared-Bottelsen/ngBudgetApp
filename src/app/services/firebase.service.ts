import { Injectable } from '@angular/core';
import { AngularFirestore } from "@angular/fire/compat/firestore";
import * as _ from 'lodash'

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

 subCategoryCopy: any;
 currentDocId!: string;
 expenseValue!: string;
 currentCategoryValue: any;
 fullCurrentBudgetCategory: any;
 queriedData: any;

  constructor(private database: AngularFirestore) {
  }

  addCategory(categoryData: any) {
    this.database.collection("budgetCategory").add(categoryData)
  }

  addExpense(expenseData: any) {
    this.database.collection('budgetExpense').add(expenseData);
  }

  getExpenses() {
    return this.database.collection('budgetExpense').valueChanges();
  }

  getCategories() {
    return this.database.collection('budgetCategory').valueChanges();

  }

  getExpenseInfo(expenseValue: string, currentValue: string, fullCurrentBudgetCategory: any) {
    this.expenseValue = expenseValue
    this.currentCategoryValue = currentValue
    this.fullCurrentBudgetCategory = fullCurrentBudgetCategory
  }

  private manipulateCategory(categoryCopy: any[], expenseValue: string, currentValue: any) {
    for (let i = 0; i < categoryCopy.length; i++) {
      if (_.isEqual(categoryCopy[i], this.fullCurrentBudgetCategory)) {
        categoryCopy.splice(i, 1);
        let expenseNum = parseInt(expenseValue);
        let currentNum = parseInt(currentValue);
        let newVal = currentNum - expenseNum;
        let newValString = newVal.toString();
        this.currentCategoryValue = newValString;
        this.fullCurrentBudgetCategory.subCategoryValue = this.currentCategoryValue;
        this.subCategoryCopy.push(this.fullCurrentBudgetCategory);
        this.queriedData.subCategory = this.subCategoryCopy;
        break
      }     
    }
  }

  expenseQuery(currentBudgetValue: any) {
    let query = this.database.collection("budgetCategory", ref => ref.where("subCategory", "array-contains", currentBudgetValue)).get()
    query.subscribe(results => {
      results.forEach(test => {
        this.queriedData = test.data();
        this.subCategoryCopy = this.queriedData.subCategory;
        this.manipulateCategory(this.subCategoryCopy, this.expenseValue, this.currentCategoryValue)
        this.database.collection("budgetCategory").doc(test.id).update(this.queriedData);
      })
    })
  }
}