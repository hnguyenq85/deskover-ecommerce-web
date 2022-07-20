import {Component, OnInit, ViewChild} from '@angular/core';
import {NavigationCancel, NavigationEnd,
  NavigationError, NavigationStart, RouteConfigLoadEnd, RouteConfigLoadStart, Router, RouterOutlet} from "@angular/router";
import {Block, Loading} from "notiflix";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = "Deskover Dashboard";

  @ViewChild(RouterOutlet) outlet: RouterOutlet;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        Block.circle('body');
      } else if (event instanceof NavigationEnd || event instanceof NavigationCancel || event instanceof NavigationError) {
        Block.remove('body');
      }
    });

    /*this.router.events.subscribe(
      event => {
        if(event instanceof RouteConfigLoadStart) {
          Loading.circle();
          return;
        }
        if(event instanceof RouteConfigLoadEnd) {
          Loading.remove();
          return;
        }
      }
    );*/
  }
}
