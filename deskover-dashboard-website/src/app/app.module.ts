import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';

import {AppRoutingModule} from '@/app-routing.module';
import {AppComponent} from './app.component';
import {MainComponent} from '@modules/main/main.component';
import {LoginComponent} from '@modules/login/login.component';
import {HeaderComponent} from '@modules/main/header/header.component';
import {FooterComponent} from '@modules/main/footer/footer.component';
import {MenuSidebarComponent} from '@modules/main/menu-sidebar/menu-sidebar.component';
import {ProfileComponent} from '@pages/profile/profile.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {DashboardComponent} from '@pages/dashboard/dashboard.component';
import {MessagesComponent} from '@modules/main/header/messages/messages.component';
import {NotificationsComponent} from '@modules/main/header/notifications/notifications.component';
import {ButtonComponent} from '@components/button/button.component';

import {registerLocaleData} from '@angular/common';
import localeEn from '@angular/common/locales/en';
import {UserComponent} from '@modules/main/header/user/user.component';
import {ForgotPasswordComponent} from '@modules/forgot-password/forgot-password.component';
import {RecoverPasswordComponent} from '@modules/recover-password/recover-password.component';
import {LanguageComponent} from '@modules/main/header/language/language.component';
import {PrivacyPolicyComponent} from '@modules/privacy-policy/privacy-policy.component';
import {MenuItemComponent} from '@components/menu-item/menu-item.component';
import {DropdownComponent} from '@components/dropdown/dropdown.component';
import {DropdownMenuComponent} from '@components/dropdown/dropdown-menu/dropdown-menu.component';
import {ControlSidebarComponent} from '@modules/main/control-sidebar/control-sidebar.component';
import {StoreModule} from '@ngrx/store';
import {authReducer} from './store/auth/reducer';
import {uiReducer} from './store/ui/reducer';
import {SelectComponent} from '@components/select/select.component';
import {CheckboxComponent} from '@components/checkbox/checkbox.component';
import {CategoryComponent} from '@pages/category/category.component';
import {BrandComponent} from '@pages/brand/brand.component';
import {DataTablesModule} from 'angular-datatables';
import {AuthInterceptor} from "@/interceptors/auth-interceptor";
import {SubcategoryComponent} from '@pages/category/subcategory/subcategory.component';
import {TooltipModule} from "ngx-bootstrap/tooltip";
import {PromotionComponent} from '@pages/promotion/promotion.component';
import {BsDatepickerModule} from "ngx-bootstrap/datepicker";
import {defineLocale} from 'ngx-bootstrap/chronos';
import {viLocale} from 'ngx-bootstrap/locale';
import {ProductComponent} from '@pages/product/product.component';
import {TimepickerModule} from "ngx-bootstrap/timepicker";
import {CKEditorComponent} from '@components/ckeditor/ckeditor.component';
import {CKEditorModule} from "@ckeditor/ckeditor5-angular";
import {ModalModule} from "ngx-bootstrap/modal";
import {NgxMaskModule} from "ngx-mask";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

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
    CategoryComponent,
    BrandComponent,
    SubcategoryComponent,
    PromotionComponent,
    ProductComponent,
    CKEditorComponent,
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
