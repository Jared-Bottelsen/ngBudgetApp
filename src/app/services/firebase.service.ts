import { Injectable } from '@angular/core';
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { AuthService } from './auth.service';
import * as _ from 'lodash'

interface BudgetCategory {
  categoryTitle: string,
  subCategory: Array<string>,
}

interface BudgetExpense {
  expenseAmount: number,
  expenseCategory: string,
  expenseDate: string,
  expenseName: string,
  fullDate: Date
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

  addCategory(categoryData: BudgetCategory) {
    this.database.collection("users").doc(this.auth.userId).collection('budgetCategory').add(categoryData)
  }

  addExpense(expenseData: BudgetExpense) {
    this.database.collection('users').doc(this.auth.userId).collection('budgetExpense').add(expenseData);
  }

  getExpenses() {
    return this.database.collection('users').doc(this.auth.userId).collection('budgetExpense', ref => ref.orderBy("fullDate", "asc")).valueChanges();
  }

  getCategories() {
    return this.database.collection('users').doc(this.auth.userId).collection('budgetCategory', ref => ref.orderBy("categoryTitle", "asc")).valueChanges();

  }

  deleteDocument(data: Object, collection: string, queryParam: string) {
    let query = this.database.collection("users").doc(this.auth.userId).collection(collection, ref => ref.where(queryParam, "==", data)).get();
    query.subscribe(first => {
      first.forEach(result => {
        this.database.collection("users").doc(this.auth.userId).collection(collection).doc(result.id).delete();
      })
    })
  }

  getExpenseInfo(expenseValue: number, currentValue: string, fullCurrentBudgetCategory: Object) {
    this.expenseValue = expenseValue
    this.currentCategoryValue = currentValue
    this.fullCurrentBudgetCategory = fullCurrentBudgetCategory
  }

  private manipulateCategory(categoryCopy: Array<any>, expenseValue: number, currentValue: number) {
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

  expenseAddQuery(currentBudgetValue: number) {
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

  updateExpenseData(data: any) {
    let query = this.database.collection("users").doc(this.auth.userId)
    .collection("budgetExpense", ref => ref.where('expenseCategory', '==', data.original.expenseCategory).where('expenseName', '==', data.original.expenseName).where('expenseAmount', '==', data.original.expenseAmount)).get();
    query.subscribe(start => {
      start.forEach(result => {
        this.database.collection("users").doc(this.auth.userId).collection("budgetExpense").doc(result.id).set(data.new, {merge: true});
      })
    })
  }

  deleteExpense(expenseName: string, expenseAmount: number, expenseCategory: string) {
    let query = this.database.collection("users").doc(this.auth.userId)
    .collection("budgetExpense", ref => ref.where("expenseName", "==", expenseName).where("expenseAmount", "==", expenseAmount).where("expenseCategory", "==", expenseCategory)).get();
    query.subscribe(result => {
      result.forEach(final => {
        this.database.collection("users").doc(this.auth.userId).collection("budgetExpense").doc(final.id).delete();
      })
    })
  }

  updateBudgetCategoryData(currentSubcategories: Array<any>, editedPayload: BudgetCategory) {
    let query = this.database.collection("users").doc(this.auth.userId).collection("budgetCategory", ref => ref.where("subCategory", "==", currentSubcategories)).get();
    query.subscribe(results => {
      results.forEach(result => {
        this.database.collection("users").doc(this.auth.userId).collection("budgetCategory").doc(result.id).set(editedPayload, {merge: true})
      })
    })
  }
}