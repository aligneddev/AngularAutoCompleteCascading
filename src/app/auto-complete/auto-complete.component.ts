// https://www.itsolutionstuff.com/post/angular-material-autocomplete-with-api-exampleexample.html
// https://stackoverflow.com/questions/54965639/cascaded-angular-material-design-sample-with-reactive-forms
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, startWith, tap } from 'rxjs/operators';

export interface TeamMember {
  name: string;
  team: string;
}

export interface Team {
  name: string;
}
@Component({
  selector: 'app-auto-complete',
  templateUrl: './auto-complete.component.html',
  styleUrls: ['./auto-complete.component.css']
})
export class AutoCompleteComponent implements OnInit {
  teams: Team[] = [{ name: 'Vikings' }, { name: 'Bears' }, { name: 'Packers' }, { name: 'Lions' }];
  selectedTeam = this.teams[0];
  teamControl = new FormControl(this.selectedTeam);
  filteredTeams$!: Observable<Team[]>;
  teamMembers: TeamMember[] = [
    { name: 'Chris Carter', team: 'Vikings' },
    { name: 'Adam Thielen', team: 'Vikings' },
    { name: 'Brett Favre', team: 'Packers' },
    { name: 'Brian Urlacher', team: 'Bears' },
    { name: 'Barry Sanders', team: 'Lions' }];
  selectedTeamMember!: TeamMember;
  teamMemberControl = new FormControl();
  filteredTeamMembers$!: Observable<TeamMember[]>;

  constructor() { }
  ngOnInit() {
    this.filteredTeams$ = this.teamControl.valueChanges.pipe(
      startWith(''),
      //tap(e => console.log(`teams changed to ${e}`)),
      debounceTime(400),
      distinctUntilChanged(),
      // on select, you get a full object, on type you get a string
      map((value: string | Team) => value == null ? '' : (typeof value === 'string' ? value : value.name)),
      tap(e => console.log(`selected ${e}`)),
      map(v => this._filterTeams(v)),
      tap(e => { e.forEach(f => console.log('team: ' + f.name)) }),
    );
    this.filteredTeamMembers$ = this.teamMemberControl.valueChanges.pipe(
      startWith(''),
      debounceTime(400),
      distinctUntilChanged(),
      map((value: string | TeamMember) => (typeof value === 'string' ? value : value.name)),
      //tap(e => console.log(`selected member ${e}`)),
      map(v => this._filterTeamMembers(v)),
      tap(e => { e.forEach(f => console.log(`member: ${f.name}`)) })

      //tap(e => { e.forEach(f => console.log(`member: ${f.name}`))})
      //(e => console.log(`selected member: ${e.name}`)),

    );
  }

  // ngOnDestroy() {
  //   // | async unsubscribes: https://blog.bitsrc.io/6-ways-to-unsubscribe-from-observables-in-angular-ab912819a78f
  // }

  teamDisplayFn(team: Team): string {
    return team && team.name ? team.name : '';
  }

  private _filterTeams(name: string): Team[] {
    if (!name || name.length === 0) return this.teams;
    return this.teams.filter(option => option.name.toLowerCase().includes(name.toLowerCase()));
  }

  onTeamSelect(team: Team) {
    this.selectedTeam = team;
    this.teamControl.setValue(this.selectedTeam);
    this.clearTeamMember();
  }

  clearTeam() {
    this.selectedTeam = { name: '' };
    this.onTeamSelect(this.selectedTeam);
    this.clearTeamMember();
  }

  private _filterTeamMembers(name: string): TeamMember[] {
    if (this.selectedTeam.name === '') return [];
    let byTeam = this.teamMembers.filter(t => t.team === this.selectedTeam.name);
    if (name === '') return byTeam;
    return byTeam.filter(option => option.name.toLowerCase().includes(name.toLowerCase()));
  }

  teamMemberDisplay(user: TeamMember): string {
    return user && user.name ? user.name : '';
  }

  onTeamMemberSelect(option: TeamMember) {
    this.selectedTeamMember = option;
  }

  clearTeamMember() {
    this.selectedTeamMember = { name: '', team: '' };
    this.teamMemberControl.setValue(this.selectedTeamMember);
  }

}
