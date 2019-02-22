import { Component, OnInit } from "@angular/core";
import { MatTableDataSource } from "@angular/material";
import { Router } from "@angular/router";
import * as _ from "lodash";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { success } from "toastr";
import { DataService } from "../data.service";
import { Person } from "../shared/person";
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

  constructor(private data: DataService, private router: Router) {}

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
        this.save();
      });
  }

  public save(): void {
    this.data.updateScores(this.scores).subscribe(() => {
      success("Saved");
    });
  }

  public toFinals(): void {
    const finalists: ScoredQuartet[] = _.chain(this.scores)
      .sortBy((score: ScoredQuartet) => {
        return score.getTotalScore();
      })
      .takeRight(2)
      .map((score: ScoredQuartet) => {
        return new ScoredQuartet(score.quartet);
      })
      .value();

    this.generateWildcardQuartet(finalists).subscribe((wc: Quartet) => {
      const wcsq = new ScoredQuartet(wc);
      wcsq.isWc = true;
      finalists.push(wcsq);

      // TODO: RANDOMIZE SONGS

      this.data.updateFinalists(finalists).subscribe(() => {
        success("Saved!");
        this.router.navigate(["finals"]);
      });
    });
  }

  private generateWildcardQuartet(
    finalists: ScoredQuartet[]
  ): Observable<Quartet> {
    const finalistLeads: Person[] = _.chain(finalists)
      .map((score: ScoredQuartet) => {
        return score.quartet.lead;
      })
      .value();

    const finalistBasses: Person[] = _.chain(finalists).map(
      (score: ScoredQuartet) => {
        return score.quartet.bass;
      }
    );

    const finalistBaris: Person[] = _.chain(finalists).map(
      (score: ScoredQuartet) => {
        return score.quartet.bari;
      }
    );

    const finalistTenors: Person[] = _.chain(finalists).map(
      (score: ScoredQuartet) => {
        return score.quartet.tenor;
      }
    );

    return this.data.getRoster().pipe(
      map((people: Person[]) => {
        const wcLead = this.getRandom(people, "Lead", finalistLeads);
        const wcBass = this.getRandom(people, "Bass", finalistBasses);
        const wcBari = this.getRandom(people, "Bari", finalistBaris);
        const wcTenor = this.getRandom(people, "Tenor", finalistTenors);

        return new Quartet(wcLead, wcBass, wcBari, wcTenor, "Wildcard");
      })
    );
  }

  private getRandom(
    list: Person[],
    part: string,
    withoutList: Person[]
  ): Person {
    return _.chain(list)
      .filter({ part: part })
      .without(withoutList)
      .sample()
      .value();
  }
}
