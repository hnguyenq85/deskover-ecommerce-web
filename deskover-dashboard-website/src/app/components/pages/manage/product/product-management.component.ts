import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {Product} from "@/entites/product";
import {DataTableDirective} from "angular-datatables";
import {ProductService} from "@services/product.service";
import {AlertUtils} from "@/utils/alert-utils";
import {Category} from "@/entites/category";
import {CategoryService} from '@services/category.service';
import {Subcategory} from "@/entites/subcategory";
import {SubcategoryService} from "@services/subcategory.service";
import {UrlUtils} from "@/utils/url-utils";
import {ModalDirective} from "ngx-bootstrap/modal";
import {Brand} from "@/entites/brand";
import {BrandService} from "@services/brand.service";
import {FormControlDirective} from "@angular/forms";

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit, AfterViewInit {

  products: Product[];
  product: Product;
  categories: Category[];
  category: Category;
  subcategories: Subcategory[];
  subcategory: Subcategory;
  brands: Brand[];
  brand: Brand;

  category_id_filter: number = null;

  isEdit: boolean = false;
  isActive: boolean = true;

  dtOptions: any = {};

  @ViewChild('productModal') productModal: ModalDirective;
  @ViewChild('productForm') productForm: FormControlDirective;
  @ViewChild(DataTableDirective, {static: false}) dtElement: DataTableDirective;

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private subcategoryService: SubcategoryService,
    private brandService: BrandService,
  ) {
    this.newData();

    this.getCategories();
    this.getBrands();
  }

  ngOnInit() {
    const self = this;

    self.dtOptions = {
      pagingType: 'full_numbers',
      language: {
        url: "//cdn.datatables.net/plug-ins/1.12.0/i18n/vi.json"
      },
      lengthMenu: [5, 10, 25, 50, 100],
      responsive: false,
      serverSide: true,
      processing: true,
      stateSave: true,
      columnDefs: [{
        "defaultContent": "",
        "targets": "_all",
      }],
      ajax: (dataTablesParameters: any, callback) => {
        this.productService.getByActiveForDatatable(dataTablesParameters, this.isActive, this.category_id_filter).then(resp => {
          self.products = resp.data;
          callback({
            recordsTotal: resp.recordsTotal,
            recordsFiltered: resp.recordsFiltered,
            data: []
          });
        });
      },
      columns: [
        {data: 'image', orderable: false, searchable: false},
        {data: 'name'},
        {data: 'brand.name'},
        {data: 'subCategory.name'},
        {data: 'price'},
        {data: 'modifiedAt'},
        {data: 'modifiedBy'},
        {data: null, orderable: false, searchable: false,},
      ]
    }
  }

  ngAfterViewInit() {
    const self = this;

    let body = $('body');
    body.on('click', '.btn-edit', function () {
      const id = $(this).data('id');
      self.editProduct(id);
    });
    body.on('click', '.btn-delete', function () {
      const id = $(this).data('id');
      self.deleteProduct(id);
    });
    body.on('click', '.btn-active', function () {
      const id = $(this).data('id');
      self.activeProduct(id);
    });
  }

  /* Category & Subcategory */
  getCategories() {
    this.categoryService.getByActive().subscribe(data => {
      this.categories = data;
    });
  }

  getSubcategoriesByCategory() {
    this.subcategoryService.getByActive(true, this.category.id).subscribe(data => {
      this.subcategories = data;
      console.log(this.subcategories);
    });
  }

  getBrands() {
    this.brandService.getByActive().subscribe(data => {
      this.brands = data;
    });
  }

  newData() {
    this.product = <Product>{
      id: null,
      name: '',
      slug: '',
      description: '',
      price: null,
      image: '',
      modifiedAt: null,
      modifiedBy: '',
      actived: true,
      spec:`
        <div class="row pt-2">
          <div class="col-lg-5 col-sm-6">
            <h3 class="h6">General specs</h3>
            <ul class="list-unstyled fs-sm pb-2">
              <li class="d-flex justify-content-between pb-2 border-bottom"><span class="text-muted">Model:</span><span>Amazfit Smartwatch</span></li>
              <li class="d-flex justify-content-between pb-2 border-bottom"><span class="text-muted">Gender:</span><span>Unisex</span></li>
              <li class="d-flex justify-content-between pb-2 border-bottom"><span class="text-muted">Smartphone app:</span><span>Amazfit Watch</span></li>
              <li class="d-flex justify-content-between pb-2 border-bottom"><span class="text-muted">OS campitibility:</span><span>Android / iOS</span></li>
            </ul>
            <h3 class="h6">Physical specs</h3>
            <ul class="list-unstyled fs-sm pb-2">
              <li class="d-flex justify-content-between pb-2 border-bottom"><span class="text-muted">Shape:</span><span>Rectangular</span></li>
              <li class="d-flex justify-content-between pb-2 border-bottom"><span class="text-muted">Body material:</span><span>Plastics / Ceramics</span></li>
              <li class="d-flex justify-content-between pb-2 border-bottom"><span class="text-muted">Band material:</span><span>Silicone</span></li>
            </ul>
            <h3 class="h6">Display</h3>
            <ul class="list-unstyled fs-sm pb-2">
              <li class="d-flex justify-content-between pb-2 border-bottom"><span class="text-muted">Display type:</span><span>Color</span></li>
              <li class="d-flex justify-content-between pb-2 border-bottom"><span class="text-muted">Display size:</span><span>1.28"</span></li>
              <li class="d-flex justify-content-between pb-2 border-bottom"><span class="text-muted">Screen resolution:</span><span>176 x 176</span></li>
              <li class="d-flex justify-content-between pb-2 border-bottom"><span class="text-muted">Touch screen:</span><span>No</span></li>
            </ul>
          </div>
          <div class="col-lg-5 col-sm-6 offset-lg-1">
            <h3 class="h6">Functions</h3>
            <ul class="list-unstyled fs-sm pb-2">
              <li class="d-flex justify-content-between pb-2 border-bottom"><span class="text-muted">Phone calls:</span><span>Incoming call notification</span></li>
              <li class="d-flex justify-content-between pb-2 border-bottom"><span class="text-muted">Monitoring:</span><span>Heart rate / Physical activity</span></li>
              <li class="d-flex justify-content-between pb-2 border-bottom"><span class="text-muted">GPS support:</span><span>Yes</span></li>
              <li class="d-flex justify-content-between pb-2 border-bottom"><span class="text-muted">Sensors:</span><span>Heart rate, Gyroscope, Geomagnetic, Light sensor</span></li>
            </ul>
            <h3 class="h6">Battery</h3>
            <ul class="list-unstyled fs-sm pb-2">
              <li class="d-flex justify-content-between pb-2 border-bottom"><span class="text-muted">Battery:</span><span>Li-Pol</span></li>
              <li class="d-flex justify-content-between pb-2 border-bottom"><span class="text-muted">Battery capacity:</span><span>190 mAh</span></li>
            </ul>
            <h3 class="h6">Dimensions</h3>
            <ul class="list-unstyled fs-sm pb-2">
              <li class="d-flex justify-content-between pb-2 border-bottom"><span class="text-muted">Dimensions:</span><span>195 x 20 mm</span></li>
              <li class="d-flex justify-content-between pb-2 border-bottom"><span class="text-muted">Weight:</span><span>32 g</span></li>
            </ul>
          </div>
        </div>`,
      video: '',
      brand: <Brand>{
        id: null,
      },
      subCategory: <Subcategory>{
        category: <Category>{}
      }
    };
    this.category = <Category>{
      id: null,
      name: '',
      description: '',
      slug: '',
      modifiedAt: null,
      modifiedBy: '',
      actived: true,
    };
    this.subcategory = <Subcategory>{
      id: null,
      name: '',
      description: '',
      slug: '',
      modifiedAt: null,
      modifiedBy: '',
      actived: true
    };
    this.brand = <Brand>{
      id: null,
      name: '',
      description: '',
      slug: '',
      modifiedAt: null,
      modifiedBy: '',
      actived: true
    };
  }

  /* Product */
  newProduct() {
    this.productForm.control.reset();
    this.isEdit = false;
    this.newData();
    this.openModal(this.productModal);
  }

  editProduct(id: number) {
    this.productService.getById(id).subscribe(data => {
      this.product = data;
      this.category = data.subCategory.category;
    });
    this.openModal(this.productModal);
    this.isEdit = true;
  }

  saveProduct(product: Product) {
    if (this.isEdit) {
      this.productService.update(product).subscribe(data => {
        AlertUtils.toastSuccess('Cập nhật thành công');
        this.rerender();
        this.closeModal();
      }, error => {
        AlertUtils.toastError(error);
      });
    } else {
      this.productService.create(product).subscribe(data => {
        AlertUtils.toastSuccess('Thêm mới thành công');
        this.rerender();
        this.closeModal();
      }, error => {
        AlertUtils.toastError(error);
      });
    }
  }

  deleteProduct(id: number) {
    AlertUtils.warning('Xác nhận', 'Các danh mục con liên quan cũng sẽ bị xoá').then((result) => {
      if (result.value) {
        this.productService.changeActive(id).subscribe(data => {
          AlertUtils.toastSuccess('Xoá danh mục thành công');
          this.rerender();
        });
      }
    });
  }

  activeProduct(id: number) {
    this.productService.changeActive(id).subscribe(data => {
      AlertUtils.toastSuccess('Kích hoạt danh mục thành công');
      this.rerender();
    });
  }

  /* Slugify */
  toSlug(text: string) {
    return UrlUtils.slugify(text);
  }

  /* Modal */
  openModal(content) {
    this.productModal.show();
  }

  closeModal() {
    this.productModal.hide();
  }

  /* Other */
  rerender() {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.ajax.reload(null, false);
    });
  }

  filter() {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.draw();
    });
  }

  compareFn(c1: any, c2: any): boolean {
    return c1 && c2 ? c1.id === c2.id : c1 === c2;
  }
}
