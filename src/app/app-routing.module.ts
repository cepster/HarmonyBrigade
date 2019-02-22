import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import {
  MatDialogModule,
  MatInputModule,
  MatSortModule,
  MatTooltipModule
} from "@angular/material";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSelectModule } from "@angular/material/select";
import { MatTableModule } from "@angular/material/table";
import { BrowserModule } from "@angular/platform-browser";
import { RouterModule, Routes } from "@angular/router";
import { FinalsComponent } from "./finals/finals.component";
import { HomeComponent } from "./home/home.component";
import { RandomizerComponent } from "./randomizer/randomizer.component";
import { RosterComponent } from "./roster/roster.component";
import { ScoringComponent } from "./scoring/scoring.component";

const routes: Routes = [
  {
    path: "home",
    component: HomeComponent
  },
  {
    path: "roster",
    component: RosterComponent
  },
  {
    path: "randomizer",
    component: RandomizerComponent
  },
  {
    path: "scoring",
    component: ScoringComponent
  },
  {
    path: "finals",
    component: FinalsComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
    BrowserModule,
    HttpClientModule,
    MatCardModule,
    MatTableModule,
    MatFormFieldModule,
    FormsModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatButtonModule,
    MatSortModule,
    MatTooltipModule,
    MatDialogModule
  ],
  exports: [RouterModule],
  declarations: [
    RosterComponent,
    RandomizerComponent,
    ScoringComponent,
    FinalsComponent
  ]
})
export class AppRoutingModule {}
