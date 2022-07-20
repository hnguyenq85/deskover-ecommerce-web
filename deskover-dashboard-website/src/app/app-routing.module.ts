import {NgModule} from '@angular/core';
import {PreloadAllModules, RouterModule, Routes} from '@angular/router';
import { MainComponent } from '@components/home/main.component';
import {AuthGuard} from '@guards/auth.guard';
import {NonAuthGuard} from '@guards/non-auth.guard';
import {DashboardComponent} from "@components/home/dashboard/dashboard.component";
import {ProfileComponent} from "@components/home/profile/profile.component";
import {CategoryComponent} from "@components/home/manage/category/category.component";
import {SubcategoryComponent} from "@components/home/manage/category/subcategory/subcategory.component";
import {BrandComponent} from "@components/home/manage/brand/brand.component";
import {PromotionComponent} from "@components/home/manage/promotion/promotion.component";
import {ProductComponent} from "@components/home/manage/product/product.component";
import {LoginComponent} from "@components/pages/login/login.component";
import {ForgotPasswordComponent} from "@components/pages/forgot-password/forgot-password.component";
import {RecoverPasswordComponent} from "@components/pages/recover-password/recover-password.component";
import {PrivacyPolicyComponent} from "@components/pages/privacy-policy/privacy-policy.component";

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent
      },
      {
        path: 'profile',
        component: ProfileComponent
      },
      {
        path: 'category',
        component: CategoryComponent,
      },
      {
        path: 'subcategory',
        component: SubcategoryComponent,
      },
      {
        path: 'brand',
        component: BrandComponent,
      },
      {
        path: 'promotion',
        component: PromotionComponent ,
      },
      {
        path: 'product',
        component: ProductComponent,
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: '/dashboard'
      },
    ]
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [NonAuthGuard]
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent,
    canActivate: [NonAuthGuard]
  },
  {
    path: 'recover-password',
    component: RecoverPasswordComponent,
    canActivate: [NonAuthGuard]
  },
  {
    path: 'privacy-policy',
    component: PrivacyPolicyComponent,
    canActivate: [NonAuthGuard]
  },
  {path: '**', redirectTo: ''}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {relativeLinkResolution: 'legacy', preloadingStrategy: PreloadAllModules})],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
