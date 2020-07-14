import { Component, Input, Output, EventEmitter } from "@angular/core";
import { rubberBandAnimation } from "angular-animations";
import { Choice } from 'src/app/models/survey.model';

@Component({
  selector: "app-choice",
  templateUrl: "./choice.component.html",
  styleUrls: ["./choice.component.scss"],
  animations: [rubberBandAnimation({ duration: 1000 })],
})
export class ChoiceComponent {
  @Input() choice: Choice;
  @Output() selected = new EventEmitter<boolean>();
  leftSelected: boolean = false;
  rightSelected: boolean = false;

  onSelect(answer: boolean) {
    this.selected.emit(answer);
  }
}
