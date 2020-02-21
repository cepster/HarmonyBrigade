import { Component, OnInit } from "@angular/core";
import { MatTableDataSource } from "@angular/material";
import * as _ from "lodash";
import { debounceTime } from "rxjs/operators";
import { Subject } from "rxjs/Subject";
import { success } from "toastr";
import { DataService } from "../data.service";
import { Person } from "../shared/person";

@Component({
  selector: "app-roster",
  templateUrl: "./roster.component.html",
  styleUrls: ["./roster.component.scss"]
})
export class RosterComponent implements OnInit {
  public people: Person[];
  public dataSource: MatTableDataSource<Person>;
  public displayedColumns = ["remove", "name", "part", "noShow"];
  public modelChanged: Subject<Person[]> = new Subject<Person[]>();

  public roles = ["Bari", "Bass", "Lead", "Tenor"];

  constructor(private data: DataService) {}

  public async ngOnInit() {
    this.data.getRoster().subscribe((people: Person[]) => {
      this.people = people.sort((p1, p2) => {
        if (p1.name.split(" ")[1] < p2.name.split(" ")[1]) {
          return -1;
        } else if (p2.name.split(" ")[1] < p1.name.split(" ")[1]) {
          return 1;
        } else {
          return 0;
        }
      });
      this.dataSource = new MatTableDataSource(this.people);

      this.modelChanged.pipe(debounceTime(2000)).subscribe(model => {
        this.data.updateRoster(this.people).subscribe(() => {
          success("Changes Saved");
        });
      });
    });
  }

  public removePerson(person: Person) {
    this.people = _.without(this.people, person);
    this.dataSource = new MatTableDataSource(this.people);
    this.modelChanged.next(this.people);
  }

  public addPerson() {
    this.people.push(new Person());
    this.dataSource = new MatTableDataSource(this.people);
  }

  public change() {
    this.modelChanged.next(this.people);
  }

  public competingPeople(): Person[] {
    return _.filter(this.people, (p: Person) => {
      return !p.noShow;
    });
  }

  public partCount(part: string): number {
    return _.filter(this.competingPeople(), { part: part }).length;
  }
}
