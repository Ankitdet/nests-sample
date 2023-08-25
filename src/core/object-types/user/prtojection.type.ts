import { ArgsType, Field, InputType, ObjectType } from '@nestjs/graphql'
import { AbstractTrue } from '@utils/common.utils'

@ObjectType('Topper', { ...AbstractTrue })
@InputType('TopperInput')
@ArgsType()
class Topper {
  @Field({
    description: 'name of country which user belong to',
    nullable: true,
  })
  tooper?: string

  @Field({
    description: 'name of country which user belong to',
    nullable: true,
  })
  tooper1?: string
}

@ObjectType('TopType1212', { ...AbstractTrue })
@InputType('TopType1212Input')
@ArgsType()
class Top {
  @Field(() => Topper, {
    description: 'name of country which user belong to',
    nullable: true,
  })
  tooper?: Topper

  @Field({
    description: 'name of country which user belong to',
    nullable: true,
  })
  topData?: string
}

@ObjectType('AddressTest', { ...AbstractTrue })
@InputType('AddressTestInput')
@ArgsType()
export class Address {
  @Field({
    description: 'name of country which user belong to',
    nullable: true,
  })
  country?: string
  @Field({
    description: 'name of state which user belong to',
    nullable: true,
  })
  state?: string

  @Field(() => Top, {
    description: 'name of zip which user belong to',
    nullable: true,
  })
  top?: Top
}

/** user Type */
@ObjectType('UserTypeProjectTest')
@InputType('UserTypeProjectTestInput')
@ArgsType()
export class UserTypeProjectTest {
  @Field({ description: 'The unique identifier of the new user', nullable: false })
  _id: string

  /*     @Field(() => Address, { description: 'The address of the user', nullable: true })
        address?: Address
    
        @Field(() => Address, { description: 'The address of the user', nullable: true })
        address1?: Address
        @Field(() => Address, { description: 'The address of the user', nullable: true })
        address2?: Address
        @Field(() => Address, { description: 'The address of the user', nullable: true })
        addressAnkit?: Address
        @Field(() => Address, { description: 'The address of the user', nullable: true })
        addressForam?: Address
        @Field(() => Address, { description: 'The address of the user', nullable: true })
        addressTest?: Address */
  @Field({ description: 'The unique identifier of the new user', nullable: false })
  _id11: string

  @Field({ description: 'The unique identifier of the new user', nullable: false })
  _id1: string
  @Field({ description: 'The unique identifier of the new user', nullable: false })
  _id2: string
  @Field({ description: 'The unique identifier of the new user', nullable: false })
  _id3: string
  @Field({ description: 'The unique identifier of the new user', nullable: false })
  _id4: string
  @Field({ description: 'The unique identifier of the new user', nullable: false })
  _id5: string
  @Field({ description: 'The unique identifier of the new user', nullable: false })
  _id6: string
  @Field({ description: 'The unique identifier of the new user', nullable: false })
  _id8: string
  @Field({ description: 'The unique identifier of the new user', nullable: false })
  _id7: string
  @Field({ description: 'The unique identifier of the new user', nullable: false })
  _id9: string
}
