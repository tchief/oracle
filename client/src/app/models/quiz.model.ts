export class YesNoQuiz {
  constructor(
    public id: string,
    public question: string,
    public left?: YesNoQuiz,
    public right?: YesNoQuiz,
    public isRoot: boolean = false,
    public isSubmitted: boolean = false,
    public answer: boolean = undefined,
    public choice: string = undefined,
    public isSelected: boolean = false,
    public hideChild: boolean = true,
  ) {
    if (this.left) this.left.choice = 'NO';
    if (this.right) this.right.choice = 'YES';
    if (this.isRoot) this.hideChild = false;
  }

  select(answer: boolean): YesNoQuiz {
    this.answer = answer;
    let selected = answer ? this.right : this.left;
    selected.isSelected = true;
    selected.hideChild = false;
    return selected;
  }

  get hasChildren(): boolean {
    return (
      (this.right !== undefined && this.right !== null) ||
      (this.left !== undefined && this.left !== null)
    );
  }

  get children() {
    return [this.right, this.left].filter((n) => n !== undefined && n !== null);
  }

  get className(): string {
    return `${this.isSelected ? 'node-selected' : 'node-unselected'} ${this.isRoot ? 'node-root' : ''}`;
  }

  static buildFromRoot(root, resetAnswers = false): YesNoQuiz {
    return root
      ? new YesNoQuiz(
          root.id,
          root.question,
          this.buildFromRoot(root.left, resetAnswers),
          this.buildFromRoot(root.right, resetAnswers),
          root.isRoot,
          resetAnswers ? false : root.isSubmitted,
          resetAnswers ? undefined : root.answer,
          resetAnswers ? undefined : root.choice,
          resetAnswers ? false : root.isSelected,
          resetAnswers ? true : root.hideChild
        )
      : root;
  }
}
