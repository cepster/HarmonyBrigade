import { Person } from "./person";

export class Quartet {
  public seq: number;
  public lead: Person;
  public bass: Person;
  public bari: Person;
  public tenor: Person;
  public name: string;
  public prelimSong: string;
  public finalsSong: string;
  public finals: boolean;

  constructor(l: Person, bs: Person, br: Person, t: Person, n?: string) {
    this.lead = l;
    this.bass = bs;
    this.bari = br;
    this.tenor = t;
    this.name = n;
  }
}
