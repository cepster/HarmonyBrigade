import { Quartet } from "./quartet";

export class ScoredQuartet {
  public quartet: Quartet;
  public score1: number;
  public score2: number;
  public score3: number;
  public score4: number;

  constructor(q: Quartet, s1?: number, s2?: number, s3?: number, s4?: number) {
    this.quartet = q;
    this.score1 = s1;
    this.score2 = s2;
    this.score3 = s3;
    this.score4 = s4;
  }

  public getTotalScore(): any {
    return (
      ((this.score1 ? this.score1 : 0) +
        (this.score2 ? this.score2 : 0) +
        (this.score3 ? this.score3 : 0) +
        (this.score4 ? this.score4 : 0)) /
      4
    );
  }
}
