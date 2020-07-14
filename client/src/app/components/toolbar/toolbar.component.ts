import { Component, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent {
  @Input() title: string;
  @Input() isSurveySubmitted: boolean;
  @Input() canSubmitSurvey: boolean;
  @Input() canRestartSurvey: boolean;
  @Output() toggleNavBar = new EventEmitter<boolean>();
  @Output() restartSurvey = new EventEmitter<boolean>();
  @Output() saveSurvey = new EventEmitter<boolean>();
}
