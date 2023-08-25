/*
Create Applicant
Update Applicant
Retrive Applicant
List Applicant

Upload Document
retrive Document
list document

Create Checks
List Checks
Retrive Checks

Generate Sdk token
Retrive reports
list Reports

*/
import { AppResolver } from '@app/app.resolver'
import { AWS_CREDENTIAL } from '@const/environments'
import { MUTATION_METHOD_DECORATOR } from '@core/decorators/mutation.decorator'
import { QUERY_METHOD_DECORATOR } from '@core/decorators/query.decorator'
import {
  CreateApplicantRequest,
  CreateChecksRequest,
  GenerateSdkTokenRequest,
  IOnfidoUploadDocument,
  UpdateApplicantRequest,
} from '@core/inputs'
import { IApplicant, IReport, IWorkFlowRun } from '@core/interfaces'
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { Check, LivePhoto, LivePhotoRequest } from '@onfido/api'
import { CurrentUser } from '@shared/decorators/current-user.decorator'
import { ArgsValidationPipe, UUIDValidationPipe } from '@shared/pipe'
import { convertObjectToSnakeCase } from '@utils/common.utils'
import * as AWS from 'aws-sdk'
import { logger } from '../../../shared/logger/logger'
import { OnfidoSevice } from './onfido.service'

@Resolver(() => String)
export class OnfidoResolver extends AppResolver {
  constructor(public readonly onfidoService: OnfidoSevice) {
    super()
  }

  @Query(
    QUERY_METHOD_DECORATOR.getApplicantById.return,
    QUERY_METHOD_DECORATOR.getApplicantById.options,
  )
  /* @Roles(Role.Admin)
  @UseInterceptors(ResponseHeaderInterceptor)
  @Roles(UserRole.Editor, UserRole.Admin, UserRole.SuperAdmin)
  @UseGuards(ActiveGuard, RolesGuard) */
  async getApplicantById(
    @Args('applicantId', { name: 'applicantId', description: 'applicant id onfido' })
    applicantId: string,
    @CurrentUser() _user: any,
  ): Promise<IApplicant> {
    logger.info('calling createapplicant service')
    return await this.onfidoService.getApplicantById(applicantId)
  }

  @Mutation(
    MUTATION_METHOD_DECORATOR.createApplicant.return,
    MUTATION_METHOD_DECORATOR.createApplicant.options,
  )
  async createApplicant(
    // @ExecuteForDevOnly() _any: any,
    @Args('inputs', { description: 'input for creating applicant' })
    input: CreateApplicantRequest,
    @CurrentUser() user: any,
  ): Promise<IApplicant> {
    input['user_id'] = input?.user_id || user?.['sub']
    logger.info('calling createapplicant service')
    return await this.onfidoService.createApplicant(input)
  }

  @Mutation(
    MUTATION_METHOD_DECORATOR.updateApplicant.return,
    MUTATION_METHOD_DECORATOR.updateApplicant.options,
  )
  async updateApplicant(
    @Args('inputs', { description: 'input for updating applicant' })
    input: UpdateApplicantRequest,
    @Args('applicantId', { name: 'applicantId', description: 'applicant id onfido' })
    applicantId: string,
  ): Promise<IApplicant> {
    logger.info('calling update applicant service')
    input = convertObjectToSnakeCase(input)
    return await this.onfidoService.updateApplicant(applicantId, input)
  }

  @Query(
    QUERY_METHOD_DECORATOR.listApplicants.return,
    QUERY_METHOD_DECORATOR.listApplicants.options,
  )
  async listApplicants(): Promise<IApplicant[]> {
    logger.info('calling list applicants service')
    return await this.onfidoService.listApplicants()
  }

  @Mutation(
    MUTATION_METHOD_DECORATOR.uploadDocuments.return,
    MUTATION_METHOD_DECORATOR.uploadDocuments.options,
  )
  async uploadDocuments(
    @CurrentUser() _user: any,
    @Args('filePath', { description: 'full path of file which you want to uplod.' })
    filePath: string,
    @Args('type', { description: 'type of applicant' }) type: string,
    @Args('side') side: string,
    @Args('applicantId') applicant_id: string,
  ): Promise<IOnfidoUploadDocument> {
    logger.info('calling list applicants service')
    const client = new AWS.IAM({ ...AWS_CREDENTIAL, region: 'us-east-1' })
    const data = client
      .listRoleTags({ RoleName: 'RBACDynamoDBReadOnlyAccess' })
      .promise()
    const reply = (await data).Tags
    logger.info('calling createapplicant service', reply)
    return await this.onfidoService.uploadDocuments(filePath, type, side, applicant_id)
  }

  @Query(
    QUERY_METHOD_DECORATOR.retrieveDocument.return,
    QUERY_METHOD_DECORATOR.retrieveDocument.options,
  )
  async retrieveDocument(
    @Args('documentId') documentId: string,
  ): Promise<IOnfidoUploadDocument> {
    logger.info('calling list applicants service')
    return await this.onfidoService.retrieveDocument(documentId)
  }

  @Query(
    QUERY_METHOD_DECORATOR.listDocuments.return,
    QUERY_METHOD_DECORATOR.listDocuments.options,
  )
  async listDocuments(
    @Args('applicantId') applicantId: string,
  ): Promise<IOnfidoUploadDocument[]> {
    logger.info('calling list applicants service')
    return await this.onfidoService.listDocuments(applicantId)
  }

