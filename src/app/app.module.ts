import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from './app.component';
import { PatientComponent } from './patient/patient.component';
import { PatientFormComponent } from './patient-form/patient-form.component';
import { FavDirective } from './fav.directive';
import { HttpClientModule } from '@angular/common/http';
import { SortableDirective } from './sortable.directive';

@NgModule({
  declarations: [
    AppComponent,
    PatientComponent,
    PatientFormComponent,
    FavDirective,
    SortableDirective
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgbModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
