import { Component, OnInit } from "@angular/core";
import { MatTableDataSource } from "@angular/material";
import { map } from "rxjs/operators";
import { success } from "toastr";
import { DataService } from "../data.service";
import { Quartet } from "../shared/quartet";
import { ScoredQuartet } from "../shared/scored-quartet";

@Component({
  selector: "app-scoring",
  templateUrl: "./scoring.component.html",
  styleUrls: ["./scoring.component.scss"]
})
export class ScoringComponent implements OnInit {
  public scores: ScoredQuartet[];
  public dataSource: MatTableDataSource<ScoredQuartet>;
  public displayedColumns = [
    "name",
    "score1",
    "score2",
    "score3",
    "score4",
    "totalScore"
  ];

  constructor(private data: DataService) {}

  public ngOnInit() {
    this.data
      .getScores()
      .pipe(
        map((sqs: ScoredQuartet[]) =>
          sqs.map(
            sq =>
              new ScoredQuartet(
                sq.quartet,
                sq.score1,
                sq.score2,
                sq.score3,
                sq.score4
              )
          )
        )
      )
      .subscribe((sq: ScoredQuartet[]) => {
        this.scores = sq;
        this.dataSource = new MatTableDataSource(sq);
      });
  }

  public load(): void {
    this.data
      .getQuartets()
      .pipe(
        map((quartets: Quartet[]) => quartets.map(q => new ScoredQuartet(q)))
      )
      .subscribe((sq: ScoredQuartet[]) => {
        this.scores = sq;
        this.dataSource = new MatTableDataSource(sq);
        success("Scores Reset");
      });
  }

  public save(): void {
    this.data.updateScores(this.scores).subscribe(() => {
      success("Saved");
    });
  }
}
