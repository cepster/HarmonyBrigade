import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouterModule, Routes } from "@angular/router";
import { DropDownsModule } from "@progress/kendo-angular-dropdowns";
import { GridModule } from "@progress/kendo-angular-grid";
import { RosterComponent } from "./roster/roster.component";

const routes: Routes = [
  {
    path: "roster",
    component: RosterComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
    BrowserModule,
    HttpClientModule,
    GridModule,
    DropDownsModule
  ],
  exports: [RouterModule],
  declarations: [RosterComponent]
})
export class AppRoutingModule {}
