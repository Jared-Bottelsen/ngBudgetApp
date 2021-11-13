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

 /**
  * Method used pull data from the expense-add component to be used in the expense add methods. This simply updates component
  * variables here to be used in both expenseAddQuery and performExpenseSubtraction.
  * @param expenseValue 
  * @param currentValue 
  * @param fullCurrentBudgetCategory 
  */ 
  getExpenseInfo(expenseValue: number, currentValue: string, fullCurrentBudgetCategory: Object) {
    this.expenseValue = expenseValue
    this.currentCategoryValue = currentValue
    this.fullCurrentBudgetCategory = fullCurrentBudgetCategory
  }

 /**
  * Pulls in a copy of the queried subCategory from expenseAddQuery and performs a loop on the array until it finds
  * the subCategory we want to perform an update to. It then takes the current value and the expense value and subtracts them
  * to receive the new value that we will insert back into the db. With this new value, we set the currentCategoryValue to 
  * the new value and then set the fullCurrentBudgetCategory current value to the newly calculated value and push the updated
  * fullCurrentBudgetCategory into the subCategoryCopy which is then set to equal the queried data's subcategory with the 
  * updated information. This updated queriedData is what is used to make the database update at the end of the 
  * expenseAddQuery method. 
  * @param categoryCopy 
  * @param expenseValue 
  * @param currentValue 
  */ 
  private performExpenseSubtraction(categoryCopy: Array<any>, expenseValue: number, currentValue: number) {
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

 /**
  * Takes in an object that contains the current budget object that is being targeted with a new expense. It then
  * runs a query against the database to pull in the document that contains the budget sub category in question. Makes a 
  * copy of the subCategory data and performs the subtraction using the performExpenseSubtraction method. The result of that 
  * method is then used to make a destructive update to the db document to insert the updated version.
  * @param currentBudgetValue 
  */ 
  expenseAddQuery(currentBudgetValue: number) {
    let query = this.database.collection("users").doc(this.auth.userId).collection("budgetCategory", ref => ref.where("subCategory", "array-contains", currentBudgetValue)).get()
    query.subscribe(results => {
      results.forEach(test => {
        this.queriedData = test.data();
        this.subCategoryCopy = this.queriedData.subCategory;
        this.performExpenseSubtraction(this.subCategoryCopy, this.expenseValue, this.currentCategoryValue)
        this.database.collection("users").doc(this.auth.userId).collection("budgetCategory").doc(test.id).update(this.queriedData);
      })
    })
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
}