//import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { fireEvent, render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { MaterialModule } from '../material.module';

import { TestingLibraryExampleComponent } from './testing-library-example.component';
describe('TestingLibraryExampleComponent', () => {
  /* default test code setup from the cli generate command
  let component: TestingLibraryComponent;
  let fixture: ComponentFixture<TestingLibraryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestingLibraryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestingLibraryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  */
  let submitSpy: jasmine.Spy<jasmine.Func>;
  beforeEach(async () => {
    submitSpy = jasmine.createSpy();
    await render(TestingLibraryExampleComponent, {
      imports: [ReactiveFormsModule, MaterialModule],
      componentProperties: {
        submitForm: {
          // because the output is an `EventEmitter` we must mock `emit`
          // the component uses `output.emit` to interact with the parent component
          emit: submitSpy
        } as any
      }
    });
  });
  it('should render the form and show the text', async () => {
    // will error if missing
    screen.getByText('Examples Using the Testing Library');
  });
  it('invalid does not submit', () => {
    // not valid, not submitted
    const submit = screen.getByText(/Submit your feedback/i);
    fireEvent.click(submit);
    expect(submitSpy).not.toHaveBeenCalled();
  });
  it('valid input, submits', () => {
    const name = screen.getByLabelText(/name/i);
    const rating = screen.getByLabelText(/rating/i);
    const description = screen.getByLabelText(/description/i);
    const shirtSize = screen.getByLabelText(/t-shirt size/i);
    // Using the https://github.com/testing-library/jasmine-dom
    // I did have some troubles using it https://github.com/testing-library/jasmine-dom/issues/40
    // WallabyJs is saying toHaveTextContent is not a function, but ng test is working
    // adding the jasmine-dom.d.ts helped (from the example )
    expect(shirtSize).toHaveTextContent('M');
    //expect(shirtSize.innerHTML).toContain('M');
    const submit = screen.getByText(/submit your feedback/i);
    const inputValues = {
      name: 'Kevin',
      rating: 10,
      description: '@testing-library 🎉',
      shirtSize: 'M'
    };
    userEvent.type(name, inputValues.name.toString());
    userEvent.type(rating, inputValues.rating.toString());
    userEvent.type(description, inputValues.description);
    userEvent.click(shirtSize);
    userEvent.click(screen.getByText(inputValues.shirtSize));
    // "an easier way to select options is to use the `selectOptions` event", but this doesn't work for mat-select
    //userEvent.selectOptions(shirtSize, inputValues.shirtSize);

    userEvent.click(submit);
    // our form is valid, so now we can verify it has been called with the form value
    expect(submitSpy).toHaveBeenCalledWith(inputValues);
  });
});
