import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Person } from "./shared/person";
import { Quartet } from "./shared/quartet";
import { ScoredQuartet } from "./shared/scored-quartet";

const serviceURL = "http://localhost:9000";

@Injectable({
  providedIn: "root"
})
export class DataService {
  constructor(private http: HttpClient) {}

  public getRoster(): Observable<Person[]> {
    return this.http.get<Person[]>(`${serviceURL}/roster`);
  }

  public getRosterExcludeNoShows(): Observable<Person[]> {
    return this.http
      .get<Person[]>(`${serviceURL}/roster`)
      .pipe(map(ps => ps.filter(p => !p.noShow)));
  }

  public updateRoster(people: Person[]): Observable<Person[]> {
    return this.http.post<Person[]>(`${serviceURL}/roster`, people);
  }

  public getQuartets(): Observable<Quartet[]> {
    return this.http.get<Quartet[]>(`${serviceURL}/quartets`);
  }

  public updateQuartets(quartets: Quartet[]): Observable<Quartet[]> {
    return this.http.post<Quartet[]>(`${serviceURL}/quartets`, quartets);
  }

  public getScores(): Observable<ScoredQuartet[]> {
    return this.http.get<ScoredQuartet[]>(`${serviceURL}/quartetScores`);
  }

  public updateScores(scores: ScoredQuartet[]): Observable<ScoredQuartet[]> {
    return this.http.post<ScoredQuartet[]>(
      `${serviceURL}/quartetScores`,
      scores
    );
  }

  public getFinalists(): Observable<ScoredQuartet[]> {
    return this.http.get<ScoredQuartet[]>(`${serviceURL}/quartetFinals`);
  }

  public updateFinalists(scores: ScoredQuartet[]): Observable<ScoredQuartet[]> {
    return this.http.post<ScoredQuartet[]>(
      `${serviceURL}/quartetFinals`,
      scores
    );
  }
}
