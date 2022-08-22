import { Routes } from '@angular/router';
import { EntryEgressComponent } from '../entry-egress/entry-egress.component';
import { StatisticsComponent } from '../entry-egress/statistics/statistics.component';
import { DetailsComponent } from '../entry-egress/details/details.component';

export const dashboardRoutes: Routes = [
  { path: '', component: StatisticsComponent },
  { path: 'entry-egress', component: EntryEgressComponent },
  { path: 'details', component: DetailsComponent },
];
