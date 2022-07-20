// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
export const BASE_API = 'http://localhost:8080/v1/api';
export const BASE_URL = 'http://localhost:8080';

export const environment = {
  production: false,
  globalUrl: {
    getAvatarUser: BASE_URL + '/img/admin/avatar',
    getProductThumbnail: BASE_API + '/img/shop/products',

    login: BASE_API + '/admin/auth/login',
    getPrincipal: BASE_API + '/admin/auth/get-principal',
    adminApi: BASE_API + '/admin',
    categoryApi: BASE_API + '/admin/categories',
    subcategoryApi: BASE_API + '/admin/subcategories',
    brandApi: BASE_API + '/admin/brands',
    discountApi: BASE_API + '/admin/discounts',
    productApi: BASE_API + '/admin/products',
    uploadProductImageApi: BASE_API + '/admin/products/upload-image',
  },
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
