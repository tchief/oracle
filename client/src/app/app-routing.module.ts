import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SurveyComponent } from './components/survey/survey.component';

// TODO: 404, separate component on ''.
const routes: Routes = [
  {
    path: '',
    component: SurveyComponent
  },
  {
    path: ':surveyId',
    component: SurveyComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
