import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { fireEvent, render, screen, within } from '@testing-library/angular';
import { waitFor } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import { AppRoutingModule } from '../app-routing.module';
import { AppModule } from '../app.module';
import { MaterialModule } from '../material.module';
import { AutoCompleteComponent } from './auto-complete.component';
import { AppComponent } from '../app.component';

describe('AutoCompleteComponent', () => {
  /**
   * Avoid using beforeEach and create a setup function instead
   */
   async function setup() {
    return await render(AutoCompleteComponent, {
      declarations: [AppComponent],
      imports: [ReactiveFormsModule, MaterialModule, AppModule]
    });
  }

  it('change teams and viewing members', async () => {
    var rendered = await setup();
    const teamSelect = screen.getByRole('combobox', {name: 'Team'});
    const teamMembersSelect = screen.getByTestId('teamMembersSelect');
    //screen.getByRole('combobox', {name: 'Team Member'});
    // this is cool! screen.logTestingPlaygroundURL()
    const selectedValuesDiv = screen.getByTestId('selectedValuesDiv');
    const teamMembersList = within(selectedValuesDiv).getByTestId('teamMembersList');
    
    // defaults to Vikings
    expect(teamSelect).toHaveDisplayValue('Vikings');
    within(selectedValuesDiv).getByText('Team Members:');
    within(selectedValuesDiv).getByText('Vikings');
    
    // clear
    const clearTeamButton = screen.getByRole('button', {name: 'Clear'});
    await userEvent.click(clearTeamButton);
    expect(teamSelect).toHaveValue('');
    expect(teamMembersSelect).not.toHaveValue();
    
    // deal with mat-autocomplete
    // I couldn't get it to work
    // https://stackoverflow.com/questions/60882089/how-to-test-material-ui-autocomplete-with-react-testing-library
    // teamMembersSelect.focus();
    // await userEvent.click(teamMembersSelect);
    // await userEvent.type(teamMembersSelect, 'Chris');
    // const ccOption = screen.getByRole('option', { name: 'Chris Carter'});
    // await userEvent.click(ccOption);
    // await userEvent.click(screen.getByText('Chris Carter'));
    // expect(teamMembersList).toHaveTextContent('Chris Carter');
    // within(selectedValuesDiv).getByText('Chris Carter');
    // const teamMembersSelectInput = within(teamMembersSelect).getByRole('input');
    // await fireEvent.change(teamMembersSelectInput, {target: { value: ''}})
    await userEvent.type(teamSelect, 'Lions');
    expect(teamSelect).toHaveValue('Lions');
    expect(teamSelect).toHaveDisplayValue('Lions');

    // setTimeout is bad hack, but I couldn't figure out how to get it found without the setTimeout
    setTimeout(() =>{
      within(selectedValuesDiv).getByText('Lions');
    }, 100);
    
    await userEvent.type(teamMembersSelect, 'Barry');
    setTimeout(async () => {
      expect(teamMembersSelect).toHaveValue('Barry Sanders');
      await userEvent.click(screen.getByText('Barry Sanders'));
      within(selectedValuesDiv).getByText('Barry Sanders');
    }, 10);
  });
});