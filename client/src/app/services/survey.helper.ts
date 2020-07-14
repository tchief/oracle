import { Injectable } from '@angular/core';
import { Survey, Choice, Form } from '../models/survey.model';

@Injectable({
  providedIn: 'root',
})
export class SurveyHelper {

  buildForm(survey: Survey): Form {
    return { userName: new Date().toISOString(), surveyId: survey.id, choicesMade: survey.root.getSelectedIds() };
  }
  
  reset(survey: Survey): Survey {
    return this.buildSurvey(survey);
  }

  buildSurveyWithForm(survey: Survey): Survey {
    let newSurvey = this.buildSurvey(survey);
    newSurvey.root = this.applyFirstSubmitted(newSurvey);
    return newSurvey;
  }

  private buildSurvey(survey: Survey): Survey {
    return { ...survey, root: this.buildSurveyFromRoot(survey.root, true) };
  }

  private buildSurveyFromRoot(root: Choice, isRoot: boolean = false): Choice {
    return root
      ? new Choice(
          root.id,
          root.question,
          this.buildSurveyFromRoot(root.left),
          this.buildSurveyFromRoot(root.right),
          isRoot)
      : root;
  }

  private applyFirstSubmitted(survey: Survey): Choice {
    if (survey.submittedForms && survey.submittedForms.length > 0) {
      survey.root.setSelectedIds(survey.submittedForms[survey.submittedForms.length-1].choicesMade);
    }
    
    return survey.root;
  }
}
