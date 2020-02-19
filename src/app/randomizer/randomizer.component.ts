import { Component, OnInit } from "@angular/core";
import { MatTableDataSource } from "@angular/material";
import { Router } from "@angular/router";
import { ExportToCSV } from "@molteni/export-csv";
import * as _ from "lodash";
import { Subject } from "rxjs";
import { debounceTime, map } from "rxjs/operators";
import { error, success } from "toastr";
import { DataService } from "../data.service";
import { Person } from "../shared/person";
import { Quartet } from "../shared/quartet";
import { Score } from "../shared/score-template";

@Component({
  selector: "app-randomizer",
  templateUrl: "./randomizer.component.html",
  styleUrls: ["./randomizer.component.scss"]
})
export class RandomizerComponent implements OnInit {
  public quartets: Quartet[] = [];
  public people: Person[];
  public dataSource: MatTableDataSource<Quartet>;
  public displayedColumns = [
    "seq",
    "lead",
    "bass",
    "bari",
    "tenor",
    "name",
    "songName",
    "finals"
  ];
  public songs = [
    "I'm Walkin'",
    "Everything's Coming Up Roses",
    "In The Wee Small Hours of the Morning",
    "Royal Garden Blues",
    "Sentimental Gentleman from Georgia",
    "Love Me and the World is Mine",
    "Puttin' On The Ritz",
    "Put Your Head On My Shoulder",
    "(Let's Start) Tomorrow Tonight",
    "(I Love You) For Sentimental Reasons",
    "Get Happy",
    "Jazz Me Blues"
  ];
  public modelChanged: Subject<Quartet[]> = new Subject<Quartet[]>();

  constructor(private data: DataService, private router: Router) {}

  ngOnInit() {
    this.data.getQuartets().subscribe((quartets: Quartet[]) => {
      this.quartets = _.sortBy(quartets, ["seq"], ["asc"]);
      this.dataSource = new MatTableDataSource(this.quartets);
    });

    this.data.getRosterExcludeNoShows().subscribe((people: Person[]) => {
      this.people = people;
    });

    this.modelChanged.pipe(debounceTime(2000)).subscribe(model => {
      this.save();
    });
  }

  public async randomize() {
    this.doRandomize(this.people);
  }

  private doRandomize(people: Person[]) {
    this.quartets = [];
    const leads: Person[] = _.filter(people, { part: "Lead" });
    const basses: Person[] = _.filter(people, { part: "Bass" });
    const baris: Person[] = _.filter(people, { part: "Bari" });
    const tenors: Person[] = _.filter(people, { part: "Tenor" });

    const quartetCount = Math.max(
      leads.length,
      basses.length,
      baris.length,
      tenors.length
    );

    let workingLeads = _.clone(leads);
    let workingBasses = _.clone(basses);
    let workingBaris = _.clone(baris);
    let workingTenors = _.clone(tenors);
    let workingSongs = _.clone(this.songs);
    let seq = 1;

    for (let i = 0; i < quartetCount; i++) {
      // LEADS
      if (workingLeads.length === 0) {
        workingLeads = _.clone(leads);
      }
      const lead = _.sample(workingLeads);
      workingLeads = _.without(workingLeads, lead);

      // BASSES
      if (workingBasses.length === 0) {
        workingBasses = _.clone(basses);
      }
      const bass: Person = _.sample(workingBasses);
      workingBasses = _.without(workingBasses, bass);

      // BARIS
      if (workingBaris.length === 0) {
        workingBaris = _.clone(baris);
      }
      const bari = _.sample(workingBaris);
      workingBaris = _.without(workingBaris, bari);

      // TENORS
      if (workingTenors.length === 0) {
        workingTenors = _.clone(tenors);
      }
      const tenor = _.sample(workingTenors);
      workingTenors = _.without(workingTenors, tenor);

      // SONGS
      if (workingSongs.length === 0) {
        workingSongs = _.clone(this.songs);
      }
      const song = _.sample(workingSongs);
      workingSongs = _.without(workingSongs, song);

      const quartet: Quartet = new Quartet(lead, bass, bari, tenor);
      quartet.prelimSong = song;
      quartet.seq = seq++;
      this.quartets.push(quartet);
    }

    this.quartets = _.sortBy(this.quartets, ["seq"], ["asc"]);
    this.dataSource = new MatTableDataSource(this.quartets);
    this.save();
  }

