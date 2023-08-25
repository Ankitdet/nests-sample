import * as Trigger from '@const/common.const'
import { AWS_CREDENTIAL, SES_EMAIL } from '@const/environments'
import { HttpService } from '@nestjs/axios'
import { Injectable } from '@nestjs/common'
import { BaseHttpService } from '@shared/base.http.service'
import { logger } from '@shared/logger/logger'
import { getTemplate } from '@utils/index'
import AWS from 'aws-sdk'

@Injectable()
export class AWSSesService extends BaseHttpService {
  private readonly ses = {}

  constructor(protected httpService: HttpService) {
    super(httpService)
    this.ses = {
      ...AWS_CREDENTIAL,
      region: 'us-east-1',
    }
  }

  async onfidoKycEmail(_toAddress: string, kycStatus: boolean) {
    const AWS_SES = await new AWS.SES(this.ses)
      .sendEmail({
        Source: SES_EMAIL,
        Destination: {
          ToAddresses: [_toAddress],
        },
        ReplyToAddresses: [],
        Message: {
          Body: {
            Html: {
              Charset: 'UTF-8',
              Data: kycStatus
                ? `Thank you for completing your KYC process on 3Blocks platform. We confirm that the KYC documents are successfully accepted. Please review the investment opportunities and start investing in Tokenized real estate.`
                : `Thank you for completing your KYC process on 3Blocks platform. We regret to inform you that the documents are not accepted at this moment. Please write to us at admin@3Blocks.io to discuss the details.`,
            },
          },
          Subject: {
            Charset: 'UTF-8',
            Data: kycStatus
              ? `3Blocks - KYC is successful`
              : `3Blocks - KYC is not successful`,
          },
        },
      })
      .promise()
      .catch(e => {
        logger.error(`Error while Sending Success Email ${JSON.stringify(e)}`)
        throw e
      })
    logger.info(`SES Success Email Sent: ${JSON.stringify(AWS_SES)}`)
  }

  async successEmail(order_id: string, _toAddress?: string): Promise<any> {
    const AWS_SES = await new AWS.SES(this.ses)
      .sendEmail({
        Source: SES_EMAIL,
        Destination: {
          ToAddresses: [_toAddress],
          // CcAddresses: ['siddu@3blocks.io'],
        },
        ReplyToAddresses: [],
        Message: {
          Body: {
            Html: {
              Charset: 'UTF-8',
              Data: await getTemplate('order-success', { orderId: order_id }),
            },
          },
          Subject: {
            Charset: 'UTF-8',
            Data: `Congratulations, your order at 3Blocks is completed successfully.`,
          },
        },
      })
      .promise()
      .catch(e => {
        logger.error(`Error while Sending Success Email ${JSON.stringify(e)}`)
        throw e
      })
    logger.info(`SES Success Email Sent: ${JSON.stringify(AWS_SES)}`)
    return AWS_SES.MessageId
  }

