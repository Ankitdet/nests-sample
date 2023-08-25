import { AppResolver } from '@app/app.resolver'
import { ICreateDoc } from '@core/interfaces/integration/panda-doc/panda-doc.interface'
import { Resolver } from '@nestjs/graphql'
import { logger } from '@shared/logger/logger'
import { UserService } from '../../user/user.service'
import { PandaDocService } from './panda-doc.service'

@Resolver(() => String)
export class PandaDocResolver extends AppResolver {
  constructor(
    public readonly pandadocService: PandaDocService,
    private readonly userService: UserService,
  ) {
    super()
  }

  async createAndSendingDocument(obj: ICreateDoc) {
    let jsonobject = null
    try {
      const userInfo = await this.userService.getCognitoUserDetail(
        obj?.user_id || '68c7a579-e25a-4abc-87a0-5351ddbadc5e',
      )
      logger.info(`Sending document to the user ${JSON.stringify(userInfo)}`)

      const input = {
        address: obj.address,
        orderDate: obj.orderDate,
        dollarValue: obj.dollarValue,
        order_id: obj.order_id,
        user_id: obj.user_id,
        re_id: obj.re_id,
        tokens: obj.tokens,
        email: userInfo.user.email || 'apdetrojaa@gmail.com',
        firstname: userInfo.user.firstname || 'A',
        lastname: userInfo.user.lastname || 'D',
      }
      logger.info(`Inside createAndSendingDocument : ${JSON.stringify(input)}`)
      // Step 1, creating the document from the template.
      jsonobject = await this.pandadocService.createDocument(input)
      // Step 2, check the status of document.
      await this.pandadocService.checkDocumentStatus(jsonobject?.id)
    } catch (e) {
      logger.error(`Error while sending the document`, JSON.stringify(e))
      return `error while sending the document, Document Id : ${jsonobject?.id} and Status : ${jsonobject?.status}`
    }
  }
}
