import {Category} from '@/entites/category';
import {Component, OnInit, ViewChild} from '@angular/core';
import {UrlUtils} from "@/utils/url-utils";
import {DataTableDirective} from "angular-datatables";
import {CategoryService} from "@services/category.service";
import {NotiflixUtils} from '@/utils/notiflix-utils';
import {ModalDirective} from "ngx-bootstrap/modal";
import {FormControlDirective} from "@angular/forms";
import {UploadService} from "@services/upload.service";

@Component({
  selector: 'app-category',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss'],
})
export class CategoriesComponent implements OnInit {

  categories: Category[];
  category: Category = <Category>{};

  isEdit: boolean = false;
  isActive: boolean = true;

  dtOptions: any = {};

  @ViewChild('categoryModal') categoryModal: ModalDirective;
  @ViewChild('categoryForm') categoryForm: FormControlDirective;
  @ViewChild(DataTableDirective, {static: false}) dtElement: DataTableDirective;

  constructor(private categoryService: CategoryService, private uploadService: UploadService) {
  }

  ngOnInit() {
    const self = this;

    this.dtOptions = {
      pagingType: 'full_numbers',
      language: {
        url: "//cdn.datatables.net/plug-ins/1.12.0/i18n/vi.json"
      },
      lengthMenu: [5, 10, 25, 50, 100],
      serverSide: true,
      processing: true,
      stateSave: true,
      ajax: (dataTablesParameters: any, callback) => {
        this.categoryService.getByActiveForDatatable(dataTablesParameters, this.isActive).subscribe(resp => {
          self.categories = resp.data;
          callback({
            recordsTotal: resp.recordsTotal,
            recordsFiltered: resp.recordsFiltered,
            data: []
          });
        });
      },
      columns: [
        {data: 'imgUrl', orderable: false, searchable: false},
        {data: 'name'},
        {data: 'slug'},
        {data: 'description'},
        {data: 'modifiedAt'},
        {data: null, orderable: false, searchable: false},
      ]
    }
  }

  rerender() {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.ajax.reload(null, false);
    });
  }

  filter() {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.ajax.reload();
    });
  }

  newCategory() {
    this.categoryForm.control.reset();
    this.isEdit = false;
    this.category = <Category>{};
    this.openModal(this.categoryModal);
  }

  getCategory(id: number) {
    this.categoryService.getById(id).subscribe(data => {
      this.category = data;

      this.isEdit = true;
      this.openModal(this.categoryModal);
    });
  }

  saveCategory(category: Category) {
    if (this.isEdit) {
      this.categoryService.update(category).subscribe(data => {
        NotiflixUtils.successNotify('C???p nh???t th??nh c??ng');
        this.rerender();
        this.closeModal();
      });
    } else {
      this.categoryService.create(category).subscribe(data => {
        NotiflixUtils.successNotify('Th??m m???i th??nh c??ng');
        this.rerender();
        this.closeModal();
      });
    }
  }

  deleteCategory(category: Category) {
    NotiflixUtils.showConfirm('X??c nh???n xo??', 'C??c danh m???c con thu???c "' + category.name + '" s??? b??? xo??!', () => {
      this.categoryService.changeActive(category.id).subscribe(data => {
        NotiflixUtils.successNotify('Xo?? danh m???c th??nh c??ng');
        this.rerender();
      });
    });
  }

  activeCategory(id: number) {
    this.categoryService.changeActive(id).subscribe(data => {
      NotiflixUtils.successNotify('K??ch ho???t danh m???c th??nh c??ng');
      this.rerender();
    });
  }

  // Slugify
  toSlug(text: string) {
    return UrlUtils.slugify(text);
  }

  // Modal
  openModal(content) {
    this.categoryModal.show();
  }

  closeModal() {
    this.categoryModal.hide();
  }

  selectedImageChanged($event: Event) {
    const file = $event.target['files'][0];
    this.uploadService.uploadImage(file).subscribe(data => {
      this.category.imgUrl = data.url;
      this.category.img = data.filename;
    });
  }
}
