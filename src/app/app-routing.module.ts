import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BudgetOverviewComponent } from './budget-overview/budget-overview.component';
import { BudgetComponent } from './budget/budget.component';
import { ExpenseAddComponent } from './budget/expense-add/expense-add.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './services/auth.guard';

const routes: Routes = [
  {path: '', redirectTo: 'login', pathMatch: 'full'},
  {path: 'login', component: LoginComponent},
  {path: 'budget', component: BudgetComponent, canActivate: [AuthGuard]},
  {path: 'overview', component: BudgetOverviewComponent, canActivate: [AuthGuard]},
  {path: 'add-expense', component: ExpenseAddComponent, canActivate: [AuthGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
