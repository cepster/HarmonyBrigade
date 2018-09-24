import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouterModule, Routes } from "@angular/router";
import { RosterListComponent } from "./roster-list/roster-list.component";

const routes: Routes = [
  {
    path: "roster",
    component: RosterListComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes), BrowserModule, HttpClientModule],
  exports: [RouterModule],
  declarations: [RosterListComponent]
})
export class AppRoutingModule {}
