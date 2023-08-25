import { PANDA_DOC_API_KEY, PANDA_DOC_ENDPOINT, TEMPLATE_ID } from '@const/environments'
import { ICreateDoc } from '@core/interfaces/integration/panda-doc/panda-doc.interface'
import { HttpService } from '@nestjs/axios'
import { Injectable, Logger } from '@nestjs/common'
import { BaseHttpService } from '@shared/base.http.service'

@Injectable()
export class PandaDocService extends BaseHttpService {
  private readonly pandaLogger: Logger = null
  private readonly headers = {
    headers: {
      Authorization: `API-Key ${PANDA_DOC_API_KEY}`,
    },
  }
  constructor(protected httpService: HttpService) {
    super(httpService)
    this.pandaLogger = new Logger(PandaDocService.name, { timestamp: true })
  }

  async listTemplates(): Promise<any> {
    const resp = await this.httpGet(`${PANDA_DOC_ENDPOINT}/templates`, this.headers)
    this.pandaLogger.log(`List Template : ${resp}`)
    return resp
  }

  async getTemplateDetails(templateId: string): Promise<any> {
    const resp = await this.httpGet(
      `${PANDA_DOC_ENDPOINT}/templates/${templateId}/details`,
      this.headers,
    )
    this.pandaLogger.log(`Get Template Details : ${resp}`)
    return resp
  }

  async createDocument(input: ICreateDoc): Promise<any> {
    const data = {
      name: `${input.firstname} ${input.lastname} - RealEstate Invoice`,
      template_uuid: input.templateId || TEMPLATE_ID,
      recipients: [
        {
          email: input.email,
          first_name: input?.firstname,
          last_name: input?.lastname,
          role: 'RealEstate',
        },
      ],
      tokens: [
        {
          name: 'RealEstate.Address1',
          value: input?.address,
        },
        {
          name: 'RealEstate.DateInvested',
          value: input?.orderDate,
        },
        {
          name: 'RealEstate.DollarValues',
          value: input?.dollarValue,
        },
        {
          name: 'RealEstate.FirstName',
          value: input?.firstname,
        },
        {
          name: 'RealEstate.LastName',
          value: input?.lastname,
        },
        {
          name: 'RealEstate.Tokens',
          value: input?.tokens,
        },
      ],
      metadata: {
        user_id: input?.user_id,
        re_id: input?.re_id,
        order_id: input?.order_id,
        totalNumberOfTokens: input?.tokens,
      },
      tags: ['created_via_api', 'test_document'],
    }
    const resp = await this.httpPost(
      `${PANDA_DOC_ENDPOINT}/documents`,
      data,
      this.headers,
    )
    this.pandaLogger.log(`Document Creating : ${JSON.stringify(resp)}`)
    return resp
  }

  async checkDocumentStatus(documentId: string): Promise<any> {
    const resp = await this.httpGet(
      `${PANDA_DOC_ENDPOINT}/documents/${documentId}`,
      this.headers,
    )
    this.pandaLogger.log(`Document Status : ${JSON.stringify(resp)}`)
    return resp
  }

  async sendDocument(documentId: string): Promise<any> {
    const data = {
      message: 'RealEstate Invoice sending..',
      silent: false,
    }
    const resp = await this.httpPost(
      `${PANDA_DOC_ENDPOINT}/documents/${documentId}/send`,
      data,
      this.headers,
    )
    this.pandaLogger.log(
      `Creating the Document after status changed to drafted: ${resp}`,
    )
    return resp
  }
}
