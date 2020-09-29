import { Injectable } from '@angular/core';
import { Observable, throwError, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Survey, Form, Choice } from '../models/survey.model';
import { SurveyHelper } from './survey.helper';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

// TODO: Move to separate files, generate types.
interface SurveysResponse {
  surveys: Survey[];    
}

const SurveysQuery =
gql`query Surveys {
  surveys {
    id
    name
    root
    submittedForms {
      choicesMade
      surveyId
      userName
    }
  }
}`; 

const SubmitFormMutation = 
gql`mutation SubmitForm($surveyId: uuid!, $userName: String!, $choicesMade: json!) {
  insert_forms_one(object: {surveyId: $surveyId, userName: $userName, choicesMade: $choicesMade}) {
    __typename,
    id,
    surveyId,
    userName,
    choicesMade
  }
}`;

// TODO: Caching, consider requery item(s) on submit (as server-side rules can be applied).
// TODO: For 'Akinator' domain, query server for next choice.
@Injectable({
  providedIn: 'root',
})
export class SurveyService {
  constructor(private apollo: Apollo, private surveyHelper: SurveyHelper) {}

  getSurveys(): Observable<Survey[]> {
    return this.apollo.query<SurveysResponse>({query: SurveysQuery}).pipe(
      map(({ data }) => data.surveys.map((i) => this.surveyHelper.buildSurveyWithForm(i))),
      catchError((error) => this.getMockedSurveys())
    );
  }

  submitSurvey(survey: Survey) {
    let form = this.surveyHelper.buildForm(survey);
    return this.apollo.mutate<Form>({mutation: SubmitFormMutation, variables: form}).pipe(
      tap((r) => survey.submittedForms = survey.submittedForms.concat(form)),
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
