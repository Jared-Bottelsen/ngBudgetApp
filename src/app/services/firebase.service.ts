import { Injectable } from '@angular/core';
import { AngularFirestore } from "@angular/fire/compat/firestore";

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

 
  constructor(private database: AngularFirestore) {
  }

  addCategory(categoryData: any) {
    this.database.collection("budgetCategory").add(categoryData)
  }

  addExpense(expenseData: any) {
    this.database.collection('budgetExpense').add(expenseData);
  }

  getExpenses() {
    return this.database.collection('budgetExpense').snapshotChanges();
  }

  getCategories() {
    return this.database.collection('budgetCategory').snapshotChanges();

  }
}
