import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentData } from "@angular/fire/compat/firestore";
import { AuthService } from './auth.service';
import * as _ from 'lodash'

export interface BudgetCategory {
  categoryTitle: string,
  subCategory: any[],
}

interface BudgetExpense {
  parentDocId: string,
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
    let newCategory = this.database.collection("users").doc(this.auth.userId).collection('budgetCategory').doc();
    for (let i = 0; i < categoryData.subCategory.length; i++) {
      categoryData.subCategory[i].parentDocId = newCategory.ref.id
    }
    newCategory.set({
      docId: newCategory.ref.id,
      categoryTitle: categoryData.categoryTitle,
      subCategory: categoryData.subCategory,
    })
  }

/**
 * Adds a new expense document to the database for the current user
 * @param expenseData 
 */  
  addExpense(expenseData: BudgetExpense) {
    this.database.collection('users').doc(this.auth.userId).collection('budgetExpense').add(expenseData);
  }

/**
 * Adds a new income document to the database for the current user
 * @param incomeData 
 */
  addIncome(incomeData: DocumentData) {
    this.database.collection("users").doc(this.auth.userId).set(incomeData, {merge: true});
  }

  addBudgetToArchive(archiveTitle: string ,budgetTotal: number, totalIncome: number, expenses: Array<any>, totalSpent: number) {
    let archive = this.database.collection("users").doc(this.auth.userId).collection("budgetArchive").doc();
    archive.set({
      archiveTitle: archiveTitle,
      docId: archive.ref.id,
      dateArchived: new Date(),
      totalBudgeted: budgetTotal,
      income: totalIncome,
      expenses: expenses,
      totalSpent: totalSpent
    })
  }

  getBudgetArchive() {
    this.database.collection("users").doc(this.auth.userId). collection("budgetArchive", ref => ref.orderBy("dateArchived", "desc")).valueChanges();
  }

/**
 * 
 * @returns Income data from the budgetIncome collection for the logged in user.
 */
  getIncome() {
    return this.database.collection("users").doc(this.auth.userId).valueChanges();
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
 * Used to delete all related expenses to a subCategory that is being deleted. This is needed 
 * because if the subCategory is deleted then the left over expenses logged against that 
 * subCategory will not be deletable because their subCategory parent is gone.
 * @param subCategoryTitle 
 */
  deleteExpensesOfDeletedSubCategory(subCategoryTitle: string, parentDocId: string) {
    let query = this.database.collection("users").doc(this.auth.userId).collection("budgetExpense", ref => ref.where("expenseCategory", '==', subCategoryTitle).where("parentDocId", 
  "==", parentDocId)).get();
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
  updateBudgetCategoryData(docId: string, editedPayload: BudgetCategory) {
    this.database.collection("users").doc(this.auth.userId).collection("budgetCategory").doc(docId).set(editedPayload, {merge: true});
  }

  /**
 * Delete an entire document from the database. This is mostly used for the budget categories in the budget component.
 * The delete button in the budget edit modal fires off this method.
 * @param data 
 * @param collection 
 * @param queryParam 
 */
   deleteDocument(docId: string, collection: string) {
    this.database.collection("users").doc(this.auth.userId).collection(collection).doc(docId).delete();
  }

  resetWholeBudget() {
    this.database.collection("users").doc(this.auth.userId).collection("budgetCategory").get().subscribe(options => {
      options.forEach(result => {
        let category = result.data()
        for (let i = 0; i < category.subCategory.length; i++) { 
          category.subCategory[i].subCategoryValue = category.subCategory[i].startingValue;
        }
        this.database.collection("users").doc(this.auth.userId).collection("budgetCategory").doc(result.id).set(category, {merge: true});
      })
    })
    this.database.collection("users").doc(this.auth.userId).collection("budgetExpense").get().subscribe(result => {
      result.forEach(final => {
        this.database.collection("users").doc(this.auth.userId).collection("budgetExpense").doc(final.id).delete();
      })
    })
  }
}