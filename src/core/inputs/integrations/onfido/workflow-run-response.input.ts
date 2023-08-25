import { getInputName, InputName } from '@core/enums'
import { ArgsType, Field, InputType } from '@nestjs/graphql'
import { UUID_VERSION } from '@utils/common.utils'
import { IsUUID } from 'class-validator'

@InputType(getInputName(InputName.OnfidoWorkflowRunResponseInput))
@ArgsType()
export class WorkFlowRunResponseInput {
  @Field({ description: 'Type of the Id number', nullable: false })
  id: string
  @Field({ description: 'Value of the Id number', nullable: false })
  applicant_id: string

  @Field({ description: 'user id', nullable: false })
  @IsUUID(UUID_VERSION)
  user_id?: string | null
}
