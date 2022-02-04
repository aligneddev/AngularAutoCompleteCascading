// https://www.itsolutionstuff.com/post/angular-material-autocomplete-with-api-exampleexample.html
import { Component, OnInit } from '@angular/core';
import { Form, FormControl } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { concatAll, debounceTime, defaultIfEmpty, distinctUntilChanged, filter, map, startWith, tap } from 'rxjs/operators';

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
  filteredTeams!: Observable<Team[]>;
  teamMembers: TeamMember[] = [
    { name: 'Chris Carter', team: 'Vikings' },
    { name: 'Adam Thielen', team: 'Vikings' },
    { name: 'Brett Favre', team: 'Packers' },
    { name: 'Brian Urlacher', team: 'Bears' },
    { name: 'Barry Sanders', team: 'Lions' }];
  filteredTeamMembers!: Observable<TeamMember[]>;
  selectedTeam = this.teams[0];
  selectedTeamMember!: TeamMember;
  teamControl = new FormControl(this.selectedTeam);
  teamMemberControl = new FormControl();

  constructor() { }
  ngOnInit() {
    this.filteredTeams = this.teamControl.valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      // on select, you get a full object, on type you get a string
      map((value: string | Team) => (typeof value === 'string' ? value : value.name)),
      map(v => (v ? this._filterTeams(v) : this.teams.slice())),
      tap(e => e.forEach(f => console.log('team ' + f.name))),
    );
    this.filteredTeamMembers = this.teamMemberControl.valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      map((value: string | TeamMember) => (typeof value === 'string' ? value : value.name)),
      map(v => (v ? this._filterTeamMembers(v) : this.teamMembers.slice())),
      tap(e => e.forEach(f => console.log(`member: ${f.name}`)))
    );
  }

  teamDisplayFn(team: Team): string {
    return team && team.name ? team.name : '';
  }

  private _filterTeams(name: string): Team[] {
    return this.teams.filter(option => option.name.toLowerCase().includes(name.toLowerCase()));
  }

  onTeamSelect(team: Team) {
    this.selectedTeam = team;
  }

  clearTeam(){
    this.selectedTeam = { name: ''};
    this.teamControl.setValue(this.selectedTeam);
  }

  private _filterTeamMembers(name: string): TeamMember[] {
    let byTeam = this.teamMembers.filter(t => t.team === this.selectedTeam.name);
    return byTeam.filter(option => option.name.toLowerCase().includes(name.toLowerCase()));
  }

  teamMemberDisplay(user: TeamMember): string {
    return user && user.name ? user.name : '';
  }

  onTeamMemberSelect(option: TeamMember) {
    this.selectedTeamMember = option;
  }

}
