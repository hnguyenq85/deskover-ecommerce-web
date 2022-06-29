import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Discount} from "@/entites/discount";
import {Subject} from "rxjs";
import {DataTableDirective} from "angular-datatables";
import {NgbModal, NgbModalConfig} from "@ng-bootstrap/ng-bootstrap";
import {DiscountService} from "@services/discount.service";
import {DatePipe} from "@angular/common";
import {AlertUtils} from "@/utils/alert-utils";
import {BsDatepickerConfig} from "ngx-bootstrap/datepicker";

@Component({
  selector: 'app-promotion',
  templateUrl: './promotion.component.html',
  styleUrls: ['./promotion.component.scss']
})
export class PromotionComponent implements OnInit, OnDestroy, AfterViewInit {
  discounts: Discount[];
  discount: Discount;

  isEdit: boolean = false;
  isActive: boolean = true;

  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject();

  bsConfig?: Partial<BsDatepickerConfig>;

  @ViewChild('discountModal') discountModal: any;
  @ViewChild(DataTableDirective, {static: false}) dtElement: DataTableDirective;

  constructor(
    private modalConfig: NgbModalConfig,
    private modalService: NgbModal,
    private discountService: DiscountService,
  ) {
    modalConfig.backdrop = 'static';
    modalConfig.keyboard = false;
    modalConfig.centered = true;

    // Config datepicker ngx-bootstrap
    this.bsConfig = Object.assign({}, {
      containerClass: 'theme-dark-blue',
      withTimepicker: true,
      locale: 'vi',
      rangeInputFormat : 'DD/MM/YYYY HH:mm:ss',
      minDate: new Date()
    });
  }

  ngOnInit() {
    const self = this;

    self.dtOptions = {
      pagingType: 'full_numbers',
      language: {
        url: "//cdn.datatables.net/plug-ins/1.12.0/i18n/vi.json"
      },
      responsive: true,
      lengthMenu: [5, 10, 25, 50, 100],
      serverSide: true,
      processing: true,
      stateSave: true, // sau khi refresh sẽ giữ lại dữ liệu đã filter, sort và paginate
      ajax: (dataTablesParameters: any, callback) => {
        this.discountService.getByActiveForDatatable(dataTablesParameters, this.isActive).then(resp => {
          self.discounts = resp.data;
          callback({
            recordsTotal: resp.recordsTotal,
            recordsFiltered: resp.recordsFiltered,
            data: self.discounts
          });
        });
      },
      columns: [
        {title: 'Tên', data: 'name', className: 'align-middle'},
        // {title: 'Mô tả', data: 'description', className: 'align-middle'},
        {
          title: 'Mức giảm giá (%)', data: 'percent', className: 'align-middle text-start text-md-center',
          render(data, type, row, meta) {
            return `<span class="badge bg-danger">${data}</span>`;
          }
        },
        {
          title: 'Ngày bắt đầu', data: 'startDate', className: 'align-middle text-start text-md-center',
          render: function (data, type, row) {
            return new DatePipe('en-US').transform(data, 'dd/MM/yyyy HH:mm:ss');
          }
        },
        {
          title: 'Ngày kết thúc', data: 'endDate', className: 'align-middle text-start text-md-center',
          render: function (data, type, row) {
            return new DatePipe('en-US').transform(data, 'dd/MM/yyyy HH:mm:ss');
          }
        },
        {
          title: 'Ngày cập nhật', data: 'modifiedAt', className: 'align-middle text-start text-md-center',
          render: (data, type, full, meta) => {
            return new DatePipe('en-US').transform(data, 'dd/MM/yyyy');
          }
        },
        {title: 'Người cập nhật', data: 'modifiedBy', className: 'align-middle text-start text-md-center'},
        {
          title: 'Công cụ',
          data: null,
          orderable: false,
          searchable: false,
          className: 'align-middle text-start text-md-end',
          render: (data, type, full, meta) => {
            if (self.isActive) {
              return `
                <a href="javascript:void(0)" class="btn btn-edit btn-sm bg-faded-info" data-id="${data.id}"
                    title="Sửa" data-toggle="tooltip">
                    <i class="fa fa-pen-square text-info"></i>
                </a>
                <a href="javascript:void(0)" class="btn btn-delete btn-sm bg-faded-danger" data-id="${data.id}"
                    title="Xoá" data-toggle="tooltip">
                    <i class="fa fa-trash text-danger"></i>
                </a>
            `;
            } else {
              return `
               <button type="button" class="btn btn-active btn-sm bg-success" data-id="${data.id}">Kích hoạt</button>`
            }
          }
        },
      ]
    }
  }

  ngOnDestroy() {
    this.dtTrigger.unsubscribe();
  }

  ngAfterViewInit() {
    const self = this;
    this.dtTrigger.next();

    let body = $('body');
    body.on('click', '.btn-edit', function () {
      const id = $(this).data('id');
      self.getDiscount(id);
    });
    body.on('click', '.btn-delete', function () {
      const id = $(this).data('id');
      self.deleteDiscount(id);
    });
    body.on('click', '.btn-active', function () {
      const id = $(this).data('id');
      self.activeDiscount(id);
    });
  }

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next();
    });
  }

  filter() {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.ajax.reload();
    });
  }

  newDiscount() {
    this.isEdit = false;
    this.discount = <Discount>{
      discountTime: [new Date(), new Date()],
    };
    this.openModal(this.discountModal);
  }

  getDiscount(id: number) {
    this.discountService.getById(id).subscribe(data => {
      this.discount = data;
      this.discount.discountTime = [new Date(this.discount.startDate), new Date(this.discount.endDate)];
    });
    this.isEdit = true;
    this.openModal(this.discountModal);
  }

  saveDiscount(discount: Discount) {
    this.discount.startDate = this.discount.discountTime[0];
    this.discount.endDate = this.discount.discountTime[1];

    if (this.isEdit) {
      this.discountService.update(discount).subscribe(data => {
        AlertUtils.toastSuccess('Cập nhật thành công');
        this.rerender();
        this.closeModal();
      }, error => {
        AlertUtils.toastError(error);
      });
    } else {
      this.discountService.create(discount).subscribe(data => {
        AlertUtils.toastSuccess('Thêm mới thành công');
        this.rerender();
        this.closeModal();
      }, error => {
        AlertUtils.toastError(error);
      });
    }
  }

  deleteDiscount(id: number) {
    AlertUtils.warning('Xác nhận', 'Các danh mục con liên quan cũng sẽ bị xoá').then((result) => {
      if (result.value) {
        this.discountService.changeActive(id).subscribe(data => {
          AlertUtils.toastSuccess('Xoá danh mục thành công');
          this.rerender();
        });
      }
    });
  }

  activeDiscount(id: number) {
    this.discountService.changeActive(id).subscribe(data => {
      AlertUtils.toastSuccess('Kích hoạt danh mục thành công');
      this.rerender();
    });
  }

  // Modal
  openModal(content) {
    this.closeModal();
    this.modalService.open(content);
  }

  closeModal() {
    this.modalService.dismissAll();
  }
}
