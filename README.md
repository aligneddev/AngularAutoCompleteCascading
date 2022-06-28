# Angular AutoComplete Cascading

Cascading Auto Complete with Angular's Material UI

I started from  https://www.itsolutionstuff.com/post/angular-material-autocomplete-with-api-exampleexample.html and expanded a bit.

## My Requirements

1. Auto complete for Team and Team Members (I don't have a lot of data, but in my real-world application I will)
1. Default Selection to Vikings (new FormControl(this.selectedTeam))
1. Team Members filtered to Vikings after default
1. On Team clear, empty team selection, empty team member selection if selected

I learned that you can't have the [value] binding and the onSelect. That leads to multiple events fired.
However, [value] passing in the value correctly to the .valueChanges.pipe. the (onSelectionChange)= gives more control, but `formControl.setValue(this.selectedTeam)` doesn't fire the .pipe like I was expecting:-(
setting the property of [value] doesn't change the field value, so we need setValue

I ended up removing the [value], but then adding it back


seems like onSelectionChanged is getting called twice? https://stackoverflow.com/questions/53009998/why-is-onselectionchange-called-twice
added ` if(!$event.isUserInput){ return; }` for the onTeamSelect which seemed to help.
Later I moved to ` (optionSelected)="onTeamOptionSelect($event)">` on the autocomplete and that seems better.

`tap(e => console.log(`selected ${e}`))` is helpful for debugging RxJs.

the formControl.valueChanges.pipe(
  // needs startWith('')  to fill the initial values
)

`[matAutocomplete]=auto` auto should be unique for each control

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 13.1.3.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

Tests are written using [Testing Library](https://github.com/testing-library). See more [in my blog post](https://alignedev.net/blog/2022/testing-library-angular).
There are [many good examples available](https://github.com/testing-library/angular-testing-library/tree/main/apps/example-app/src/app/examples).