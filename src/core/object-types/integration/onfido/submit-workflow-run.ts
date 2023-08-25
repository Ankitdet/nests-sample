import { TypeName } from '@core/enums'
import { Field, ObjectType } from '@nestjs/graphql'
import { UUID_VERSION } from '@utils/index'
import { IsUUID } from 'class-validator'
@ObjectType(TypeName.SubmitWorkflowResponseType)
export class SubmitWorkflowResponseType {
  @IsUUID(UUID_VERSION)
  @Field({ description: 'Value of the Id number', nullable: true })
  user_id: string
  @Field({ description: 'Value of the Id number', nullable: true })
  workflow_run_id: string
  @Field({ description: 'Value of the Id number', nullable: true })
  applicant_id: string
}
