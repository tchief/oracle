import { Component, Input } from '@angular/core';
import { Survey } from '../../models/survey.model';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent {
  @Input() surveys: Survey[];
}
