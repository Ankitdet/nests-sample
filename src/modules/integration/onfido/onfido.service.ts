import { ONFIDO_API_TOKEN, ONFIDO_WORKFLOW_RUN } from '@const/environments'
import { IOnfidoUploadDocument, WorkFlowRunResponseInput } from '@core/inputs'
import {
  IApplicant,
  IApplicantRequest,
  IGenerateSdkToken,
  IReport,
  IWorkFlowRun,
} from '@core/interfaces'
import { updateWorkflowRunId, UserDB } from '@db/user/users.db'
import { HttpService } from '@nestjs/axios'
import { HttpStatus, Injectable } from '@nestjs/common'
import {
  Check,
  CheckRequest,
  LivePhoto,
  LivePhotoRequest,
  Onfido,
  Region,
} from '@onfido/api'
import { axiosPost, BaseHttpService } from '@shared/base.http.service'
import { BaseError, OnfidoError } from '@shared/errors'
import { logger } from '@shared/logger/logger'
import * as fs from 'fs'

const onfido = new Onfido({
  apiToken: ONFIDO_API_TOKEN,
  // Supports Region.EU, Region.US and Region.CA
  region: Region.US,
})

@Injectable()
export class OnfidoSevice extends BaseHttpService {
  constructor(protected httpService: HttpService) {
    super(httpService)
  }

  // Retrieve applicant
  async getApplicantById(applicantId: string): Promise<any> {
    logger.info('inside getApplicantBy Id')
    let res = null
    try {
      res = await onfido.applicant.find(applicantId)
    } catch (err) {
      logger.error('Getting error while findbyId - OnfidoService', err)
      throw new OnfidoError(err)
    }
    return res
  }

  // Create Applicant
  async createApplicant(data: IApplicantRequest): Promise<IApplicant> {
    let res = null
    try {
      res = await onfido.applicant.create({
        address: data.address,
        dob: data.dob,
        email: data.email,
        firstName: data.firstName,
        idNumbers: data.idNumbers,
        lastName: data.lastName,
      })
    } catch (err) {
      logger.error('Getting error while createApplicant - OnfidoService', err)
      throw new OnfidoError(err)
    }
    return res
  }

  // Update applicant
  async updateApplicant(
    applicantId: string,
    data: IApplicantRequest,
  ): Promise<IApplicant> {
    let res = null
    try {
      res = await onfido.applicant.update(applicantId, data)
    } catch (err) {
      logger.error('Getting error while updateApplicant - OnfidoService', err)
      throw new OnfidoError(err)
    }
    return res
  }

  // List applicant
  async listApplicants(): Promise<IApplicant[]> {
    let data = null
    try {
      data = await onfido.applicant.list({
        includeDeleted: true,
        page: 1,
        perPage: 10,
      })
    } catch (error) {
      logger.error('Getting error while listing - OnfidoService', error)
      throw new OnfidoError(error)
    }
    return data
  }

  // Upload Documents
  async uploadDocuments(
    file: string,
    _type?: string,
    _side?: string,
    _applicant_id?: string,
  ): Promise<IOnfidoUploadDocument> {
    const fs = require('fs')
    let data = null
    try {
      data = await onfido.document.upload({
        applicantId: _applicant_id,
        file: fs.createReadStream(file),
        type: _type,
        side: _side,
      })
    } catch (error) {
      logger.error('Getting error while uploading file - OnfidoService', error)
      throw new OnfidoError(error)
    }
    return data
  }
  async retrieveDocument(documentId: string): Promise<IOnfidoUploadDocument> {
    let data = null
    try {
      data = await onfido.document.find(documentId)
    } catch (error) {
      logger.error('Getting error while uploading file - OnfidoService', error)
      throw new OnfidoError(error)
    }
    return data
  }

  async listDocuments(applicantId: string): Promise<IOnfidoUploadDocument[]> {
    let data = null
    try {
      data = await onfido.document.list(applicantId)
    } catch (error) {
      logger.error('Getting error while uploading file - OnfidoService', error)
      throw new OnfidoError(error)
    }
    return data
  }

  // Upload Documents
  async uploadLivePhoto(
    filePath: string,
    applicantId: string,
    advancedValidation?: boolean,
  ): Promise<LivePhotoRequest> {
    let data = null
    try {
      data = await onfido.livePhoto.upload({
        applicantId,
        file: fs.createReadStream(filePath),
        advancedValidation: String(advancedValidation),
      })
    } catch (error) {
      logger.error('Getting error while uploading file - OnfidoService', error)
      throw new OnfidoError(error)
    }
    return data
  }