  async failedTokenTransfered(
    order_id: string,
    re_id: string,
    tokensInThisOrder: number,
    user_id: string,
    error: string,
  ): Promise<any> {
    logger.info(`Triggering Token transfer failed email 
      orderId: ${order_id},
      reId: ${re_id},
      tokensInThisOrder: ${tokensInThisOrder},
      userId: ${user_id},
      error : ${error}
      }`)
    const AWS_SES = await new AWS.SES(this.ses)
      .sendEmail({
        Source: SES_EMAIL,
        Destination: {
          ToAddresses: ['admin@3blocks.io'],
          CcAddresses: [
            'tom.oommen@3blocks.io',
            'marc@3blocks.io',
            'siddu@3blocks.io',
            'ankit@3blocks.io',
          ],
        },
        ReplyToAddresses: [],
        Message: {
          Body: {
            Html: {
              Charset: 'UTF-8',
              Data: await getTemplate('token-transfer-failed', {
                orderId: order_id,
                re_id,
                tokensInThisOrder,
                user_id,
                error,
              }),
            },
          },
          Subject: {
            Charset: 'UTF-8',
            Data: `Regret to inform you that the order status is failed`,
          },
        },
      })
      .promise()
      .catch(e => {
        logger.error(e)
        throw e
      })
    logger.info(`SES Failed Email Sent: ${JSON.stringify(AWS_SES)}`)
    return AWS_SES.MessageId
  }
  async failedEmail(order_id: string): Promise<any> {
    const AWS_SES = await new AWS.SES(this.ses)
      .sendEmail({
        Source: SES_EMAIL,
        Destination: {
          ToAddresses: ['apdetrojaa@gmail.com'],
        },
        ReplyToAddresses: [],
        Message: {
          Body: {
            Html: {
              Charset: 'UTF-8',
              Data: await getTemplate('order-failure', { orderId: order_id }),
            },
          },
          Subject: {
            Charset: 'UTF-8',
            Data: `Your order at 3Blocks is failed/Expired.`,
          },
        },
      })
      .promise()
      .catch(e => {
        logger.error(e)
        throw e
      })
    logger.info(`SES Failed Email Sent: ${JSON.stringify(AWS_SES)}`)
    return AWS_SES.MessageId
  }

  public async sendEmailNow(resp: any) {
    logger.info(`sendEmailNow: ${JSON.stringify(resp)}`)
    const AWS_SES = await new AWS.SES(this.ses)
      .sendEmail({
        Source: SES_EMAIL,
        Destination: {
          ToAddresses: [resp?.email],
        },
        ReplyToAddresses: [],
        Message: {
          Body: {
            Html: {
              Charset: 'UTF-8',
              Data: resp?.emailMessage,
            },
          },
          Subject: {
            Charset: 'UTF-8',
            Data: resp?.emailSubject,
          },
        },
      })
      .promise()
      .catch(e => {
        logger.error(e)
        throw e
      })
    logger.info(`Email Sent : ${JSON.stringify(AWS_SES)}`)
    return AWS_SES.MessageId
  }

  /*
  {
    "userAttributes": {
        "sub": "085b360b-75ec-4aeb-b122-898142b1eb96",
        "cognito:email_alias": "ankitdetroja@gmail.com",
        "email_verified": "false",
        "cognito:user_status": "UNCONFIRMED",
        "name": "ankitdetroja@gmail.com",
        "family_name": "ANKIT",
        "email": "ankitdetroja@gmail.com"
    },
    "codeParameter": "{####}",
    "linkParameter": "{##Click Here##}",
    "usernameParameter": null
} */

  public async customMessageTrigger(event: any) {
    let resp = {}
    const email = event?.request?.userAttributes?.email
    const username =
      event.request.usernameParameter || event?.request?.userAttributes?.email
    const codeParam = event?.request.codeParameter
    // const linkParameter = event?.request.linkParameter

    switch (event.triggerSource) {
      // Sign-up trigger whenever a new user signs him/herself up.
      /* case Trigger.CustomMessageSignUp:
        resp = {
          emailSubject: 'Confirm your sign up',
          emailMessage: this.generate_email_body(
            '<p>Your username is ' +
              username +
              ' and password is ' +
              codeParam +
              '</p>',
          ),
        }
        break */
      // When the user is created with adminCreateUser() API
      case Trigger.CustomMessageAdminCreateUser:
        resp = {
          emailSubject:
            'Welcome to 3Blocks. Your journey to fractional real estate ownership begins here. Your temporary account details',
          emailMessage: this.templateInvite(email, codeParam, username),
        }
        break
      // When user requests the code again.
      case Trigger.CustomMessageResendCode:
        resp = {
          emailSubject: 'Resend code',
          emailMessage: this.generate_email_body(
            '<p>Your username is ' + email + ' and code is ' + codeParam + '</p>',
          ),
        }
        break
      // Forgot password request initiated by user
      /* case Trigger.CustomMessageForgotPassword:
        /* resp = {
          emailSubject: 'Forgot password',
          emailMessage: this.generate_email_body(
            '<p>Your forgot password link is ' + linkParameter + '</p>',
          ),
        }
        break */
      // Whenever the user attributes are updated
      case Trigger.CustomMessageUpdateUserAttribute:
        resp = {
          emailSubject: 'User updated',
          emailMessage: this.generate_email_body(
            '<p>Your username is ' + username + '</p>',
          ),
        }
        break
      // Verify mobile number/email
      case Trigger.CustomMessageVerifyUserAttribute:
        resp = {
          emailSubject: 'Verify user attribute',
          emailMessage: this.generate_email_body(
            '<p>Your username is ' + username + '</p>',
          ),
        }
        break
      // MFA authenitcation code.
      case Trigger.CustomMessageAuthentication:
        resp = {
          emailSubject: 'MFA Authenitcation',
          emailMessage: this.generate_email_body(
            '<p>Your username is ' + username + ' and code is ' + codeParam + '</p>',
          ),
        }
        break
    }
    if (
      event.triggerSource !== Trigger.CustomMessageSignUp &&
      event.triggerSource !== Trigger.CustomMessageForgotPassword
    ) {
      await this.sendEmailNow({
        ...resp,
        email,
      })
    }
  }

