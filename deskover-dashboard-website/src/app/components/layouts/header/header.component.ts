import {AppState} from '@/store/state';
import {ToggleControlSidebar, ToggleSidebarMenu} from '@/store/ui/actions';
import {UiState} from '@/store/ui/state';
import {Component, HostBinding, OnInit} from '@angular/core';
import {FormGroup, FormControl} from '@angular/forms';
import {Store} from '@ngrx/store';
import {Observable} from 'rxjs';
import {AuthService} from "@services/auth.service";
import {Admin} from "@/entites/admin";
import {NotiflixUtils} from "@/utils/notiflix-utils";

const BASE_CLASSES = 'main-header navbar navbar-expand';
@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
    @HostBinding('class') classes: string = BASE_CLASSES;
    public ui: Observable<UiState>;
    public searchForm: FormGroup;
    public user: Admin;

    constructor(
        private authService: AuthService,
        private store: Store<AppState>
    ) {}

    ngOnInit() {
        this.ui = this.store.select('ui');
        this.ui.subscribe((state: UiState) => {
            this.classes = `${BASE_CLASSES} ${state.navbarVariant}`;
        });
        this.searchForm = new FormGroup({
            search: new FormControl(null)
        });
        this.getProfile();
    }

    logout() {
        this.authService.logout();
    }

    getProfile() {
        this.authService.getProfile().subscribe({
            next: (data) => {
                this.user = data;
            },
            error: (err) => {
                this.logout();
                NotiflixUtils.failureNotify('Phiên đăng nhập hết hạn, vui lòng đăng nhập lại');
            }
        });
    }

    onToggleMenuSidebar() {
        this.store.dispatch(new ToggleSidebarMenu());
    }

    onToggleControlSidebar() {
        this.store.dispatch(new ToggleControlSidebar());
    }
}
