import { AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { delay } from 'rxjs/operators';
import { SurveyComponent } from './components/survey/survey.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements AfterViewInit {
  @ViewChild('sidenav') sidenavRef: MatSidenav;
  @ViewChild('footer') footerRef: ElementRef;
  @ViewChild('survey') surveyRef: SurveyComponent;
  title = 'Oracle';

  ngAfterViewInit(): void {
    this.surveyRef.current$
      .pipe(delay(100))
      .subscribe((_) => this.scrollToFooter());
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboard(event: KeyboardEvent) {
    if (event.key === '[') this.surveyRef.selected(true);
    else if (event.key === ']') this.surveyRef.selected(false);
    else if (event.key === 'r') this.surveyRef.restart(false);
    else if (event.key === 's') this.surveyRef.save(false);
    else if (event.key === 'l') this.sidenavRef.toggle();
  }

  scrollToFooter() {
    this.footerRef.nativeElement.scrollIntoView({
      behavior: 'smooth',
      block: 'end',
    });
  }
}