  async retrieveLivePhoto(livePhotoId: string): Promise<LivePhoto> {
    let data = null
    try {
      data = await onfido.livePhoto.find(livePhotoId)
    } catch (error) {
      logger.error('Getting error while retrieveLivePhoto - OnfidoService', error)
      throw new OnfidoError(error)
    }
    return data
  }

  async listLivePhotoes(applicantId: string): Promise<LivePhoto[]> {
    let data = null
    try {
      data = await onfido.livePhoto.list(applicantId)
    } catch (error) {
      logger.error('Getting error while listLivePhotoes - OnfidoService', error)
      throw new OnfidoError(error)
    }
    return data
  }

  async createChecks(checkRequest: CheckRequest): Promise<Check> {
    let res = null
    try {
      res = await onfido.check.create({
        applicantId: checkRequest.applicantId,
        reportNames: checkRequest.reportNames,
        documentIds: checkRequest?.documentIds,
        applicantProvidesData: checkRequest?.applicantProvidesData,
        asynchronous: checkRequest?.asynchronous,
        tags: checkRequest?.tags,
        suppressFormEmails: checkRequest?.suppressFormEmails,
        redirectUri: checkRequest?.redirectUri,
        privacyNoticesReadConsentGiven: checkRequest?.privacyNoticesReadConsentGiven,
        webhookIds: checkRequest?.webhookIds,
        subResult: checkRequest?.subResult,
        consider: checkRequest?.consider,
      })
    } catch (err) {
      logger.error('Getting error while createChecks - OnfidoService', err)
      throw new OnfidoError(err)
    }
    return res
  }

  async retrieveChecks(checkId: string): Promise<Check> {
    let data = null
    try {
      data = await onfido.check.find(checkId)
    } catch (error) {
      logger.error('Getting error while retrieveChecks - OnfidoService', error)
      throw new OnfidoError(error)
    }
    return data
  }

  async listChecks(applicantId: string): Promise<Check[]> {
    let data = null
    try {
      data = await onfido.check.list(applicantId)
    } catch (error) {
      logger.error('Getting error while listChecks - OnfidoService', error)
      throw new OnfidoError(error)
    }
    return data
  }

  async retrieveReports(checkId: string): Promise<IReport> {
    let response = null
    try {
      response = await onfido.report.find(checkId)
      response[`breakdown`] = JSON.stringify(response?.breakdown)
      response[`properties`] = JSON.stringify(response?.properties)
      response[`documents`] = JSON.stringify(response?.documents)
    } catch (error) {
      logger.error('Getting error while listReports - OnfidoService', error)
      throw new OnfidoError(error)
    }
    return response
  }

  async listReports(checkId: string): Promise<[IReport]> {
    let response = null
    const result: any = []
    try {
      response = await onfido.report.list(checkId)
      for (const report of response) {
        report[`breakdown`] = JSON.stringify(report?.breakdown)
        report[`properties`] = JSON.stringify(report?.properties)
        report[`documents`] = JSON.stringify(report?.documents)
        result.push(report)
      }
    } catch (error) {
      logger.error('Getting error while listReports - OnfidoService', error)
      throw new OnfidoError(error)
    }
    return result
  }

  async generateSdkToken(input: IGenerateSdkToken): Promise<string> {
    let response = ''
    try {
      response = await onfido.sdkToken.generate(input)
    } catch (error) {
      logger.error('Getting error while generating Sdk token - OnfidoService', error)
      throw new OnfidoError(error)
    }
    return response
  }
  async submitWorkflowResponse(
    user_id: string,
    input: WorkFlowRunResponseInput,
  ): Promise<any> {
    const onfidoDB = new UserDB({
      user_id,
      applicantId: input.applicant_id,
      workflowRunId: input.id,
    })
    // storing data into db
    await updateWorkflowRunId(onfidoDB)
    return {
      user_id,
      applicant_id: input.applicant_id,
      workflow_run_id: input.id,
    }
  }

  async workflowRunId(
    applicant_id: string,
    workflow_id: string,
    user_id?: string,
  ): Promise<IWorkFlowRun> {
    const res = await axiosPost(
      ONFIDO_WORKFLOW_RUN,
      {
        applicant_id,
        workflow_id,
      },
      {
        headers: {
          Authorization: `Token token=${ONFIDO_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
      },
    ).catch(e => {
      logger.error(JSON.stringify(e))
      throw new BaseError(HttpStatus.INTERNAL_SERVER_ERROR, JSON.stringify(e))
    })
    await this.submitWorkflowResponse(user_id, { applicant_id, id: res?.id })
    logger.info(`[WorkFlowRun Response]: ${JSON.stringify(res)}`)
    return res
  }
}
