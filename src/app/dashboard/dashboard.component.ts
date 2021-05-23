import {ChangeDetectionStrategy, Component} from '@angular/core';
import {RxState} from '@rx-angular/state';
import {Hero} from '../hero';
import {HeroesStateService} from "../heros.state";

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  providers: [RxState],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent {
  readonly heroes$ = this.heroService.heroes$;

  constructor(
    private heroService: HeroesStateService
  ) {

  }

  trackHero(idx: number, hero: Hero): number {
    return hero.id;
  }
}
