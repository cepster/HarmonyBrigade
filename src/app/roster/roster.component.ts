import { Component, OnInit } from "@angular/core";
import { MatTableDataSource } from "@angular/material";
import { without } from "lodash";
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
    this.people = await this.data.getRoster();
    this.dataSource = new MatTableDataSource(this.people);

    this.modelChanged.pipe(debounceTime(3000)).subscribe(model => {
      this.data.updateRoster(this.people).subscribe(() => {
        success("Changes Saved");
      });
    });
  }

  public removePerson(person: Person) {
    this.people = without(this.people, person);
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
}
