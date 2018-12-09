import { Component, OnInit } from "@angular/core";
import { Person } from "../shared/person";

@Component({
  selector: "app-roster",
  templateUrl: "./roster.component.html",
  styleUrls: ["./roster.component.scss"]
})
export class RosterComponent implements OnInit {
  public people: Person[];

  public roles = ["Bari", "Bass", "Lead", "Tenor"];

  constructor() {}

  ngOnInit() {
    this.people = [
      new Person("Matt Richards", "Bari", false),
      new Person("Ben Wanggaard", "Bass", false),
      new Person("Tony Lapakko", "Lead", false),
      new Person("Nate Weimer", "Tenor", false)
    ];
  }
}
