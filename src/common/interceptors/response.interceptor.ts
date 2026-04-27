import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse } from '@common/interfaces/api-response.interface';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, ApiResponse<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<ApiResponse<T>> {
    return next.handle().pipe(
      map(data => {
        const resData = data?.data !== undefined ? data.data : data;
        const meta = data?.meta !== undefined ? data.meta : undefined;
        const message = data?.message !== undefined ? data.message : 'Success';

        return {
          success: true,
          message,
          data: resData,
          ...(meta && { meta })
        };
      })
    );
  }
}
