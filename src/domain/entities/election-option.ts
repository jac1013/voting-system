
export class ElectionOption {
  id?: number;
  choiceId: number;
  title: string;

  constructor(choiceId: number, title: string) {
    this.choiceId = choiceId;
    this.title = title;
  }
}
