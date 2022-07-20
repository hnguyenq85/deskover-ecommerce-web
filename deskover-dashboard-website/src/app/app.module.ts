import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';

import {AppRoutingModule} from '@/app-routing.module';
import {AppComponent} from './app.component';
import {MainComponent} from '@components/modules/main/main.component';
import {LoginComponent} from '@components/modules/login/login.component';
import {HeaderComponent} from '@components/modules/main/header/header.component';
import {FooterComponent} from '@components/modules/main/footer/footer.component';
import {MenuSidebarComponent} from '@components/modules/main/menu-sidebar/menu-sidebar.component';
import {ProfileComponent} from '@components/pages/profile/profile.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {DashboardComponent} from '@components/pages/dashboard/dashboard.component';
import {MessagesComponent} from '@components/modules/main/header/messages/messages.component';
import {NotificationsComponent} from '@components/modules/main/header/notifications/notifications.component';
import {ButtonComponent} from '@components/directives/button/button.component';

import {registerLocaleData} from '@angular/common';
import localeEn from '@angular/common/locales/en';
import {UserComponent} from '@components/modules/main/header/user/user.component';
import {ForgotPasswordComponent} from '@components/modules/forgot-password/forgot-password.component';
import {RecoverPasswordComponent} from '@components/modules/recover-password/recover-password.component';
import {LanguageComponent} from '@components/modules/main/header/language/language.component';
import {PrivacyPolicyComponent} from '@components/modules/privacy-policy/privacy-policy.component';
import {MenuItemComponent} from '@components/directives/menu-item/menu-item.component';
import {DropdownComponent} from '@components/directives/dropdown/dropdown.component';
import {DropdownMenuComponent} from '@components/directives/dropdown/dropdown-menu/dropdown-menu.component';
import {ControlSidebarComponent} from '@components/modules/main/control-sidebar/control-sidebar.component';
import {StoreModule} from '@ngrx/store';
import {authReducer} from './store/auth/reducer';
import {uiReducer} from './store/ui/reducer';
import {SelectComponent} from '@components/directives/select/select.component';
import {CheckboxComponent} from '@components/directives/checkbox/checkbox.component';
import {CategoryManagementComponent} from '@components/pages/manage/category/category-management.component';
import {BrandManagementComponent} from '@components/pages/manage/brand/brand-management.component';
import {DataTablesModule} from 'angular-datatables';
import {AuthInterceptor} from "@/interceptors/auth-interceptor";
import {SubcategoryManagementComponent} from '@components/pages/manage/subcategory/subcategory-management.component';
import {TooltipModule} from "ngx-bootstrap/tooltip";
import {PromotionManagementComponent} from '@components/pages/manage/promotion/promotion-management.component';
import {BsDatepickerModule} from "ngx-bootstrap/datepicker";
import {defineLocale} from 'ngx-bootstrap/chronos';
import {viLocale} from 'ngx-bootstrap/locale';
import {ProductManagementComponent} from '@components/pages/manage/product/product-management.component';
import {TimepickerModule} from "ngx-bootstrap/timepicker";
import {CKEditorComponent} from '@components/directives/ckeditor/ckeditor.component';
import {CKEditorModule} from "@ckeditor/ckeditor5-angular";
import {ModalModule} from "ngx-bootstrap/modal";
import {NgxMaskModule} from "ngx-mask";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { UserManagementComponent } from './components/pages/manage/user/user-management.component';

registerLocaleData(localeEn, 'vi-VN');
defineLocale('vi', viLocale);

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    LoginComponent,
    HeaderComponent,
    FooterComponent,
    MenuSidebarComponent,
    ProfileComponent,
    DashboardComponent,
    MessagesComponent,
    NotificationsComponent,
    ButtonComponent,
    UserComponent,
    ForgotPasswordComponent,
    RecoverPasswordComponent,
    LanguageComponent,
    PrivacyPolicyComponent,
    MenuItemComponent,
    DropdownComponent,
    DropdownMenuComponent,
    ControlSidebarComponent,
    SelectComponent,
    CheckboxComponent,
    CategoryManagementComponent,
    BrandManagementComponent,
    SubcategoryManagementComponent,
    PromotionManagementComponent,
    ProductManagementComponent,
    CKEditorComponent,
    UserManagementComponent,
  ],
    imports: [
        BrowserModule,
        FormsModule,
        StoreModule.forRoot({auth: authReducer, ui: uiReducer}),
        HttpClientModule,
        AppRoutingModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        DataTablesModule,
        TooltipModule,
        BsDatepickerModule,
        TimepickerModule,
        CKEditorModule,
        ModalModule,
        NgxMaskModule.forRoot()
    ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