  public save(): void {
    this.data.updateQuartets(this.quartets).subscribe(() => {
      success("Saved");
    });
  }

  public submit() {
    if (this.quartetWithNoName()) {
      error("Please supply a name for all quartets");
      return;
    }

    this.data.updateQuartets(this.quartets).subscribe(() => {
      // TODO: Clear out scores in DB....
      this.router.navigate(["scoring"]);
    });
  }

  public generateCSV(): void {
    const exporter: ExportToCSV = new ExportToCSV();
    const scores: Score[] = _.map(this.quartets, (q: Quartet) => {
      return new Score(q);
    });
    console.log(scores);
    exporter.exportColumnsToCSV(scores, "scoring.csv", [
      "quartet",
      "lead",
      "bass",
      "bari",
      "tenor",
      "songName",
      "score1",
      "score2",
      "score3",
      "score4"
    ]);
  }

  public async generateFinals() {
    const finalists: Quartet[] = _.filter(this.quartets, (q: Quartet) => {
      return q.finals;
    });
    finalists.push(await this.generateWildcardQuartet(finalists));

    let workingSongs: string[] = _.clone(this.songs);
    const scores: Score[] = [];
    finalists.forEach((finalist: Quartet) => {
      if (workingSongs.length === 0) {
        workingSongs = _.clone(this.songs);
      }
      if (!finalist.prelimSong) {
        finalist.prelimSong = _.sample(workingSongs);
        workingSongs = _.without(workingSongs, finalist.prelimSong);
        scores.push(new Score(finalist));
      }

      if (workingSongs.length === 0) {
        workingSongs = _.clone(this.songs);
      }
      finalist.finalsSong = _.sample(workingSongs);
      scores.push(new Score(finalist, finalist.finalsSong));
      workingSongs = _.without(workingSongs, finalist.finalsSong);
    });

    new ExportToCSV().exportColumnsToCSV(scores, "finals.csv", [
      "quartet",
      "lead",
      "bass",
      "bari",
      "tenor",
      "songName",
      "score1",
      "score2",
      "score3",
      "score4"
    ]);
  }

  public randomPart(part: string): void {
    const name: string = _.chain(this.people)
      .filter({ part: part })
      .map((p: Person) => {
        return p.name;
      })
      .sample()
      .value();

    alert(name);
  }

  private quartetWithNoName(): Quartet {
    return _.find(this.quartets, (quartet: Quartet) => {
      return !quartet.name;
    });
  }

  private generateWildcardQuartet(finalists: Quartet[]): Promise<Quartet> {
    const finalistLeads: Person[] = _.map(finalists, q => q.lead);
    const finalistBasses: Person[] = _.map(finalists, q => q.bass);
    const finalistBaris: Person[] = _.map(finalists, q => q.bari);
    const finalistTenors: Person[] = _.map(finalists, q => q.tenor);

    return this.data
      .getRoster()
      .pipe(
        map((people: Person[]) => {
          const wcLead = this.getRandom(people, "Lead", finalistLeads);
          const wcBass = this.getRandom(people, "Bass", finalistBasses);
          const wcBari = this.getRandom(people, "Bari", finalistBaris);
          const wcTenor = this.getRandom(people, "Tenor", finalistTenors);

          return new Quartet(wcLead, wcBass, wcBari, wcTenor, "Wildcard");
        })
      )
      .toPromise();
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

  public change() {
    this.modelChanged.next(this.quartets);
  }
}

// TODO1: Generate Finals List
