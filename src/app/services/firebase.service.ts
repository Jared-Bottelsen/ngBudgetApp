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

  constructor(private database: AngularFirestore, private auth: AuthService) {
  }

/**
 * When a user logs in via Google, we add their userId and Displayname information to their db user record if its
 * not there already.
 */
  createUser() {
    this.database.collection('users').doc(this.auth.userId).set({
      userId: this.auth.userId,
      displayName: this.auth.displayName
    }, {merge: true})
  }

/**
 * Adds a new budgetCategory document to the database for the current user
 * @param categoryData 
 */  
  addCategory(categoryData: BudgetCategory) {
    this.database.collection("users").doc(this.auth.userId).collection('budgetCategory').add(categoryData)
  }

/**
 * Adds a new expense document to the database for the current user
 * @param expenseData 
 */  
  addExpense(expenseData: BudgetExpense) {
    this.database.collection('users').doc(this.auth.userId).collection('budgetExpense').add(expenseData);
  }

/**
 * Pulls the data for all expenses for the current user from the database
 * @returns an observable of the budgetExpense collection for the current user ordered by the fullDate timestamp
 */  
  getExpenses() {
    return this.database.collection('users').doc(this.auth.userId).collection('budgetExpense', ref => ref.orderBy("fullDate", "asc")).valueChanges();
  }

/**
 * Pulls the data for all budgetCategories for the current user
 * @returns an observable of the budgetCategory collection of the current user ordered by the categoryTitle
 */  
  getCategories() {
    return this.database.collection('users').doc(this.auth.userId).collection('budgetCategory', ref => ref.orderBy("categoryTitle", "asc")).valueChanges();

  }

/**
 * Make edits to the expense data for individual expense from the budget overview component view
 * @param data 
 */
  updateExpenseData(data: any) {
    let query = this.database.collection("users").doc(this.auth.userId)
    .collection("budgetExpense", ref => ref.where('expenseCategory', '==', data.original.expenseCategory).where('expenseName', '==', data.original.expenseName).where('expenseAmount', '==', data.original.expenseAmount)).get();
    query.subscribe(start => {
      start.forEach(result => {
        this.database.collection("users").doc(this.auth.userId).collection("budgetExpense").doc(result.id).set(data.new, {merge: true});
      })
    })
  }

/**
 * When an expense is added, this method queries the database using the subCategory the expense was logged against. With the returned data
 * the method performs a subtraction operation to take the expense amount away from the subCategory value. It then updates the database accordingly
 * @param budgetCategoryObject 
 */
  expenseSubtractOperation(budgetCategoryObject: any) {
    let query = this.database.collection("users").doc(this.auth.userId)
    .collection("budgetCategory", ref => ref.where("subCategory", "array-contains", budgetCategoryObject.currentBudgetCategoryData)).get();
    query.subscribe(result => {
      result.forEach(data => {
        let queriedData = data.data();
        let subCategoryCopy = queriedData.subCategory;
        for (let i = 0; i < subCategoryCopy.length; i++) {
          if (_.isEqual(subCategoryCopy[i], budgetCategoryObject.currentBudgetCategoryData)) {
            subCategoryCopy.splice(i, 1);
            let newCategoryValue = budgetCategoryObject.currentBudgetCategoryData.subCategoryValue - budgetCategoryObject.submittedData.expenseAmount;
            budgetCategoryObject.currentBudgetCategoryData.subCategoryValue = newCategoryValue;
            subCategoryCopy.push(budgetCategoryObject.currentBudgetCategoryData)
            this.database.collection("users").doc(this.auth.userId).collection("budgetCategory").doc(data.id).update(queriedData);
            break
          }
        }
      })
    })
  }

/**
 * When an expense is deleted this method queries the database using the subCategory the expense was logged against. With the returned data
 * the method performs an addition operation to add the money back to that subCategory value since the expense has been deleted and is no longer 
 * effecting the value of the subCategory. The final step of the method is to make the change to the database to reflect the value of the subCategory 
 * after the operation has been completed. 
 * @param budgetCategoryObject 
 */
  expenseDeleteOperation(budgetCategoryObject: any) {
    let query = this.database.collection("users").doc(this.auth.userId)
    .collection("budgetCategory", ref => ref.where("subCategory", "array-contains", budgetCategoryObject.currentBudgetCategoryData)).get();
    query.subscribe(result => {
      result.forEach(data => {
        let queriedData = data.data();
        let subCategoryCopy = queriedData.subCategory;
        for (let i = 0; i < subCategoryCopy.length; i++) {
          if (_.isEqual(subCategoryCopy[i], budgetCategoryObject.currentBudgetCategoryData)) {
            subCategoryCopy.splice(i, 1);
            let newCategoryValue = budgetCategoryObject.currentBudgetCategoryData.subCategoryValue + budgetCategoryObject.submittedData.expenseAmount;
            budgetCategoryObject.currentBudgetCategoryData.subCategoryValue = newCategoryValue;
            subCategoryCopy.push(budgetCategoryObject.currentBudgetCategoryData)
            this.database.collection("users").doc(this.auth.userId).collection("budgetCategory").doc(data.id).update(queriedData);
            break
          }
        }
      })
    })
  }

 /**
  * Delete an individual expense from the budget overview component view through the expense edit modal
  * @param expenseName 
  * @param expenseAmount 
  * @param expenseCategory 
  */ 
  deleteExpense(expenseName: string, expenseAmount: number, expenseCategory: string) {
    let query = this.database.collection("users").doc(this.auth.userId)
    .collection("budgetExpense", ref => ref.where("expenseName", "==", expenseName).where("expenseAmount", "==", expenseAmount).where("expenseCategory", "==", expenseCategory)).get();
    query.subscribe(result => {
      result.forEach(final => {
        this.database.collection("users").doc(this.auth.userId).collection("budgetExpense").doc(final.id).delete();
      })
    })
  }

/**
 * Edit a budget category through the budget edit modal. This method performs a merge of the edits into the current
 * budget category
 * @param currentSubcategories 
 * @param editedPayload 
 */
  updateBudgetCategoryData(currentSubcategories: Array<any>, editedPayload: BudgetCategory) {
    let query = this.database.collection("users").doc(this.auth.userId).collection("budgetCategory", ref => ref.where("subCategory", "==", currentSubcategories)).get();
    query.subscribe(results => {
      results.forEach(result => {
        this.database.collection("users").doc(this.auth.userId).collection("budgetCategory").doc(result.id).set(editedPayload, {merge: true})
      })
    })
  }

  /**
 * Delete an entire document from the database. This is mostly used for the budget categories in the budget component.
 * The delete button in the budget edit modal fires off this method.
 * @param data 
 * @param collection 
 * @param queryParam 
 */
   deleteDocument(data: Object, collection: string, queryParam: string) {
    let query = this.database.collection("users").doc(this.auth.userId).collection(collection, ref => ref.where(queryParam, "==", data)).get();
    query.subscribe(first => {
      first.forEach(result => {
        this.database.collection("users").doc(this.auth.userId).collection(collection).doc(result.id).delete();
      })
    })
  }
}