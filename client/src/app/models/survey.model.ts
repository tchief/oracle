export interface Survey {
  id: string;
  name: string;
  root: Choice;
  submittedForms: Form[];
}

export interface Form {
  surveyId: string;
  userName: string;
  choicesMade: { [key: string]: boolean };
}

export class Choice {
  constructor(
    public id: number,
    public question: string,
    public left?: Choice,
    public right?: Choice,
    public isRoot: boolean = false,
    public hideChild: boolean = true,
    public answer?: boolean,
    public name?: string,
    public isSelected: boolean = false,
  ) {
    if (this.left) this.left.name = 'NO';
    if (this.right) this.right.name = 'YES';
    if (this.isRoot) this.hideChild = false;
  }
  
  get hasChildren(): boolean {
    return this.right != null || this.left != null;
  }

  get children() {
    return [this.right, this.left].filter((n) => n != null);
  }

  get className(): string {
    return `${this.isSelected ? 'node-selected' : 'node-unselected'} ${this.isRoot ? 'node-root' : ''}`;
  }

  select(answer: boolean): Choice {
    this.answer = answer;
    let selected = answer ? this.right : this.left;
    selected.isSelected = true;
    selected.hideChild = false;
    return selected;
  }

  getSelectedIds(): { [key: number]: boolean } {
    let choices: { [key: number]: boolean } = {};
    let current: Choice = this;
    while (current && current.hasChildren) {
      choices[current.id] = current.answer;
      current = current.answer ? current.right : current.left;
    }
    return choices;
  }

  setSelectedIds(form: { [key: number]: boolean }) {
    let current: Choice = this;
    while (current && current.hasChildren && (form[current.id] !== undefined)) {
      current = current.select(form[current.id]);
    }

    if (current) current.answer = form[current.id];
  }

  resetSelectedIds() {
    let current: Choice = this;
    while (current) {
      let next = current.answer ? current.right : current.left;
      current.answer = undefined;
      current.isSelected = false;
      current.hideChild = true;
      current = next;
    }

    if (this.isRoot) this.hideChild = false;
  }
}