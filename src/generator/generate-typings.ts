import { GraphQLDefinitionsFactory } from '@nestjs/graphql'
import { join } from 'path'

const definitionsFactory = new GraphQLDefinitionsFactory()
definitionsFactory.generate({
  typePaths: ['./src/schema.gql'],
  federation: true,
  path: join(process.cwd(), 'src/generator/graphql.schema.ts'),
  outputAs: 'interface',
  debug: true,
})
