import {AfterViewInit, Component, ElementRef, Renderer2} from '@angular/core';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'dirty-check',
  template: `
    <div class="indicator-ripple">
      <span>{{ numDirtyChecks() }}</span>
    </div>
  `,
  styles: [`
    :host {
      display: inline-flex;
    }
    :host .indicator-ripple {
      min-width: 20px;
      min-height: 20px;
      display: block;
      text-align: center;
      border: 1px dashed darkgray;
    }`]
})
export class DirtyChecksComponent implements AfterViewInit {
  displayElem: HTMLElement | undefined = undefined;
  dirtyChecks = 0;

  constructor(
    private elementRef: ElementRef,
    private renderer: Renderer2
  ) {

  }

  ngAfterViewInit() {
    this.displayElem = this.elementRef.nativeElement.children[0].children[0];
    this.numDirtyChecks();
  }

  numDirtyChecks() {
    // tslint:disable-next-line:no-unused-expression
    this.displayElem && this.renderer.setProperty(this.displayElem, 'innerHTML', ++this.dirtyChecks + '');
  }

}
