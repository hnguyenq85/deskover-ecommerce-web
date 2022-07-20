import { Injectable } from '@angular/core';
import {RestApiService} from "@services/rest-api.service";
import {environment} from "../../environments/environment";
import {HttpParams} from "@angular/common/http";
import {DataTablesResponse} from "@/entites/data-tables-response";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private url = environment.globalUrl.userApi

  constructor(private restApi: RestApiService) {}

  getByActiveForDatatable(tableQuery: any, params: HttpParams): Promise<DataTablesResponse> {
    return this.restApi.postWithParams(this.url + "/datatables", tableQuery, params).toPromise();
  }

  changeActive(id: number) {
    return this.restApi.delete(this.url, id);
  }
}
