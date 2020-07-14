import { Component, Input, OnInit } from '@angular/core';
import { Choice } from 'src/app/models/survey.model';

@Component({
  selector: 'angular-org-chart',
  templateUrl: './org-chart.component.html',
  styleUrls: ['./org-chart.component.scss', './../org-chart-combined.scss'],
})
export class OrgChartComponent implements OnInit {
  @Input() data: Choice;
  @Input() hasParent = false;

  ngOnInit() {
    if (this.data) {
        //this.toggleAllChildren(this.data, this.data.hideChild);
    }
  }

  toggleShowChild(value) {
    if (!this.data.isRoot) {
      this.data.hideChild = !this.data.hideChild;
    }
    else {
      this.toggleAllChildren(this.data, !this.data.hideChild);
    }
  }

  toggleAllChildren(data, state) {
    data.hideChild = state;
    if (data.children) {
      data.children.forEach(child => this.toggleAllChildren(child, state));
    }
  }
}
