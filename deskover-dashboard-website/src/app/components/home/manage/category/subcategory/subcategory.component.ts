import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Subject} from "rxjs";
import {DataTableDirective} from "angular-datatables";
import {UrlUtils} from "@/utils/url-utils";
import {Subcategory} from "@/entites/subcategory";
import {SubcategoryService} from "@services/subcategory.service";
import {CategoryService} from "@services/category.service";
import {AlertUtils} from '@/utils/alert-utils';
import {Category} from "@/entites/category";
import {ModalDirective} from "ngx-bootstrap/modal";
import {FormControlDirective} from "@angular/forms";

@Component({
  selector: 'app-subcategory',
  templateUrl: './subcategory.component.html',
  styleUrls: ['./subcategory.component.scss'],
})
export class SubcategoryComponent implements OnInit, AfterViewInit, OnDestroy {
  subcategories: Subcategory[];
  subcategory: Subcategory = <Subcategory>{};

  categories: Category[];

  isEdit: boolean = false;
  isActive: boolean = true;
  categoryId: number = null;

  dtOptions: any = {};

  @ViewChild('subcategoryModal') subcategoryModal: ModalDirective;
  @ViewChild('subcategoryForm') subcategoryForm: FormControlDirective;
  @ViewChild(DataTableDirective, {static: false}) dtElement: DataTableDirective;

  constructor(
    private subcategoryService: SubcategoryService,
    private categoryService: CategoryService
  ) {
    this.getCategories();
  }

  ngOnInit() {
    const self = this;

    this.dtOptions = {
      pagingType: 'full_numbers',
      language: {
        url: "//cdn.datatables.net/plug-ins/1.12.0/i18n/vi.json"
      },
      lengthMenu: [5, 10, 25, 50, 100],
      responsive: true,
      serverSide: true,
      processing: true,
      stateSave: true,
      ajax: (dataTablesParameters: any, callback) => {
        this.subcategoryService.getByActiveForDatatable(dataTablesParameters, this.isActive, this.categoryId).then(resp => {
          self.subcategories = resp.data;
          callback({
            recordsTotal: resp.recordsTotal,
            recordsFiltered: resp.recordsFiltered,
            data: []
          });
        });
      },
      columns: [
        {data: 'imgUrl'},
        {data: 'name'},
        {data: 'slug'},
        {data: 'description'},
        {data: 'category.name'},
        {data: 'modifiedAt'},
        {data: null, orderable: false, searchable: false}
      ]
    }
  }

  ngAfterViewInit() {
    const self = this;
  }

  ngOnDestroy() {
  }

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

  getCategories() {
    this.categoryService.getByActive().subscribe(data => {
      this.categories = data;
    });
  }

  newSubcategory() {
    this.subcategoryForm.control.reset();
    this.isEdit = false;
    this.openModal(this.subcategoryModal);
  }

  getSubcategory(id: number) {
    this.subcategoryService.getOne(id).subscribe(data => {
      this.subcategory = data;
      this.isEdit = true;
      this.openModal(this.subcategoryModal);
    });
  }

  saveSubcategory(subcategory: Subcategory) {
    if (!this.isEdit) {
      this.subcategoryService.create(subcategory).subscribe(data => {
        AlertUtils.toastSuccess('Cập nhật thành công');
        this.rerender();
        this.closeModal(this.subcategoryModal);
      }, error => {
        AlertUtils.toastError(error);
      });
    } else {
      this.subcategoryService.update(subcategory).subscribe(data => {
        AlertUtils.toastSuccess('Thêm mới thành công');
        this.rerender();
        this.closeModal(this.subcategoryModal);
      }, error => {
        AlertUtils.toastError(error);
      });
    }
  }

  deleteSubcategory(id: number) {
    AlertUtils.warning('Xác nhận', 'Danh mục này sẽ bị khoá').then((result) => {
      if (result.value) {
        this.subcategoryService.changeActive(id).subscribe(data => {
          AlertUtils.toastSuccess('Xoá danh mục thành công');
          this.rerender();
        }, error => {
          AlertUtils.toastError(error);
        });
      }
    });
  }

  activeSubcategory(id: number) {
    this.subcategory = this.subcategories.find(item => item.id === id);
    if (this.subcategory) {
      if (!this.subcategory.category.actived) {
        AlertUtils.info('Danh mục cha đã bị khoá', 'Kích hoạt lại danh mục cha?').then((result) => {
          if (result.value) {
            this.categoryService.changeActive(this.subcategory.category.id).subscribe(data => {
              this.changeActive(id);
            });
          }
        });
      } else {
        this.changeActive(id);
      }
    }
  }

  private changeActive(id: number) {
    this.subcategoryService.changeActive(id).subscribe(data => {
      AlertUtils.toastSuccess('Kích hoạt danh mục thành công');
      this.rerender();
    }, error => {
      AlertUtils.toastError(error);
    });
  }

  compareFn(c1: any, c2: any): boolean {
    return c1 && c2 ? c1.id === c2.id : c1 === c2;
  }

  // Slugify
  toSlug(text: string) {
    return UrlUtils.slugify(text);
  }

  // Modal bootstrap
  openModal(content: ModalDirective) {
    if(!content.isShown) {
      content?.show();
    }
  }

  closeModal(content: ModalDirective) {
    content?.hide();
  }

}
