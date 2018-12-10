import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Person } from "./shared/person";

const serviceURL = "http://localhost:9000/roster";

@Injectable({
  providedIn: "root"
})
export class DataService {
  constructor(private http: HttpClient) {}

  public getRoster(): Promise<Person[]> {
    return this.http.get<Person[]>(serviceURL).toPromise();
  }

  public updateRoster(people: Person[]): Observable<Person[]> {
    return this.http.post<Person[]>(serviceURL, people);
  }
}
