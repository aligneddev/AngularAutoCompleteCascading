import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AutoCompleteComponent } from './auto-complete/auto-complete.component';
import { TestingLibraryExampleComponent } from './testing-library-example/testing-library-example.component';


export const examples = [
  {
    path: 'auto-complete',
    component: AutoCompleteComponent,
    data: {
      name: 'Auto Complete Example',
    },
  },
  {
    path: 'testingLibrary',
    component: TestingLibraryExampleComponent,
    data: {
      name: 'Testing Library Example',
    },
  }
];
export const routes: Routes = [
  { path: '', component: AutoCompleteComponent},
  { path: 'auto-complete',component: AutoCompleteComponent },
  { path: 'testing-library-example', component: TestingLibraryExampleComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
