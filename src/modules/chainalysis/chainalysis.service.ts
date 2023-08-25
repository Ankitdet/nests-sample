import { IAddressSanctioned } from '@core/interfaces'
import { HttpService } from '@nestjs/axios'
import { Injectable } from '@nestjs/common'
import { BaseHttpService } from '@shared/base.http.service'

@Injectable()
export class ChainalysisService extends BaseHttpService {
  constructor(protected httpService: HttpService) {
    super(httpService)
  }

  async getAddressSanctioned(address: string): Promise<IAddressSanctioned> {
    return await this.httpGet(
      `https://public.chainalysis.com/api/v1/address/${address}`,
      {
        headers: {
          'X-API-Key':
            'ca01fe7bad6efc4822e9777ada63040f02b2447fe3cb269a7cbdc85852d59b86',
          Accept: 'application/json',
        },
      },
    )
  }
}
