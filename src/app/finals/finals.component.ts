import { Component, OnInit } from "@angular/core";
import { MatTableDataSource } from "@angular/material";
import { map } from "rxjs/operators";
import { DataService } from "../data.service";
import { ScoredQuartet } from "../shared/scored-quartet";

@Component({
  selector: "app-finals",
  templateUrl: "./finals.component.html",
  styleUrls: ["./finals.component.scss"]
})
export class FinalsComponent implements OnInit {
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

  constructor(private data: DataService) {
    this.data
      .getFinalists()
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

  ngOnInit() {}
}
