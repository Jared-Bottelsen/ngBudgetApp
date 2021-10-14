import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BudgetOverviewComponent } from './budget-overview/budget-overview.component';
import { BudgetAddComponent } from './budget/budget-add/budget-add.component';
import { BudgetComponent } from './budget/budget.component';
import { ExpenseAddComponent } from './budget/expense-add/expense-add.component';

const routes: Routes = [
  {path: 'budget', component: BudgetComponent},
  {path: 'overview', component: BudgetOverviewComponent},
  {path: 'add-expense', component: ExpenseAddComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
