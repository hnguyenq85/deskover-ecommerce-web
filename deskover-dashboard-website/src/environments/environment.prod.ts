export const BASE_API = 'http://localhost:8080/v1/api';
export const BASE_URL = 'http://localhost:8080';

export const environment = {
  production: false,

  ghtkToken: '2C925D6789957674DcC9121bf419Df1a2F7b0BC3',
  globalUrl: {
    ckeditor: 'https://cdn.ckeditor.com/4.19.1/full/ckeditor.js',

    productItem: BASE_URL + '/shop/item',

    avatarUser: BASE_URL + '/img/admin/avatar',
    productThumbnail: BASE_URL + '/img/shop/products',
    qrCode : BASE_URL + '/img/qrcode',

    login: BASE_API + '/admin/auth/login',
    getPrincipal: BASE_API + '/admin/auth/get-principal',

    ghtkApi: BASE_API + '/ghtk',
    adminApi: BASE_API + '/admin',
    categoryApi: BASE_API + '/admin/categories',
    subcategoryApi: BASE_API + '/admin/subcategories',
    brandApi: BASE_API + '/admin/brands',
    discountApi: BASE_API + '/admin/discounts',
    productApi: BASE_API + '/admin/products',
    userApi: BASE_API + '/admin/users',
    uploadFileApi: BASE_API + '/admin/upload-file',
    orderApi: BASE_API + '/admin/orders',
  },
};
