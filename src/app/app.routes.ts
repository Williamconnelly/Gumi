import { Routes } from '@angular/router';
import { HomeComponent, MediaFeedComponent, UserResultsComponent } from '@gumi/views';

export const routes: Routes = [
  {
    path: '', component: HomeComponent,
    data: {
      showNavbar: false
    }
  },
  {
    path: 'search/:query',
    component: UserResultsComponent,
    data: {
      showNavbar: false
    }
  },
  {
    path: 'feed/:userId',
    component: MediaFeedComponent
  },
  {
    path: '**',
    redirectTo: ''
  }
];
