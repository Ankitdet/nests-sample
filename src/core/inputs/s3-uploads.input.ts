import { Field, InputType } from '@nestjs/graphql'

@InputType('DeleteKeysInput')
export class DeleteKeysInput {
  @Field(() => [String], {
    nullable: true,
    description:
      'Deletes a single applicant. If successful, returns a 204 No Content response. Once deleted, Onfido will not be able to carry out any troubleshooting or investigate any queries raised by the client. ',
  })
  keys?: string[]
}
