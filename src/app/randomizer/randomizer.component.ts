import { Component, OnInit } from "@angular/core";
import { MatTableDataSource } from "@angular/material";
import { Router } from "@angular/router";
import { clone, filter, find, sample, without } from "lodash";
import { error, success } from "toastr";
import { DataService } from "../data.service";
import { Person } from "../shared/person";
import { Quartet } from "../shared/quartet";

@Component({
  selector: "app-randomizer",
  templateUrl: "./randomizer.component.html",
  styleUrls: ["./randomizer.component.scss"]
})
export class RandomizerComponent implements OnInit {
  public quartets: Quartet[] = [];
  public dataSource: MatTableDataSource<Quartet>;
  public displayedColumns = ["lead", "bass", "bari", "tenor", "name"];

  constructor(private data: DataService, private router: Router) {}

  ngOnInit() {}

  public async randomize() {
    const people: Person[] = await this.data.getRoster();
    this.doRandomize(people);
  }

  private doRandomize(people: Person[]) {
    const leads = filter(people, { part: "Lead" });
    const basses = filter(people, { part: "Bass" });
    const baris = filter(people, { part: "Bari" });
    const tenors = filter(people, { part: "Tenor" });

    const quartetCount = Math.max(
      leads.length,
      basses.length,
      baris.length,
      tenors.length
    );

    let workingLeads = clone(leads);
    let workingBasses = clone(basses);
    let workingBaris = clone(baris);
    let workingTenors = clone(tenors);

    for (let i = 0; i < quartetCount; i++) {
      if (workingLeads.length === 0) {
        workingLeads = clone(leads);
      }
      const lead = sample(workingLeads);
      workingLeads = without(lead);

      if (workingBasses.length === 0) {
        workingBasses = clone(basses);
      }
      const bass = sample(workingBasses);
      workingBasses = without(bass);

      if (workingBaris.length === 0) {
        workingBaris = clone(baris);
      }
      const bari = sample(workingBaris);
      workingBaris = without(bari);

      if (workingTenors.length === 0) {
        workingTenors = clone(tenors);
      }
      const tenor = sample(workingTenors);
      workingTenors = without(tenor);

      this.quartets.push(new Quartet(lead, bass, bari, tenor));
    }

    console.log(this.quartets);
    this.dataSource = new MatTableDataSource(this.quartets);
  }

  public save(): void {
    if (this.quartetWithNoName()) {
      error("Please supply a name for all quartets");
      return;
    }

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
      this.router.navigate(["scoring"]);
    });
  }

  private quartetWithNoName(): Quartet {
    return find(this.quartets, (quartet: Quartet) => {
      return !quartet.name;
    });
  }
}
