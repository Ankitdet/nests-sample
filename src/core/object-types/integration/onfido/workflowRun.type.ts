import { TypeName } from '@core/enums'
import { Field, Int, ObjectType } from '@nestjs/graphql'
import { NullableTrue } from '@utils/index'

@ObjectType(TypeName.WorkFlowRunType)
export class WorkFlowRunType {
  @Field({
    description: 'applicant_id',
  })
  applicant_id: string
  @Field({
    ...NullableTrue,
    description: 'created_at',
  })
  created_at: string
  @Field({
    ...NullableTrue,
    description: 'finished',
  })
  finished: boolean
  @Field({
    description: 'id',
  })
  id: string
  @Field({
    ...NullableTrue,
    description: 'state',
  })
  state: string
  @Field({
    ...NullableTrue,
    description: 'status',
  })
  status: string
  @Field({
    ...NullableTrue,
    description: 'task_def_id',
  })
  task_def_id: string
  @Field({
    ...NullableTrue,
    description: 'task_id',
  })
  task_id: string
  @Field({
    ...NullableTrue,
    description: 'task_type',
  })
  task_type: string
  @Field({
    ...NullableTrue,
    description: 'updated_at',
  })
  updated_at: string
  @Field(() => Int, {
    ...NullableTrue,
    description: 'version_id',
  })
  version_id: number
  @Field({
    ...NullableTrue,
    description: 'workflow_id',
  })
  workflow_id: string
}
