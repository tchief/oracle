import { Component } from "@angular/core";
import { QuizService } from './services/quiz.service';
import { YesNoQuiz } from './models/quiz.model';

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent {
  constructor(private quizService: QuizService) {
    this.root = this.quizService.getQuiz();
    this.current = this.root;
  }

  title = "Oracle";
  root: YesNoQuiz;
  current: YesNoQuiz;
  get hasCompleted(): boolean {
    return !this.current.hasChildren;
  }

  selected(answer) {
    this.current = this.current.select(answer);
  }
}
