import { Component, OnInit, HostListener, ElementRef, ViewChild } from '@angular/core';
import { SurveyService } from './services/survey.service';
import { Survey, Choice } from './models/survey.model';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SurveyHelper } from './services/survey.helper';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(private surveyService: SurveyService, private surveyHelper: SurveyHelper, private snackBar: MatSnackBar) {}
  @ViewChild('footer') footerRef: ElementRef;

  ngOnInit(): void {
    this.isLoading = true;
    this.surveyService.getSurveys().subscribe((all) => {
      this.root = all[all.length - 1];
      this.isSubmitted = this.root.submittedForms && this.root.submittedForms.length > 0;
      this.current.next(this.root.root);
      this.isLoading = false;
    });
    this.hasCompleted$ = this.current$.pipe(map((current) => current?.hasChildren));
  }

  title = 'Oracle';
  root: Survey;
  current: BehaviorSubject<Choice> = new BehaviorSubject<Choice>(undefined);
  current$: Observable<Choice> = this.current.asObservable();
  hasCompleted$: Observable<boolean>;
  isSubmitted: boolean = false;
  hideChildren: boolean = true;
  isLoading: boolean = false;

  @HostListener('document:keydown', ['$event'])
  handleKeyboard(event: KeyboardEvent) {
    if (event.key === '[' && this.current.value?.hasChildren && !this.isSubmitted)
      this.selected(true);
    else if (event.key === ']' && this.current.value?.hasChildren && !this.isSubmitted)
      this.selected(false);
    else if (event.key === 'r' && this.isSubmitted)
      this.restart(false);
    else if (event.key === 's' && !this.isSubmitted && !this.current.value?.hasChildren)
      this.save(false);
  }

  selected(answer) {
    this.current.next(this.current.value.select(answer));
    this.footerRef.nativeElement.scrollIntoView({ behavior: "smooth", block: "end"});
  }

  save(survey) {
    this.isLoading = true;
    this.surveyService.submitSurvey(this.root).subscribe(
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
    this.root = this.surveyHelper.reset(this.root);
    this.current.next(this.root.root);
    this.isSubmitted = false;
  }
}
