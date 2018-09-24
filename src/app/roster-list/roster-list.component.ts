import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { Person } from "./person";

@Component({
  selector: "app-roster-list",
  templateUrl: "./roster-list.component.html",
  styleUrls: ["./roster-list.component.scss"]
})
export class RosterListComponent implements OnInit {
  public personList: Person[];
  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http
      .get("http://localhost:9000/roster")
      .subscribe((list: Person[]) => {
        console.log(list);
        this.personList = list;
      });
  }
}
