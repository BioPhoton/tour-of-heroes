import {Hero} from "./hero";
import {BehaviorSubject, Observable, of, Subject, Subscription} from "rxjs";
import {catchError, filter, map, startWith, switchMap, tap} from "rxjs/operators";
import {Injectable, OnDestroy} from "@angular/core";
import {HeroResource} from "./hero.resource";

export interface HeroeState {
  heroes: Hero[];
}

const initHeroesState: HeroeState = {
  heroes: []
};


interface SelectorFn<T, D> {
  (parpa: T): Observable<D>
}

@Injectable({
  providedIn: "root"
})
export class HeroesStateService implements OnDestroy {
  subscription = new Subscription();
  heroes: Hero[] = [];

  readonly facadeState = new BehaviorSubject<HeroeState>(initHeroesState)

  readonly heroes$: Observable<Hero[]> = this.facadeState.pipe(map(s => s.heroes));
  readonly hero$: SelectorFn<number, Hero | undefined> = (id: number) => this.heroes$
    .pipe(map(heroes => heroes.find(h => h.id == id)), filter(v => !!v));
  readonly filteredHeroes$: SelectorFn<string, Hero[]> = (searchString: string) => {
    this.search.next(searchString);
    return this.heroes$.pipe(
      map(heroes => heroes.filter(h => h.name.includes(searchString)))
    )
  }
  readonly add = new Subject<string>();
  readonly delete = new Subject<Hero>();
  readonly update = new Subject<Hero>();
  readonly search = new Subject<string>();

  readonly searchSignal = new Subject<string>();
  readonly updateSignal = new Subject<Hero>();

  private readonly _heroAdded$ = this.add.pipe(
    switchMap(name => this.heroService.addHero({name} as Hero))
  );
  private readonly _heroDeleted$: Observable<Hero[]> = this.delete.pipe(
    switchMap(deletedHero => {
        const optimisticUpdate = this.facadeState.getValue().heroes.filter(h => h.id !== deletedHero.id);
        return this.heroService.deleteHero(deletedHero).pipe(
          filter(deletedHero => !!deletedHero),
          switchMap(deletedHero => this.heroService.deleteHero(deletedHero)
            .pipe(
              catchError(e => of(this.facadeState.getValue().heroes)),
              map(() => this.facadeState.getValue().heroes)
            )
          ),
          // apply optimistic change
          startWith(optimisticUpdate)
        )
      }
    )
  );
  private readonly _heroUpdate$: Observable<Hero> = this.update.pipe(
    switchMap(hero => this.heroService.updateHero(hero)),
    tap((hero) => this.updateSignal.next(hero)),
  )

  private readonly _heroSearch$: Observable<Hero[]> = this.search.pipe(
    switchMap(searchString => this.heroService
      .searchHeroes(searchString).pipe(
        tap(() => this.searchSignal.next(searchString))
      )
    )
  )

  constructor(
    public heroService: HeroResource
  ) {
    this.init();
  }

  init() {
    // get initial state
    this.subscription.add(
      this.heroService.getHeroes()
        .subscribe((heroes) => {
          this.facadeState.next({heroes});
        })
    );

    // apply deletions
    this.subscription.add(
      this._heroDeleted$
        .subscribe((heroes) => {
          this.facadeState.next({heroes});
        })
    );

    // apply inserts
    this.subscription.add(
      this._heroAdded$
        .subscribe((addedHero) => {
          this.facadeState.getValue().heroes
          this.facadeState.next({
            heroes: [...this.facadeState.getValue().heroes, addedHero]
          });
        })
    );

    // apply update
    this.subscription.add(
      this._heroUpdate$
        .subscribe((updatedHero) => {
          this.facadeState.getValue().heroes
          this.facadeState.next({
            heroes: this.facadeState.getValue().heroes.map(hero => {
              if (hero.id === updatedHero.id) {
                return updatedHero;
              }
              return hero;
            })
          });
        })
    );

    // apply search
    this.subscription.add(
      this._heroSearch$
        .subscribe((heroes) => {
          this.facadeState.getValue().heroes
          this.facadeState.next({
            heroes: this.facadeState.getValue().heroes.map(hero => heroes.find(h => h.id === hero.id) || hero),
          });
        })
    );

  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
