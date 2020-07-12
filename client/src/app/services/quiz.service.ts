import { HttpClient } from '@angular/common/http';
import { Injectable, Inject } from "@angular/core";
import { YesNoQuiz } from '../models/quiz.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: "root",
})
export class QuizService {
  constructor(private http: HttpClient) {}

  getQuizzes(): Observable<YesNoQuiz[]> {
    return this.http
      .get<YesNoQuiz[]>(`${environment.apiUrl}/quiz`)
      .pipe(map(all => all.map(i => YesNoQuiz.buildFromRoot(i))), map(_ => [this.getMockedQuiz()]));
  }

  getMockedQuiz(): YesNoQuiz {
    return new YesNoQuiz(
      "1",
      "Do I want a doughnut?",
      new YesNoQuiz(
        "2",
        "Maybe you want an apple?",
      ),
      new YesNoQuiz(
        "3",
        "Do I deserve it?",
        new YesNoQuiz(
          "4",
          "Is it a good doughnut?",
          new YesNoQuiz("5", "Wait 'till you find a sinful unforgettable doughnut."),
          new YesNoQuiz("6", "What are you waiting for? Grab it now.")
        ),
        new YesNoQuiz(
          "7",
          "Are you sure?",
          new YesNoQuiz("8", "Do jumping jacks first."),
          new YesNoQuiz("9", "Get it.")
        )),
        true
    );
  }
}
