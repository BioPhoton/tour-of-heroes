import {ChangeDetectionStrategy, Component} from '@angular/core';
import {RxState} from '@rx-angular/state';
import {Observable} from 'rxjs';

import {Hero} from '../hero';
import {HeroesStateService} from "../heros.state";

interface HeroesComponentState {
  heroes: Hero[];
}

const initHeroesComponentState: Partial<HeroesComponentState> = {
  heroes: []
};

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.css'],
  providers: [RxState],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeroesComponent {
  readonly heroes$: Observable<Hero[]> = this.heroService.heroes$;
  readonly add = this.heroService.add;
  readonly delete = this.heroService.delete;

  constructor(
    public heroService: HeroesStateService,
  ) {
  }

  trackHero(idx: number, hero: Hero): number {
    return hero.id;
  }
}
