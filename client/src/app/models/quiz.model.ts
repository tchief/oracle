export class YesNoQuiz {
  constructor(
    public id: string,
    public question: string,
    public left?: YesNoQuiz,
    public right?: YesNoQuiz,
    public isRoot: boolean = false
  ) {
    if (this.left) this.left.choice = 'NO';
    if (this.right) this.right.choice = 'YES';
  }

  answer?: boolean;
  choice: string;
  isSelected: boolean = false;

  select(answer: boolean): YesNoQuiz {
    this.answer = answer;
    let selected = answer ? this.right : this.left;
    selected.isSelected = true;
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

  static buildFromRoot(root): YesNoQuiz {
    return root
      ? new YesNoQuiz(
          root.id,
          root.question,
          this.buildFromRoot(root.left),
          this.buildFromRoot(root.right),
          root.isRoot
        )
      : root;
  }
}
