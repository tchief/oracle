import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Choice, Survey } from 'src/app/models/survey.model';
import { SurveyHelper } from 'src/app/services/survey.helper';
import { SurveyService } from 'src/app/services/survey.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-survey',
  templateUrl: './survey.component.html',
  styleUrls: ['./survey.component.scss'],
})
export class SurveyComponent implements OnInit {
  @Output() next = new EventEmitter<Choice>();
  constructor(
    private surveyService: SurveyService,
    private surveyHelper: SurveyHelper,
    private snackBar: MatSnackBar,
    private activeRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (this.activeRoute.params)
      this.activeRoute.params.subscribe(p => this.select(p));
    this.surveyService.getSurveys().subscribe(all => this.load(all));
    this.hasCompleted$ = this.current$.pipe(
      map((current) => current && !current.hasChildren)
    );
  }

  surveys: Survey[] = [];
  root: Survey;
  current: BehaviorSubject<Choice> = new BehaviorSubject<Choice>(undefined);
  current$: Observable<Choice> = this.current.asObservable();
  hasCompleted$: Observable<boolean>;
  isSubmitted: boolean = false;
  hideChildren: boolean = true;
  isLoading: boolean = true;

  load(all: Survey[]) {
    this.surveys = all;
    this.select(this.surveys.length - 1);
    this.router.navigate([`/${this.root.id}`]);
  }

  navigateByIndex(index) {
    const next = this.surveys[index];
    if (next) this.router.navigate([`/${next.id}`]);
  }

  select(id) {
    if (this.surveys.length) {
      this.root = this.surveys[id] ?? this.surveys.find(s => s.id === id?.surveyId) ?? this.root;
      this.isSubmitted = this.root.isSubmitted;
      this.current.next(this.root.root);
      this.isLoading = false;
    }
  }

  selected(answer) {
    if (this.current.value?.hasChildren && !this.isSubmitted) {
      var nextChoice = this.current.value.select(answer);
      this.current.next(nextChoice);
      this.next.emit(nextChoice);
    }
  }

  save(survey) {
    if (this.isSubmitted || this.current.value?.hasChildren) return;
    this.isLoading = true;
    this.surveyService.submitSurvey(this.root).subscribe(
      (result) => {
        console.log(result);
        this.isSubmitted = true;
        this.isLoading = false;
        this.snackBar.open('Your answers were submitted.', 'Close', { duration: 2000 });
      },
      (error) => {
        console.log(error);
        this.snackBar.open(
          'Could not submit your answers. Please, try again later.',
          'Close',
          { duration: 2000 }
        );
        this.isLoading = false;
      }
    );
  }

  restart(value) {
    if (this.isSubmitted || (this.current.value && !this.current.value?.hasChildren)) {
      this.isLoading = true;
      let index = this.surveys.findIndex(s => s.id === this.root.id);
      this.root = this.surveyHelper.reset(this.root);
      this.surveys[index] = this.root;
      this.current.next(this.root.root);
      this.isSubmitted = false;
      this.isLoading = false;
    }
  }
}
