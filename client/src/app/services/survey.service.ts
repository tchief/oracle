import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Survey, Form, Choice } from '../models/survey.model';
import { SurveyHelper } from './survey.helper';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SurveyService {
  constructor(private http: HttpClient, private surveyHelper: SurveyHelper) {}

  getSurveys(): Observable<Survey[]> {
    return this.http.get<Survey[]>(`${environment.apiUrl}/survey`).pipe(
      map((all) => all.map((i) => this.surveyHelper.buildSurveyWithForm(i))),
      catchError((error) => this.getMockedSurveys())
    );
  }

  submitSurvey(survey: Survey) {
    let form = this.surveyHelper.buildForm(survey);
    return this.http.post<Form>(`${environment.apiUrl}/survey/`, form).pipe(
      tap((r) => survey.submittedForms.push(form)),
      catchError((error) => throwError(error))
    );
  }

  getMockedSurveys(): Observable<Survey[]> {
    const root = new Choice(
      1,
      'Do I want a doughnut?',
      new Choice(2, 'Maybe you want an apple?'),
      new Choice(
        3,
        'Do I deserve it?',
        new Choice(
          4,
          'Is it a good doughnut?',
          new Choice(5, "Wait 'till you find a sinful unforgettable doughnut."),
          new Choice(6, 'What are you waiting for? Grab it now.')
        ),
        new Choice(
          7,
          'Are you sure?',
          new Choice(8, 'Do jumping jacks first.'),
          new Choice(9, 'Get it.')
        )
      ),
      true
    );

    const survey = new Survey('dougnut', 'Doughnut', root, []);
    return of([survey]);
  }
}
