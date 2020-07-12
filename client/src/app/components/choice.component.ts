import { Component, Input, Output, EventEmitter } from "@angular/core";
import { YesNoQuiz } from '../models/quiz.model';
import { rubberBandAnimation } from "angular-animations";

@Component({
  selector: "app-choice",
  templateUrl: "./choice.component.html",
  styleUrls: ["./choice.component.scss"],
  animations: [rubberBandAnimation({ duration: 1000 })],
})
export class ChoiceComponent {
  @Input() choice: YesNoQuiz;
  @Output() selected = new EventEmitter<boolean>();
  leftSelected: boolean = false;
  rightSelected: boolean = false;

  onSelect(answer: boolean) {
    this.selected.emit(answer);
  }
}
