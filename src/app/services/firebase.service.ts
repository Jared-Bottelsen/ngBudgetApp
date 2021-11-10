import { Injectable } from '@angular/core';
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { AuthService } from './auth.service';
import * as _ from 'lodash'

interface BudgetCategory {
  categoryTitle: string,
  subCategory: Array<string>,
}
@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

 subCategoryCopy: any;
 currentDocId!: string;
 expenseValue!: number;
 currentCategoryValue: any;
 fullCurrentBudgetCategory: any;
 queriedData: any;

  constructor(private database: AngularFirestore, private auth: AuthService) {
  }

  createUser() {
    this.database.collection('users').doc(this.auth.userId).set({
      userId: this.auth.userId,
      displayName: this.auth.displayName
    }, {merge: true})
  }

  addCategory(categoryData: any) {
    this.database.collection("users").doc(this.auth.userId).collection('budgetCategory').add(categoryData)
  }

  addExpense(expenseData: any) {
    this.database.collection('users').doc(this.auth.userId).collection('budgetExpense').add(expenseData);
    // this.database.collection('budgetExpense').add(expenseData);
  }

  getExpenses() {
    return this.database.collection('users').doc(this.auth.userId).collection('budgetExpense', ref => ref.orderBy("expenseDate", "asc")).valueChanges();
    // return this.database.collection("budgetExpense", ref => ref.orderBy("expenseDate", "asc")).valueChanges();
  }

  getCategories() {
    return this.database.collection('users').doc(this.auth.userId).collection('budgetCategory', ref => ref.orderBy("categoryTitle", "asc")).valueChanges();
    // return this.database.collection('budgetCategory', ref => ref.orderBy("categoryTitle", "asc")).valueChanges()

  }

  deleteDocument(subCategories: any) {
    let query = this.database.collection("users").doc(this.auth.userId).collection("budgetCategory", ref => ref.where("subCategory", "==", subCategories)).get();
    query.subscribe(first => {
      first.forEach(result => {
        this.database.collection("users").doc(this.auth.userId).collection("budgetCategory").doc(result.id).delete();
      })
    })
  }

  getExpenseInfo(expenseValue: number, currentValue: string, fullCurrentBudgetCategory: any) {
    this.expenseValue = expenseValue
    this.currentCategoryValue = currentValue
    this.fullCurrentBudgetCategory = fullCurrentBudgetCategory
  }

  private manipulateCategory(categoryCopy: any[], expenseValue: number, currentValue: any) {
    for (let i = 0; i < categoryCopy.length; i++) {
      if (_.isEqual(categoryCopy[i], this.fullCurrentBudgetCategory)) {
        categoryCopy.splice(i, 1);
        let newValString = currentValue - expenseValue;
        this.currentCategoryValue = newValString;
        this.fullCurrentBudgetCategory.subCategoryValue = this.currentCategoryValue;
        this.subCategoryCopy.push(this.fullCurrentBudgetCategory);
        this.queriedData.subCategory = this.subCategoryCopy;
        break
      }     
    }
  }

  expenseQuery(currentBudgetValue: any) {
    let query = this.database.collection("users").doc(this.auth.userId).collection("budgetCategory", ref => ref.where("subCategory", "array-contains", currentBudgetValue)).get()
    query.subscribe(results => {
      results.forEach(test => {
        this.queriedData = test.data();
        this.subCategoryCopy = this.queriedData.subCategory;
        this.manipulateCategory(this.subCategoryCopy, this.expenseValue, this.currentCategoryValue)
        this.database.collection("users").doc(this.auth.userId).collection("budgetCategory").doc(test.id).update(this.queriedData);
      })
    })
  }

  updateBudgetCategoryData(currentSubcategories: any[], editedPayload: BudgetCategory) {
    let query = this.database.collection("users").doc(this.auth.userId).collection("budgetCategory", ref => ref.where("subCategory", "==", currentSubcategories)).get();
    query.subscribe(results => {
      results.forEach(result => {
        this.database.collection("users").doc(this.auth.userId).collection("budgetCategory").doc(result.id).set(editedPayload, {merge: true})
      })
    })
  }
}