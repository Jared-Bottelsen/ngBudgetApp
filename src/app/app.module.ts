import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AngularFireDatabaseModule} from "@angular/fire/compat/database";
import { environment } from "../environments/environment";
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from "@angular/fire/compat/firestore";
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainHeaderComponent } from './main-header/main-header.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MobileFooterComponent } from './mobile-footer/mobile-footer.component';
import { BudgetOverviewComponent } from './budget-overview/budget-overview.component';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { ProgressBarModule } from 'primeng/progressbar';
import { BudgetComponent } from './budget/budget.component';
import { ProgressBarComponent } from './budget/progress-bar/progress-bar.component';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { BudgetAddComponent } from './budget/budget-add/budget-add.component';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; 
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ReactiveFormsModule } from '@angular/forms';
import { ExpenseAddComponent } from './budget/expense-add/expense-add.component';
import { SelectButtonModule } from 'primeng/selectbutton';
import { FormsModule } from '@angular/forms';
import { MultiSelectModule } from 'primeng/multiselect';
import { ButtonModule } from 'primeng/button';
import { BudgetEditComponent } from './budget/budget-edit/budget-edit.component';
import { InputTextModule } from 'primeng/inputtext';
import { LoginComponent } from './login/login.component';
import { MenuModule } from 'primeng/menu';
import { IncomeAddComponent } from './budget-overview/income-add/income-add.component';
import { AutofocusDirective } from './directives/autofocus.directive';
import { ArchiveTitleComponent } from './budget/archive-title/archive-title.component';
import { BudgetArchiveComponent } from './budget/budget-archive/budget-archive.component';
import { RealtimeOverviewComponent } from './budget-overview/realtime-overview/realtime-overview.component';
@NgModule({
    declarations: [
        AppComponent,
        MainHeaderComponent,
        MobileFooterComponent,
        BudgetOverviewComponent,
        BudgetComponent,
        ProgressBarComponent,
        BudgetAddComponent,
        ExpenseAddComponent,
        BudgetEditComponent,
        LoginComponent,
        IncomeAddComponent,
        AutofocusDirective,
        ArchiveTitleComponent,
        BudgetArchiveComponent,
        RealtimeOverviewComponent,
    ],
    imports: [
        AngularFireModule.initializeApp(environment.firebaseConfig),
        AngularFireDatabaseModule,
        AngularFirestoreModule,
        BrowserModule,
        AppRoutingModule,
        FontAwesomeModule,
        ScrollPanelModule,
        ProgressBarModule,
        DynamicDialogModule,
        BrowserAnimationsModule,
        DragDropModule,
        ReactiveFormsModule,
        SelectButtonModule,
        FormsModule,
        MultiSelectModule,
        ButtonModule,
        InputTextModule,
        MenuModule,
        ConfirmPopupModule
    ],
    exports: [
        ProgressBarModule,
        ProgressBarComponent
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
