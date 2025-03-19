
import { HttpClient, HttpParams, HttpResponse } from "@angular/common/http";
import { map } from "rxjs";
import { PaginatedResult } from "../_models/pagination";

export function getPaginatedResult<T>(url: string, params: HttpParams, http: HttpClient) {
    const paginatedResult: PaginatedResult<T> = new PaginatedResult<T>();
  
    return http.get<T>(url, { observe: 'response', params }).pipe(
      map((response: HttpResponse<T>) => {
        paginatedResult.result = response.body ?? undefined; // Handle `null` case for `response.body`
  
        const paginationHeader = response.headers.get('Pagination');
        if (paginationHeader) {
          paginatedResult.pagination = JSON.parse(paginationHeader); // Handle `null` case for headers
        }
  
        return paginatedResult;
      })
    );
  }
  
  export function getPaginationHeaders(pageNumber: number, pageSize: number) {
    let params = new HttpParams();

    params = params.append('pageNumber', pageNumber);
    params = params.append('pageSize', pageSize);

    return params;

  }