  @Mutation(
    MUTATION_METHOD_DECORATOR.uploadLivePhoto.return,
    MUTATION_METHOD_DECORATOR.uploadLivePhoto.options,
  )
  async uploadLivePhto(
    @Args('filePath', { defaultValue: false }) filePath: string,
    @Args('applicantId', { defaultValue: false }) applicantId: string,
    @Args('advancedValidation', { defaultValue: false }) advanced_validation?: boolean,
  ): Promise<LivePhotoRequest> {
    logger.info('calling uploadLivePhto service')
    return await this.onfidoService.uploadLivePhoto(
      filePath,
      applicantId,
      advanced_validation,
    )
  }

  @Query(
    QUERY_METHOD_DECORATOR.retrieveLivePhoto.return,
    QUERY_METHOD_DECORATOR.retrieveLivePhoto.options,
  )
  async retrieveLivePhoto(
    @Args('livePhotoId') livePhotoId: string,
  ): Promise<LivePhoto> {
    logger.info('calling retrieveLivePhoto service')
    return await this.onfidoService.retrieveLivePhoto(livePhotoId)
  }

  @Query(
    QUERY_METHOD_DECORATOR.listLivePhotoes.return,
    QUERY_METHOD_DECORATOR.listLivePhotoes.options,
  )
  async listLivePhotoes(
    @Args('applicantId') applicantId: string,
  ): Promise<LivePhoto[]> {
    logger.info('calling listLivePhotoes service')
    return await this.onfidoService.listLivePhotoes(applicantId)
  }

  @Mutation(
    MUTATION_METHOD_DECORATOR.createChecks.return,
    MUTATION_METHOD_DECORATOR.createChecks.options,
  )
  async createChecks(
    @Args('inputs', { description: 'input for creating checks' })
    inputs: CreateChecksRequest,
  ): Promise<Check> {
    logger.info('calling uploadLivePhto service')
    return await this.onfidoService.createChecks(inputs)
  }

  @Query(
    QUERY_METHOD_DECORATOR.retrieveChecks.return,
    QUERY_METHOD_DECORATOR.retrieveChecks.options,
  )
  async retrieveChecks(@Args('checkId') checkId: string): Promise<Check> {
    logger.info('calling retrieveChecks service')
    return await this.onfidoService.retrieveChecks(checkId)
  }

  @Query(
    QUERY_METHOD_DECORATOR.listChecks.return,
    QUERY_METHOD_DECORATOR.listChecks.options,
  )
  async listChecks(@Args('applicantId') applicantId: string): Promise<Check[]> {
    logger.info('calling listChecks service')
    return await this.onfidoService.listChecks(applicantId)
  }

  @Query(
    QUERY_METHOD_DECORATOR.retrieveReports.return,
    QUERY_METHOD_DECORATOR.retrieveReports.options,
  )
  async retrieveReports(@Args('reportId') reportId: string): Promise<IReport> {
    logger.info('calling retrieveReports service')
    return await this.onfidoService.retrieveReports(reportId)
  }

  @Query(
    QUERY_METHOD_DECORATOR.listReports.return,
    QUERY_METHOD_DECORATOR.listReports.options,
  )
  async listReports(@Args('checkId') checkId: string): Promise<[IReport]> {
    logger.info('calling listReports service')
    return await this.onfidoService.listReports(checkId)
  }
  @Mutation(
    MUTATION_METHOD_DECORATOR.generateSdkToken.return,
    MUTATION_METHOD_DECORATOR.generateSdkToken.options,
  )
  async generateSdkToken(
    @Args('inputs', { description: 'input for generateSdkToken' })
    inputs: GenerateSdkTokenRequest,
  ): Promise<string> {
    logger.info('calling generateSdkToken service')
    return await this.onfidoService.generateSdkToken(inputs)
  }

  /* 
  // Not Using, We are calling service directly.
  @Mutation(
    MUTATION_METHOD_DECORATOR.submitWorkflowResponse.return,
    MUTATION_METHOD_DECORATOR.submitWorkflowResponse.options,
  )
  async submitWorkflowResponse(
    @Args('inputs', { description: 'input for generateSdkToken' })
    _inputs: WorkFlowRunResponseInput,
    @CurrentUser() user: any,
  ): Promise<any> {
    _inputs['user_id'] = _inputs?.user_id || user?.['sub']
    logger.info('calling generateSdkToken service')
    return this.onfidoService.submitWorkflowResponse(user.sub, _inputs)
  } */

  @Query(
    QUERY_METHOD_DECORATOR.getWorkFlowRunId.return,
    QUERY_METHOD_DECORATOR.getWorkFlowRunId.options,
  )
  async workFlowRun(
    @Args('applicant_id', ArgsValidationPipe, UUIDValidationPipe) applicant_id: string,
    @Args('workflow_id', ArgsValidationPipe, UUIDValidationPipe) workflow_id: string,
    @Args('user_id', ArgsValidationPipe, UUIDValidationPipe) userId: string,
  ): Promise<IWorkFlowRun> {
    return await this.onfidoService.workflowRunId(applicant_id, workflow_id, userId)
  }
}
