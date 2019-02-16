import { Person } from "./person";

export class Quartet {
  public lead: Person;
  public bass: Person;
  public bari: Person;
  public tenor: Person;
  public name: string;

  constructor(l: Person, bs: Person, br: Person, t: Person) {
    this.lead = l;
    this.bass = bs;
    this.bari = br;
    this.tenor = t;
  }
}
