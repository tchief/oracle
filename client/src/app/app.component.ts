import { Component, OnInit } from '@angular/core';
import { QuizService } from './services/quiz.service';
import { YesNoQuiz } from './models/quiz.model';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(private quizService: QuizService) {}

  ngOnInit(): void {
    this.quizService.getQuizzes().subscribe(all => {
      this.root = all[0];
      this.current.next(all[0]);
    });
    this.hasCompleted$ = this.current.pipe(map(current => !current.hasChildren));
  }

  title = 'Oracle';
  root: YesNoQuiz;
  current: BehaviorSubject<YesNoQuiz> = new BehaviorSubject<YesNoQuiz>(undefined);
  current$: Observable<YesNoQuiz> = this.current.asObservable();
  hasCompleted$: Observable<boolean>;
  hideChildren: boolean = true;

  selected(answer) {
    this.current.next(this.current.value.select(answer));
  }
}
