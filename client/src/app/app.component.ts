import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { delay } from 'rxjs/operators';
import { SurveyComponent } from './components/survey/survey.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  @ViewChild('sidenav') sidenavRef: MatSidenav;
  @ViewChild('footer') footerRef: ElementRef;
  @ViewChild('survey') surveyRef: SurveyComponent;
  title = 'Oracle';

  onActivated(componentRef: any) {
    this.surveyRef = componentRef;
    this.surveyRef?.current$
      .pipe(delay(100))
      .subscribe((_) => this.scrollToFooter());
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboard(event: KeyboardEvent) {
    if (event.ctrlKey) return;
    if (event.key === '[') this.surveyRef.selected(true);
    else if (event.key === ']') this.surveyRef.selected(false);
    else if (event.key === 'r') this.surveyRef.restart(false);
    else if (event.key === 's') this.surveyRef.save(false);
    else if (event.key === 'l') this.sidenavRef.toggle();
    else if (event.key === '0') this.surveyRef.navigateByIndex(10-1);
    else if (event.key > '0' && event.key <= '9')
      this.surveyRef.navigateByIndex(event.key.charCodeAt(0)-'0'.charCodeAt(0)-1);
  }

  scrollToFooter() {
    if (this.footerRef) {
      this.footerRef.nativeElement.scrollIntoView({
        behavior: 'smooth',
        block: 'end',
      });
    }
  }
}
