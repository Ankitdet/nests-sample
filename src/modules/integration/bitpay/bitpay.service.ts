import { HttpService } from '@nestjs/axios'
import { Injectable } from '@nestjs/common'
import { BaseHttpService } from '@shared/base.http.service'

@Injectable()
export class BitpayService extends BaseHttpService {
  constructor(protected httpService: HttpService) {
    super(httpService)
  }

  // create invoice
  async createInvoice(_data: any): Promise<any> {
    return 'INVOICE CALLED!'
  }
}
