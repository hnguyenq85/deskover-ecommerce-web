import {AppState} from '@/store/state';
import {UiState} from '@/store/ui/state';
import {Component, HostBinding, OnInit} from '@angular/core';
import {Store} from '@ngrx/store';
import {Observable} from 'rxjs';
import {AuthService} from "@services/auth.service";

const BASE_CLASSES = 'main-sidebar elevation-4';

@Component({
  selector: 'app-menu-sidebar',
  templateUrl: './menu-sidebar.component.html',
  styleUrls: ['./menu-sidebar.component.scss']
})
export class MenuSidebarComponent implements OnInit {
  @HostBinding('class') classes: string = BASE_CLASSES;
  public ui: Observable<UiState>;
  public user: any;
  public menu = MENU;

  constructor(
    public authService: AuthService,
    private store: Store<AppState>
  ) {
  }

  ngOnInit() {
    this.ui = this.store.select('ui');
    this.ui.subscribe((state: UiState) => {
      this.classes = `${BASE_CLASSES} ${state.sidebarSkin}`;
    });
    this.user = this.authService.user;
  }
}

export const MENU = [
  {
    name: 'Bảng điều khiển',
    path: ['/'],
    iconClasses: 'fa-duotone fa-gauge-max'
  },
  {
    header: 'QUẢN LÝ',
    name: 'Danh mục',
    iconClasses: 'fa-duotone fa-layer-group',
    children: [
      {
        name: 'Danh mục chính',
        path: ['/category'],
        iconClasses: 'fa-duotone fa-circle-dot',
      },

      {
        name: 'Danh mục con',
        path: ['/subcategory'],
        iconClasses: 'fa-duotone fa-circle-dot',
      }
    ]
  },
  {
    name: 'Thương hiệu',
    path: ['/brand'],
    iconClasses: 'fa-duotone fa-copyright'
  },
  {
    name: 'Khuyến mãi',
    path: ['/promotion'],
    iconClasses: 'fa-duotone fa-badge-percent'
  },
  {
    name: 'Sản phẩm',
    path: ['/product'],
    iconClasses: 'fa-duotone fa-cart-flatbed-boxes'
  },
  {
    name: 'Người dùng',
    path: ['/user'],
    iconClasses: 'fa-duotone fa-users'
  }


];
