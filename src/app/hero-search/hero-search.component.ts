import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RxState } from '@rx-angular/state';

import { Observable, Subject } from 'rxjs';

import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Hero } from '../hero';
import { HeroesStateService } from '../heros.state';

interface HeroSearchComponentState {
  heroes: Hero[];
}

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'app-hero-search',
  templateUrl: './hero-search.component.html',
  styleUrls: ['./hero-search.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeroSearchComponent {
  private searchTerms = new Subject<string>();
  readonly heroes$: Observable<Hero[]> = this.searchTerms.pipe(
    // wait 300ms after each keystroke before considering the term
    debounceTime(300),

    // ignore new term if same as previous term
    distinctUntilChanged(),

    // switch to new search observable each time the term changes
    switchMap((term: string) => this.heroService.filteredHeroes$(term))
  );

  trackHero(idx: number, hero: Hero): number {
    return hero.id;
  }

  constructor(
    public heroService: HeroesStateService,
  ) {
  }

  // Push a search term into the observable stream.
  search(term: string): void {
    this.searchTerms.next(term);
  }
}
