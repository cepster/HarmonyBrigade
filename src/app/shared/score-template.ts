import { Quartet } from "./quartet";

export class Score {
  public quartet: string;
  public lead: string;
  public bass: string;
  public bari: string;
  public tenor: string;
  public songName: string;
  public score1 = 0;
  public score2 = 0;
  public score3 = 0;
  public score4 = 0;

  constructor(q: Quartet, s?: string) {
    this.quartet = q.name;
    this.lead = q.lead.name;
    this.bass = q.bass.name;
    this.bari = q.bari.name;
    this.tenor = q.tenor.name;
    this.songName = s ? s : q.prelimSong;
  }
}
