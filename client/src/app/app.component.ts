import { Component, OnInit, HostListener, ElementRef, ViewChild } from '@angular/core';
import { QuizService } from './services/quiz.service';
import { YesNoQuiz } from './models/quiz.model';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(private quizService: QuizService, private snackBar: MatSnackBar) {}
  @ViewChild('footer') footerRef: ElementRef;

  ngOnInit(): void {
    this.isLoading = true;
    this.quizService.getQuizzes().subscribe((all) => {
      this.root = all[all.length - 1];
      this.current.next(all[all.length - 1]);
      this.isSubmitted = this.root.isSubmitted;
      this.isLoading = false;
    });
    this.hasCompleted$ = this.current$.pipe(map((current) => current?.hasChildren));
  }

  title = 'Oracle';
  root: YesNoQuiz;
  current: BehaviorSubject<YesNoQuiz> = new BehaviorSubject<YesNoQuiz>(undefined);
  current$: Observable<YesNoQuiz> = this.current.asObservable();
  hasCompleted$: Observable<boolean>;
  isSubmitted: boolean = false;
  hideChildren: boolean = true;
  isLoading: boolean = false;

  @HostListener('document:keydown', ['$event'])
  handleKeyboard(event: KeyboardEvent) {
    if (event.key === '[' && this.current.value?.hasChildren)
      this.selected(true);
    else if (event.key === ']' && this.current.value?.hasChildren)
      this.selected(false);
    else if (event.key === 'r' && this.root.isSubmitted)
      this.restart(false);
    else if (event.key === 's' && !this.root.isSubmitted && !this.current.value?.hasChildren)
      this.save(false);
  }

  selected(answer) {
    this.current.next(this.current.value.select(answer));
    this.footerRef.nativeElement.scrollIntoView({ behavior: "smooth", block: "end"});
  }

  save(quiz) {
    this.isLoading = true;
    this.quizService.submitQuiz(this.root).subscribe(
      (result) => {
        console.log(result);
        this.isSubmitted = true;
        this.isLoading = false;
        this.snackBar.open('Your answers were submitted.', 'Close');
      },
      (error) => {
        console.log(error);
        this.snackBar.open('Could not submit your answers. Please, try again later.', 'Close');
        this.isLoading = false;
      }
    );
  }

  restart(value) {
    this.root = YesNoQuiz.buildFromRoot(this.root, true);
    this.current.next(this.root);
    this.isSubmitted = false;
  }
}
