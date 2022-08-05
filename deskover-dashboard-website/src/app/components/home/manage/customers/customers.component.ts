import {Component, OnInit, ViewChild} from '@angular/core';
import {CustomerService} from "@services/customer.service";
import {Customer} from "@/entites/customer";
import {DataTableDirective} from "angular-datatables";
import {NotiflixUtils} from "@/utils/notiflix-utils";
import {environment} from "../../../../../environments/environment";
import {HttpParams} from "@angular/common/http";

@Component({
  selector: 'app-user',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss']
})
export class CustomersComponent implements OnInit {
  isActive: boolean = true;

  customers: Customer[] = [];
  customer: Customer = <Customer>{};

  dtOptions: any = {};

  @ViewChild(DataTableDirective, {static: false}) dtElement: DataTableDirective;

  constructor(private customerService: CustomerService) {
  }

  ngOnInit(): void {
    const self = this;

    this.dtOptions = {
      pagingType: 'full_numbers',
      language: {
        url: "//cdn.datatables.net/plug-ins/1.12.0/i18n/vi.json"
      },
      serverSide: true,
      processing: true,
      stateSave: true,
      columnDefs: [{
        "defaultContent": "-",
        "targets": "_all",
      }],
      ajax: (dataTablesParameters: any, callback) => {
        const params = new HttpParams().set("isActive", this.isActive.toString());
        this.customerService.getByActiveForDatatable(dataTablesParameters, params).subscribe(resp => {
          self.customers = resp.data;
          callback({
            recordsTotal: resp.recordsTotal,
            recordsFiltered: resp.recordsFiltered,
            data: []
          });
        });
      },
      columns: [
        {data: 'avatar', orderable: false, searchable: false},
        {data: 'fullname'},
        {data: 'modifiedAt'},
        {data: 'modifiedBy'},
        {data: 'lastLogin'},
        {data: null, orderable: false, searchable: false}
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
      dtInstance.draw();
    });
  }

  changeActive(customer: Customer) {
    if (customer.actived) {
      NotiflixUtils.showConfirm('Xác nhận xoá', 'Nguời dùng này sẽ bị khoá', () => {
        this.customerService.changeActive(customer.id).subscribe(data => {
          NotiflixUtils.successNotify('Khoá tài khoản thành công');
          this.rerender();
        });
      });
    } else {
      this.customerService.changeActive(customer.id).subscribe(data => {
        NotiflixUtils.successNotify('Kích hoạt tài khoản thành công');
        this.rerender();
      });
    }
  }

  getSrc(image: string) {
    return image ? `${environment.globalUrl.categoryImg}/${image}` : 'assets/images/no-image.png';
  }
}