  private readonly generate_email_body = emailBody => `
    <html>
        <body>
            <table align="center"  cellpadding="0" cellspacing="0" width="600" >
                <tr>
                    <td bgcolor="#ffffff" style="padding: 40px 0 30px 0;"><img src="" alt="Logo"  height="230" style="display: block;"></td>
                </tr>
                <tr>
                    <td bgcolor="#ffffff"><p style="margin: 0;">${emailBody}</p></td>
                </tr>
                <tr>
                    <td bgcolor="#ffffff" style="font-weight: 500; font-size: 11px"><p>© Copyright ${new Date().getFullYear()}. 3Blocks.io All Rights Reserved.</p></td>
                </tr>
            </table>
        </body>
    </html>
`

  private readonly templateInvite = (
    email: string,
    code: any,
    username: string,
  ) => `<html>
  <body
    style="
      background-color: #333;
      font-family: PT Sans, Trebuchet MS, sans-serif;
    "
  >
    <div
      style="
        margin: 0 auto;
        width: 600px;
        background-color: #fff;
        font-size: 1.2rem;
        font-style: normal;
        font-weight: normal;
        line-height: 19px;
      "
      align="center"
    >
      <div style="padding: 20">
        <img
          style="
            border: 0;
            display: block;
            height: auto;
            width: 100%;
            max-width: 373px;
          "
          alt="Animage"
          height="200"
          width="300"
          src="https://static.wixstatic.com/media/e318d4_d9ef3981…6_1.00_0.01,enc_auto/3BlocksScreenCapture_JPG.jpg"
        />

        <h2
          style="
            font-size: 28px;
            margin-top: 20px;
            margin-bottom: 0;
            font-style: normal;
            font-weight: bold;
            color: #000;
            font-size: 24px;
            line-height: 32px;
            text-align: center;
          "
        >
          Hi ${email}
        </h2>
        <p
          style="
            margin-top: 20px;
            margin-bottom: 0;
            font-size: 16px;
            line-height: 24px;
            color: #000;
          "
        >
          Here is your temporary login details
        </p>

        <div style="display: inline-block; margin: 0 auto">
          <h2
            style="
              margin-top: 20px;
              margin-bottom: 0;
              font-size: 16px;
              line-height: 24px;
              color: #000;
              text-align: left;
            "
          >
            user_name: ${username}
          </h2>
          <h2
            style="
              margin-top: 20px;
              margin-bottom: 0;
              font-size: 16px;
              line-height: 24px;
              color: #000;
              text-align: left;
            "
          >
            temporary_password: ${code}
          </h2>
        </div>
      </div>
    </div>
  </body>
</html>
`
}
