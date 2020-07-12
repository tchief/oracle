export class YesNoQuiz {
    constructor(
      public id: number,
      public question: string,
      public left?: YesNoQuiz,
      public right?: YesNoQuiz,
      public isRoot: boolean = false
    ) {
      if (this.left) this.left.choice = "NO";
      if (this.right) this.right.choice = "YES";
    }
  
    answer?: boolean;
    choice: string;
    isSelected: boolean;
  
    select(answer: boolean): YesNoQuiz {
      this.answer = answer;
      let selected = answer ? this.right : this.left;
      selected.isSelected = true;
      return selected;
    }
  
    get hasChildren(): boolean {
      return this.right !== undefined || this.left !== undefined;
    }
  
    get children() {
      return [this.right, this.left].filter((n) => n !== undefined);
    }
  
    get className(): string {
      return `${this.isSelected ? "quiz-selected" : "quiz-unselected"} ${this.isRoot ? "quiz-root" : ""}`;
    }
  }
  