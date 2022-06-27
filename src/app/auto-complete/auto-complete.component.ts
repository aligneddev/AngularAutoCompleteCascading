// https://www.itsolutionstuff.com/post/angular-material-autocomplete-with-api-exampleexample.html
// https://stackoverflow.com/questions/54965639/cascaded-angular-material-design-sample-with-reactive-forms
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map, startWith, tap } from 'rxjs/operators';

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

  // set the default value
  teamControl: FormControl = new FormControl(this.selectedTeam);
  filteredTeams$!: Observable<Team[]>;
  teamMembers: TeamMember[] = [
    { name: 'Chris Carter', team: 'Vikings' },
    { name: 'Adam Thielen', team: 'Vikings' },
    { name: 'Dalvin Cook', team: 'Vikings' },
    { name: 'John Randle', team: 'Vikings' },
    { name: 'Adrian Peterson', team: 'Vikings' },
    { name: 'Brett Favre', team: 'Packers' },
    { name: 'Aaron Rogers', team: 'Packers' },
    { name: 'Brian Urlacher', team: 'Bears' },
    { name: 'Mike Ditka', team: 'Bears' },
    { name: 'Walter Payton', team: 'Bears' },
    { name: 'Barry Sanders', team: 'Lions' },
    { name: 'Calvin Johnson', team: 'Lions' },
    { name: 'Matthew Stafford', team: 'Lions' }
  ];
  selectedTeamMember!: TeamMember;
  teamMemberControl = new FormControl();
  filteredTeamMembers$!: Observable<TeamMember[]>;

  constructor() { }
  ngOnInit() {
    this.filteredTeams$ = this.teamControl.valueChanges.pipe(
      startWith(''),
      debounceTime(400),
      distinctUntilChanged(),
      filter(v => v !== null && v !== undefined),
      // on select, you get a full object, on type you get a string
      map((value: string | Team) => typeof value === 'string' ? value : value.name),
      // only filled in when you type
      tap(e => e === '' ? '' : console.log(`team filter ${e}`)),
      map(v => this._filterTeams(v)),
     // tap(e => { e.forEach(f => console.log('team: ' + f.name)) }),
    );
    this.filteredTeamMembers$ = this.teamMemberControl.valueChanges.pipe(
      startWith(''),
      debounceTime(400),
      distinctUntilChanged(),
      filter(v => v !== null && v !== undefined),
      map((value: string | TeamMember) => (typeof value === 'string' ? value : value.name)),
      tap(e => e === '' ? '' : console.log(`member filter ${e}`)),
      map(v => this._filterTeamMembers(v)),
     // tap(e => { e.forEach(f => console.log(`member: ${f.name}`)) })
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

  onTeamOptionSelect($event: any) {
    let team = $event.option.value;
    this.selectedTeam = team;
    this.teamControl.setValue(this.selectedTeam);
    this.clearTeamMember();
  }
  
  // // an alternative select method
  // onTeamSelect(team: Team, $event: any) {
  //   if(!$event.isUserInput){ return; }
  //   this.selectedTeam = team;
  //   this.teamControl.setValue(this.selectedTeam);
  //   this.clearTeamMember();
  // }

  clearTeam() {
    this.selectedTeam = { name: '' };
    this.teamControl.setValue(this.selectedTeam);
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
    this.teamMemberControl.setValue(this.selectedTeamMember);
  }

  clearTeamMember() {
    this.onTeamMemberSelect({ name: '', team: '' });
  }
}
