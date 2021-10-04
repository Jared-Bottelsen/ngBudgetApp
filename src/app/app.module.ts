import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

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
import { BudgetAddComponent } from './budget/budget-add/budget-add.component';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; 

@NgModule({
  declarations: [
    AppComponent,
    MainHeaderComponent,
    MobileFooterComponent,
    BudgetOverviewComponent,
    BudgetComponent,
    ProgressBarComponent,
    BudgetAddComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FontAwesomeModule,
    ScrollPanelModule,
    ProgressBarModule,
    DynamicDialogModule,
    BrowserAnimationsModule
  ],

  entryComponents: [
    BudgetAddComponent
  ],

  exports: [
    ProgressBarModule,
    ProgressBarComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
