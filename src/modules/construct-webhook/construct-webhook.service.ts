import { ONFIDO_API_TOKEN, ONFIDO_WORKFLOW_RUN } from '@const/environments'
import { updateOnfidoKYCStatusInDB } from '@db/user/users.db'
import { HttpService } from '@nestjs/axios'
import { Injectable } from '@nestjs/common'
import { BaseHttpService } from '@shared/base.http.service'
import { logger } from '@shared/logger/logger'

@Injectable()
export class ConstructWebhookService extends BaseHttpService {
  constructor(protected httpService: HttpService) {
    super(httpService)
    logger.info('Webhook called.')
  }

  async updateOnfidoKYCStatus(onfido: any): Promise<void> {
    if (onfido.action === 'workflow_run.completed') {
      const workflow_run_id = onfido?.object?.id
      const data = await super.httpGet(`${ONFIDO_WORKFLOW_RUN}/${workflow_run_id}`, {
        headers: {
          Authorization: `Token token=${ONFIDO_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
      })

      logger.info(data.state)
      await updateOnfidoKYCStatusInDB(workflow_run_id, data.state)
    }
  }
}
