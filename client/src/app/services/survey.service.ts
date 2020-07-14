import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Survey, Form } from '../models/survey.model';
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
      catchError(error => throwError(error))
    );
  }

  submitSurvey(survey: Survey) {
    let form = this.surveyHelper.buildForm(survey);
    return this.http
      .post<Form>(`${environment.apiUrl}/survey/`, form)
      .pipe(tap(r => survey.submittedForms.push(form)), catchError((error) => throwError(error)));
  }
}
