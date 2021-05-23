import {ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Location} from '@angular/common';
import {RxState} from '@rx-angular/state';
import {Subscription} from 'rxjs';
import {switchMap} from 'rxjs/operators';
import {Hero} from '../hero';
import {HeroesStateService} from "../heros.state";

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'app-hero-detail',
  templateUrl: './hero-detail.component.html',
  styleUrls: ['./hero-detail.component.css'],
  providers: [RxState],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeroDetailComponent implements OnInit, OnDestroy {

  subscription = new Subscription();

  readonly hero$ = this.route.paramMap.pipe(
    switchMap(params => this.heroService.hero$(Number(params.get('id'))))
  );

  constructor(
    private route: ActivatedRoute,
    private heroService: HeroesStateService,
    private location: Location
  ) {

  }

  init() {
    this.subscription.add(
      this.heroService.updateSignal
        .subscribe(() => this.goBack())
    );
  }

  goBack(): void {
    this.location.back();
  }

  save(hero: Hero): void {
    this.heroService.update.next(hero);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnInit(): void {
    this.init();
  }
}
