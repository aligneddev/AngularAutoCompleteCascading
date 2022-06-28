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
  it('valid input, submits', async () => {
    const name = screen.getByLabelText(/name/i);
    const rating = screen.getByLabelText(/rating/i);
    const description = screen.getByLabelText(/description/i);
    const shirtSizeSelect = screen.getByRole('combobox', { name: /t-shirt size/i });
    const submit = screen.getByText(/submit your feedback/i);
    const inputValues = {
      name: 'Kevin',
      rating: 10,
      description: 'testing-library',
      shirtSize: { id: 2, value: 'M' }
    };
    // I needed to use await, even though the examples didn't have it....
    await userEvent.type(name, inputValues.name);
    expect(name).toHaveValue(inputValues.name);
    await userEvent.type(rating, inputValues.rating.toString());
    expect(rating).toHaveValue(inputValues.rating);
    await userEvent.type(description, inputValues.description);
    expect(description).toHaveValue(inputValues.description);
    // Using the https://github.com/testing-library/jasmine-dom
    // I did have some troubles using it https://github.com/testing-library/jasmine-dom/issues/40
    // WallabyJs is saying toHaveTextContent is not a function, but ng test is working
    // adding the jasmine-dom.d.ts helped (from the example )
    await userEvent.click(shirtSizeSelect);
    await userEvent.click(screen.getByText(inputValues.shirtSize.value));
    // "an easier way to select options is to use the `selectOptions` event", but this doesn't work for mat-select
    // await userEvent.selectOptions(shirtSizeSelect, inputValues.shirtSize.value);
    expect(shirtSizeSelect).toHaveTextContent('M');

    await userEvent.click(submit);
    // our form is valid, so now we can verify it has been called with the form value
    expect(submitSpy).toHaveBeenCalledWith(jasmine.objectContaining({
      name: inputValues.name,
      rating: inputValues.rating,
      description: inputValues.description,
      shirtSize: inputValues.shirtSize.id
    }));
  });
});
