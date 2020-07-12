import { Component, Input } from '@angular/core';
import { YesNoQuiz } from 'src/app/models/quiz.model';

@Component({
  selector: 'angular-org-chart',
  templateUrl: './org-chart.component.html',
  styleUrls: ['./org-chart.component.scss', './../org-chart-combined.scss'],
})
export class OrgChartComponent {
  @Input() data: YesNoQuiz;
  @Input() hasParent = false;
  hideChild = false;

  toggleShowChild(value) {
    this.hideChild = !this.hideChild;
  }
}
