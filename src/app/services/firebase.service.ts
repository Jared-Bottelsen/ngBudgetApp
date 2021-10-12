import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { AngularFireList } from '@angular/fire/compat/database';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  categories?: AngularFireList<any>;

  constructor(private db: AngularFireDatabase) {
  }

  addCategory(categoryData: any) {
    this.db.list('budgetCategory')
    .push(categoryData);
  }

  getCategories() {
    this.categories = this.db.list('budgetCategory');
    return this.categories
  }

  dragAndDropUpdate(categoryData: any) {
    this.db.list('budgetCategory').update('budgetCategory', categoryData);
  }
}
