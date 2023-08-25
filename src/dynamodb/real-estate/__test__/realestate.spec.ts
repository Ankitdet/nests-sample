/* import { mapToObject } from '@utils/mapper/real-estate-data-mapper'
import AWS from 'aws-sdk'
import AWSMock from 'aws-sdk-mock'
import { PutItemInput } from 'aws-sdk/clients/dynamodb'
import { Boundary, Structure } from '../../../core/interfaces'
import {
  createRealEstateDataFromUI,
  fetchProperty,
  PropertyInfoDynamo,
} from '../real-estate.db'

describe('dynamodb -> realestate', () => {
  describe('method -> createRealEstateDataFromUI', () => {
    it('should return realestate datas', async () => {
      const address = {
        street_number:
          'Et eligendi ipsam et id. Ipsa quia consequatur quia dolorum. Provident fuga voluptas qui. Voluptas optio eveniet vitae ut fuga dolores voluptatem. Reprehenderit et maiores laborum quod.\n \rUt sapiente eum inventore alias aut aliquid harum adipisci. Quo reprehenderit dolorem nihil. Ullam ex consequatur incidunt ducimus qui adipisci. Fuga sed consequatur rem placeat id. Voluptatem architecto illum omnis vel totam aspernatur. Quibusdam fuga et voluptatem laudantium illum minima reiciendis.\n \rNulla et voluptatem in at quos omnis ratione. Sed sint esse aut qui qui corrupti ut et. Repellendus distinctio perferendis cum et nihil qui voluptatibus dolores. Fugit quo est eum aut.',
        street_name:
          'Earum nam excepturi eum quasi corporis qui. Molestiae quas impedit consequatur pariatur libero nihil amet labore adipisci. Temporibus est ut sint ducimus explicabo sunt quis quia est. Ut sit dolores velit voluptatem deserunt. Reiciendis velit harum incidunt voluptas sint quia amet deserunt optio.',
        street_post_direction: '',
        unit_number: '',
        formatted_street_address:
          'Tenetur ullam autem tempore repellat ipsam reiciendis qui sed expedita. Hic dolore qui voluptatem voluptatem eveniet hic quasi nemo quidem. Quibusdam in perferendis qui labore iure et. Ab corrupti dolores voluptatibus qui eveniet quis ipsum et. Similique laboriosam culpa dicta laudantium optio ut repellendus.',
        state: 'Officiis dolores ut dignissimos sequi inventore quidem voluptates aut.',
        zip_code:
          'Iste sit aut at voluptatem qui perspiciatis perspiciatis dolor corrupti.',
        zip_plus_four_code:
          'Dolores sequi ea voluptatem veniam id iste voluptatum placeat.',
        census_tract: 'magnam quo velit',
      }
      const parcel = {
        apn_original:
          'Quidem quibusdam a repellat ex.\nEa laboriosam sunt culpa est.\nMaxime et voluptates ut nostrum repellat aliquid quibusdam dolorem.\nFugiat dolor eum pariatur placeat et amet est.',
        apn_unformatted:
          'Qui magni recusandae odio minima.\nItaque nihil sequi nihil reiciendis placeat.\nIste dignissimos esse blanditiis aut et dolorum quis.\nMolestiae id dolor.\nCommodi perferendis eos et cumque voluptatem est.',
        apn_previous: '',
        depth_ft: 19371,
        area_sq_ft: 50601,
        county_name: 'Debitis error dolores.',
        zoning:
          'Blanditiis autem dignissimos in iste tempora ea non molestiae eum. Iure omnis nihil odio natus nesciunt dolor magnam dolor. Ipsum dolorum est rerum voluptate sapiente dolor eum. Aut et deserunt. Ut labore unde perferendis occaecati velit repudiandae velit. Doloremque aliquam accusamus perspiciatis.',
        tax_account_number:
          'Consectetur atque accusantium debitis vel minus aut molestiae asperiores expedita.',
        legal_description:
          'Aspernatur voluptatem dignissimos aut molestias voluptas neque veritatis. Error velit nostrum dolore quo. Et libero et. Enim doloremque voluptas cumque autem qui. Aut occaecati praesentium laudantium eos ad dicta maiores.',
        lot_code: '',
        subdivision: 'odit',
      }

      const boundry: Boundary = {
        wkt: 'Magni consectetur et porro non cupiditate. Ut autem repellendus voluptatem eius esse nihil aliquam cumque doloribus. Reprehenderit delectus aspernatur aut magnam id. Delectus consequuntur pariatur excepturi eligendi consectetur voluptatum.\n \rCumque facere aut beatae ut iure. Fugit dolor eaque est numquam sapiente reiciendis. Voluptas aliquam velit qui quidem fugit eum. Libero suscipit eos ab qui consequuntur pariatur qui perspiciatis et.\n \rConsequatur in dolorem veritatis et. Corporis facilis nulla. Aut alias temporibus. Deserunt fuga sed natus. Ullam dolorem dolorem eveniet quae magnam at. Accusantium enim inventore.',
        geojson: [
          {
            type: 'type',
            coordinates: [10][12][121][1231],
          },
        ],
      }
      const valuation = {
        value: 79348,
        high: 62702,
        low: 1401,
        date: 'Thu Jan 06 2022 14:19:37 GMT+0530 (India Standard Time)',
      }
      const structure: Structure = {
        year_built: 4347,
        effective_year_built: 40633,
        stories:
          'Nihil officiis dolor illo consequuntur dolores suscipit et voluptatum quisquam.',
        baths: 98810,
        partial_baths_count: 10,
        parking_spaces_count: 18009,
        pool_type: '',
        architecture_type:
          'Aut aperiam et non quis asperiores ex fugit vel. Dolor itaque excepturi explicabo fuga ea provident exercitationem eum. Accusamus repudiandae atque excepturi eius illum dignissimos minus vero.\n \rCommodi consequatur qui deleniti sequi non modi. Suscipit beatae occaecati porro dolore enim corporis. Quos et iusto non iste necessitatibus consequatur blanditiis. Ab quisquam atque praesentium et corrupti.\n \rLaboriosam recusandae quae maiores at ipsa repellat animi. Aspernatur impedit impedit quas. Facere sit et et voluptatem sed quos officia numquam dolore.',
        construction_type: 'labore',
        foundation_type: '',
        fireplaces: '',
        condition: 'assumenda',
        plumbing_fixtures_count: 10,
        interior_wall_type: 'accusamus optio veritatis',
        sewer_type: '',
        total_area_sq_ft: 88053,
        other_areas: [
          {
            type: 'Nostrum odit quis aut reiciendis et.',
            sq_ft: 'et',
          },
          {},
          {
            sq_ft:
              'Voluptatem qui nisi natus sed sapiente eum et non.\nEst ipsum aut culpa nulla.\nMolestiae est doloribus nihil molestias.\nQui provident natus.\nDoloribus tenetur dignissimos.',
          },
          {},
          {},
        ],
        other_improvements: [{}, {}, {}, {}, {}],
      }

      const taxes = {
        year: 4026,
        amount: 76606,
        exemptions: [
          'Aperiam omnis corrupti dolore. Non quia qui incidunt quia minus debitis quos est. Veniam voluptas facere enim sequi aut occaecati ab ut. Sint ad temporibus ex sunt aut.',
          'Impedit iste quia voluptatem.\nAperiam excepturi consequatur qui sequi molestiae dolorum laborum.\nBlanditiis ut magnam et.\nEum dolorem non ut culpa voluptatibus ut harum.',
          'fugit saepe reprehenderit',
          'Ea sit magni molestias voluptatum animi repudiandae eveniet cupiditate alias. Qui modi aut. Voluptas eum laborum sit. Corrupti debitis deleniti cupiditate.',
          'Facilis id sint quidem aspernatur omnis dolor voluptas. Quis exercitationem at voluptatibus omnis cupiditate aut ratione voluptatibus facere. Hic eos et asperiores. Rerum excepturi labore ipsam laborum adipisci tempora voluptas quam.',
        ],
        rate_code_area:
          'Voluptatibus eaque culpa est eum.\nFacere ab ea alias molestiae rerum.\nDoloribus eum saepe aut rerum maxime aut molestias.\nDolorem itaque placeat ut vel.\nDolore maiores dolores sequi enim nihil et eius.',
      }

      const assessmnet = {
        land_value: 83879,
        total_value: 85291,
      }

      const marketAssessment = {
        improvement_value:
          'Odit iure fugiat veritatis quia. Molestias voluptas commodi reiciendis est similique possimus rerum odio. Quisquam reprehenderit asperiores placeat quasi odio maiores rerum. Voluptatem ut nihil necessitatibus dignissimos sit sapiente. Et et et nihil dolores esse ut dolore enim voluptates.',
      }

      const owner = {
        second_name: '',
        unit_type: '',
        unit_number: '',
        formatted_street_address: '',
        city: '',
        zip_plus_four_code: '',
        owner_occupied: 'qui iste aut',
      }

      const deeds = {
        document_type:
          'Est dolor veritatis impedit aliquid molestiae accusantium nostrum.',
        deed_page:
          'Magnam ipsam aut dolorem possimus voluptate. Nobis enim non. Voluptate veritatis vel accusamus. Sapiente laborum qui reiciendis voluptatum qui vel. Qui sequi harum vel hic pariatur deleniti ducimus deserunt quos. Ratione ea qui quia recusandae sed et et quisquam dolorem.',
        sale_price: 70804,
        sale_price_description: 'ea fugiat ullam',
        distressed_sale: 'est veritatis nam',
        seller_unit_number: 'ut vitae blanditiis',
        seller_zip_code: 'autem',
        seller_zip_plus_four_code: 'Provident quos aliquam.',
        buyer2_last_name:
          'Consequatur eaque rerum eum. Enim qui eius quas omnis dicta dolorem molestias eum alias. Neque iure voluptas.',
        buyer_address: 'asperiores sit porro',
        buyer_unit_type:
          'Quos rem praesentium odit quae vero qui laborum. Corporis et fugit consequatur totam eos possimus. Dolorem ea reiciendis neque. Labore iste similique aut quae exercitationem ea. Sunt vel sequi cupiditate autem corporis esse nemo harum.\n \rQui deleniti maxime aut harum dolor qui laborum sed autem. Dolores minus sapiente veniam maiores. Autem voluptate ad sit reiciendis mollitia aut nesciunt sequi. Cupiditate voluptatem voluptas quos doloremque pariatur error maxime perferendis sapiente. Enim aspernatur veniam vel consequatur et illum ipsam delectus vel. Quis blanditiis autem dolore accusantium rerum.\n \rNihil architecto facilis est. Cupiditate dignissimos consequatur asperiores quia iure et reiciendis natus enim. Aspernatur asperiores dolorem repellat unde. Error amet amet est sunt similique.',
        buyer_unit_number: 'ab rerum ut',
        buyer_city: 'vero impedit debitis',
        lender_name: 'perferendis',
        lender_type: 'qui',
        loan_amount: 'neque',
        loan_finance_type:
          'Vel recusandae et. Qui nam vel delectus odio. Temporibus quidem delectus qui quibusdam molestias qui in natus. Doloremque quia in id ut minima. Maxime eveniet eos ipsa dicta numquam eveniet. Et molestias sed illo in.',
        loan_interest_rate: 'dolores',
      }
      const object = new PropertyInfoDynamo(
        { userId: 100 },
        { publishing_date: 'non et vitae' },
        address,
        parcel,
        boundry,
        structure,
        valuation,
        taxes,
        assessmnet,
        marketAssessment,
        owner,
        deeds,
      )

      AWSMock.setSDKInstance(AWS)
      AWSMock.mock(
        'DynamoDB.DocumentClient',
        'put',
        (_params: PutItemInput, callback: Function) => {
          console.log('DynamoDB.DocumentClient', 'put', 'mock called')
          callback(null, { pk: 'foo', sk: 'bar' })
        },
      )
      const str = await createRealEstateDataFromUI(object)
      const data = mapToObject(object)
      expect(str).toStrictEqual(data)
      AWSMock.restore('DynamoDB')
    })

    it('should throw error when region not set', async () => {})
  })

  describe('method -> createRealEstateData', () => {
    it('should return realestate datas', async () => {
      const address = {
        street_number:
          'Et eligendi ipsam et id. Ipsa quia consequatur quia dolorum. Provident fuga voluptas qui. Voluptas optio eveniet vitae ut fuga dolores voluptatem. Reprehenderit et maiores laborum quod.\n \rUt sapiente eum inventore alias aut aliquid harum adipisci. Quo reprehenderit dolorem nihil. Ullam ex consequatur incidunt ducimus qui adipisci. Fuga sed consequatur rem placeat id. Voluptatem architecto illum omnis vel totam aspernatur. Quibusdam fuga et voluptatem laudantium illum minima reiciendis.\n \rNulla et voluptatem in at quos omnis ratione. Sed sint esse aut qui qui corrupti ut et. Repellendus distinctio perferendis cum et nihil qui voluptatibus dolores. Fugit quo est eum aut.',
        street_name:
          'Earum nam excepturi eum quasi corporis qui. Molestiae quas impedit consequatur pariatur libero nihil amet labore adipisci. Temporibus est ut sint ducimus explicabo sunt quis quia est. Ut sit dolores velit voluptatem deserunt. Reiciendis velit harum incidunt voluptas sint quia amet deserunt optio.',
        street_post_direction: '',
        unit_number: '',
        formatted_street_address:
          'Tenetur ullam autem tempore repellat ipsam reiciendis qui sed expedita. Hic dolore qui voluptatem voluptatem eveniet hic quasi nemo quidem. Quibusdam in perferendis qui labore iure et. Ab corrupti dolores voluptatibus qui eveniet quis ipsum et. Similique laboriosam culpa dicta laudantium optio ut repellendus.',
        state: 'Officiis dolores ut dignissimos sequi inventore quidem voluptates aut.',
        zip_code:
          'Iste sit aut at voluptatem qui perspiciatis perspiciatis dolor corrupti.',
        zip_plus_four_code:
          'Dolores sequi ea voluptatem veniam id iste voluptatum placeat.',
        census_tract: 'magnam quo velit',
      }
      const parcel = {
        apn_original:
          'Quidem quibusdam a repellat ex.\nEa laboriosam sunt culpa est.\nMaxime et voluptates ut nostrum repellat aliquid quibusdam dolorem.\nFugiat dolor eum pariatur placeat et amet est.',
        apn_unformatted:
          'Qui magni recusandae odio minima.\nItaque nihil sequi nihil reiciendis placeat.\nIste dignissimos esse blanditiis aut et dolorum quis.\nMolestiae id dolor.\nCommodi perferendis eos et cumque voluptatem est.',
        apn_previous: '',
        depth_ft: 19371,
        area_sq_ft: 50601,
        county_name: 'Debitis error dolores.',
        zoning:
          'Blanditiis autem dignissimos in iste tempora ea non molestiae eum. Iure omnis nihil odio natus nesciunt dolor magnam dolor. Ipsum dolorum est rerum voluptate sapiente dolor eum. Aut et deserunt. Ut labore unde perferendis occaecati velit repudiandae velit. Doloremque aliquam accusamus perspiciatis.',
        tax_account_number:
          'Consectetur atque accusantium debitis vel minus aut molestiae asperiores expedita.',
        legal_description:
          'Aspernatur voluptatem dignissimos aut molestias voluptas neque veritatis. Error velit nostrum dolore quo. Et libero et. Enim doloremque voluptas cumque autem qui. Aut occaecati praesentium laudantium eos ad dicta maiores.',
        lot_code: '',
        subdivision: 'odit',
      }

      const boundry: Boundary = {
        wkt: 'Magni consectetur et porro non cupiditate. Ut autem repellendus voluptatem eius esse nihil aliquam cumque doloribus. Reprehenderit delectus aspernatur aut magnam id. Delectus consequuntur pariatur excepturi eligendi consectetur voluptatum.\n \rCumque facere aut beatae ut iure. Fugit dolor eaque est numquam sapiente reiciendis. Voluptas aliquam velit qui quidem fugit eum. Libero suscipit eos ab qui consequuntur pariatur qui perspiciatis et.\n \rConsequatur in dolorem veritatis et. Corporis facilis nulla. Aut alias temporibus. Deserunt fuga sed natus. Ullam dolorem dolorem eveniet quae magnam at. Accusantium enim inventore.',
        geojson: [
          {
            type: 'type',
            coordinates: [1][2][3][4],
          },
        ],
      }

      const valuation = {
        value: 79348,
        high: 62702,
        low: 1401,
        date: 'Thu Jan 06 2022 14:19:37 GMT+0530 (India Standard Time)',
      }
      const structure: Structure = {
        year_built: 4347,
        effective_year_built: 40633,
        stories:
          'Nihil officiis dolor illo consequuntur dolores suscipit et voluptatum quisquam.',
        baths: 98810,
        partial_baths_count: 10,
        parking_spaces_count: 18009,
        pool_type: '',
        architecture_type:
          'Aut aperiam et non quis asperiores ex fugit vel. Dolor itaque excepturi explicabo fuga ea provident exercitationem eum. Accusamus repudiandae atque excepturi eius illum dignissimos minus vero.\n \rCommodi consequatur qui deleniti sequi non modi. Suscipit beatae occaecati porro dolore enim corporis. Quos et iusto non iste necessitatibus consequatur blanditiis. Ab quisquam atque praesentium et corrupti.\n \rLaboriosam recusandae quae maiores at ipsa repellat animi. Aspernatur impedit impedit quas. Facere sit et et voluptatem sed quos officia numquam dolore.',
        construction_type: 'labore',
        foundation_type: '',
        fireplaces: '',
        condition: 'assumenda',
        plumbing_fixtures_count: 10,
        interior_wall_type: 'accusamus optio veritatis',
        sewer_type: '',
        total_area_sq_ft: 88053,
        other_areas: [
          {
            type: 'Nostrum odit quis aut reiciendis et.',
            sq_ft: 'et',
          },
          {},
          {
            sq_ft:
              'Voluptatem qui nisi natus sed sapiente eum et non.\nEst ipsum aut culpa nulla.\nMolestiae est doloribus nihil molestias.\nQui provident natus.\nDoloribus tenetur dignissimos.',
          },
          {},
          {},
        ],
        other_improvements: [{}, {}, {}, {}, {}],
      }

      const taxes = {
        year: 4026,
        amount: 76606,
        exemptions: [
          'Aperiam omnis corrupti dolore. Non quia qui incidunt quia minus debitis quos est. Veniam voluptas facere enim sequi aut occaecati ab ut. Sint ad temporibus ex sunt aut.',
          'Impedit iste quia voluptatem.\nAperiam excepturi consequatur qui sequi molestiae dolorum laborum.\nBlanditiis ut magnam et.\nEum dolorem non ut culpa voluptatibus ut harum.',
          'fugit saepe reprehenderit',
          'Ea sit magni molestias voluptatum animi repudiandae eveniet cupiditate alias. Qui modi aut. Voluptas eum laborum sit. Corrupti debitis deleniti cupiditate.',
          'Facilis id sint quidem aspernatur omnis dolor voluptas. Quis exercitationem at voluptatibus omnis cupiditate aut ratione voluptatibus facere. Hic eos et asperiores. Rerum excepturi labore ipsam laborum adipisci tempora voluptas quam.',
        ],
        rate_code_area:
          'Voluptatibus eaque culpa est eum.\nFacere ab ea alias molestiae rerum.\nDoloribus eum saepe aut rerum maxime aut molestias.\nDolorem itaque placeat ut vel.\nDolore maiores dolores sequi enim nihil et eius.',
      }

      const assessmnet = {
        land_value: 83879,
        total_value: 85291,
      }

      const marketAssessment = {
        improvement_value:
          'Odit iure fugiat veritatis quia. Molestias voluptas commodi reiciendis est similique possimus rerum odio. Quisquam reprehenderit asperiores placeat quasi odio maiores rerum. Voluptatem ut nihil necessitatibus dignissimos sit sapiente. Et et et nihil dolores esse ut dolore enim voluptates.',
      }

      const owner = {
        second_name: '',
        unit_type: '',
        unit_number: '',
        formatted_street_address: '',
        city: '',
        zip_plus_four_code: '',
        owner_occupied: 'qui iste aut',
      }

      const deeds = {
        document_type:
          'Est dolor veritatis impedit aliquid molestiae accusantium nostrum.',
        deed_page:
          'Magnam ipsam aut dolorem possimus voluptate. Nobis enim non. Voluptate veritatis vel accusamus. Sapiente laborum qui reiciendis voluptatum qui vel. Qui sequi harum vel hic pariatur deleniti ducimus deserunt quos. Ratione ea qui quia recusandae sed et et quisquam dolorem.',
        sale_price: 70804,
        sale_price_description: 'ea fugiat ullam',
        distressed_sale: 'est veritatis nam',
        seller_unit_number: 'ut vitae blanditiis',
        seller_zip_code: 'autem',
        seller_zip_plus_four_code: 'Provident quos aliquam.',
        buyer2_last_name:
          'Consequatur eaque rerum eum. Enim qui eius quas omnis dicta dolorem molestias eum alias. Neque iure voluptas.',
        buyer_address: 'asperiores sit porro',
        buyer_unit_type:
          'Quos rem praesentium odit quae vero qui laborum. Corporis et fugit consequatur totam eos possimus. Dolorem ea reiciendis neque. Labore iste similique aut quae exercitationem ea. Sunt vel sequi cupiditate autem corporis esse nemo harum.\n \rQui deleniti maxime aut harum dolor qui laborum sed autem. Dolores minus sapiente veniam maiores. Autem voluptate ad sit reiciendis mollitia aut nesciunt sequi. Cupiditate voluptatem voluptas quos doloremque pariatur error maxime perferendis sapiente. Enim aspernatur veniam vel consequatur et illum ipsam delectus vel. Quis blanditiis autem dolore accusantium rerum.\n \rNihil architecto facilis est. Cupiditate dignissimos consequatur asperiores quia iure et reiciendis natus enim. Aspernatur asperiores dolorem repellat unde. Error amet amet est sunt similique.',
        buyer_unit_number: 'ab rerum ut',
        buyer_city: 'vero impedit debitis',
        lender_name: 'perferendis',
        lender_type: 'qui',
        loan_amount: 'neque',
        loan_finance_type:
          'Vel recusandae et. Qui nam vel delectus odio. Temporibus quidem delectus qui quibusdam molestias qui in natus. Doloremque quia in id ut minima. Maxime eveniet eos ipsa dicta numquam eveniet. Et molestias sed illo in.',
        loan_interest_rate: 'dolores',
      }
      const object = new PropertyInfoDynamo(
        { userId: 100 },
        { publishing_date: 'non et vitae' },
        address,
        parcel,
        boundry,
        structure,
        valuation,
        taxes,
        assessmnet,
        marketAssessment,
        owner,
        deeds,
      )

      AWSMock.setSDKInstance(AWS)
      AWSMock.mock(
        'DynamoDB.DocumentClient',
        'put',
        (_params: PutItemInput, callback: Function) => {
          console.log('DynamoDB.DocumentClient', 'put', 'mock called')
          callback(null, { pk: 'foo', sk: 'bar' })
        },
      )

      const str = await createRealEstateDataFromUI(object)
      const data = mapToObject(object)
      expect(str).toStrictEqual(data)

      AWSMock.restore('DynamoDB')
    })

    it('should throw error when region not set', async () => {})
  })

  describe('method -> fetchProperty', () => {
    it('should throw error when region not set', async () => {
      const address = {
        street_number:
          'Et eligendi ipsam et id. Ipsa quia consequatur quia dolorum. Provident fuga voluptas qui. Voluptas optio eveniet vitae ut fuga dolores voluptatem. Reprehenderit et maiores laborum quod.\n \rUt sapiente eum inventore alias aut aliquid harum adipisci. Quo reprehenderit dolorem nihil. Ullam ex consequatur incidunt ducimus qui adipisci. Fuga sed consequatur rem placeat id. Voluptatem architecto illum omnis vel totam aspernatur. Quibusdam fuga et voluptatem laudantium illum minima reiciendis.\n \rNulla et voluptatem in at quos omnis ratione. Sed sint esse aut qui qui corrupti ut et. Repellendus distinctio perferendis cum et nihil qui voluptatibus dolores. Fugit quo est eum aut.',
        street_name:
          'Earum nam excepturi eum quasi corporis qui. Molestiae quas impedit consequatur pariatur libero nihil amet labore adipisci. Temporibus est ut sint ducimus explicabo sunt quis quia est. Ut sit dolores velit voluptatem deserunt. Reiciendis velit harum incidunt voluptas sint quia amet deserunt optio.',
        street_post_direction: '',
        unit_number: '',
        formatted_street_address:
          'Tenetur ullam autem tempore repellat ipsam reiciendis qui sed expedita. Hic dolore qui voluptatem voluptatem eveniet hic quasi nemo quidem. Quibusdam in perferendis qui labore iure et. Ab corrupti dolores voluptatibus qui eveniet quis ipsum et. Similique laboriosam culpa dicta laudantium optio ut repellendus.',
        state: 'Officiis dolores ut dignissimos sequi inventore quidem voluptates aut.',
        zip_code:
          'Iste sit aut at voluptatem qui perspiciatis perspiciatis dolor corrupti.',
        zip_plus_four_code:
          'Dolores sequi ea voluptatem veniam id iste voluptatum placeat.',
        census_tract: 'magnam quo velit',
      }
      const parcel = {
        apn_original:
          'Quidem quibusdam a repellat ex.\nEa laboriosam sunt culpa est.\nMaxime et voluptates ut nostrum repellat aliquid quibusdam dolorem.\nFugiat dolor eum pariatur placeat et amet est.',
        apn_unformatted:
          'Qui magni recusandae odio minima.\nItaque nihil sequi nihil reiciendis placeat.\nIste dignissimos esse blanditiis aut et dolorum quis.\nMolestiae id dolor.\nCommodi perferendis eos et cumque voluptatem est.',
        apn_previous: '',
        depth_ft: 19371,
        area_sq_ft: 50601,
        county_name: 'Debitis error dolores.',
        zoning:
          'Blanditiis autem dignissimos in iste tempora ea non molestiae eum. Iure omnis nihil odio natus nesciunt dolor magnam dolor. Ipsum dolorum est rerum voluptate sapiente dolor eum. Aut et deserunt. Ut labore unde perferendis occaecati velit repudiandae velit. Doloremque aliquam accusamus perspiciatis.',
        tax_account_number:
          'Consectetur atque accusantium debitis vel minus aut molestiae asperiores expedita.',
        legal_description:
          'Aspernatur voluptatem dignissimos aut molestias voluptas neque veritatis. Error velit nostrum dolore quo. Et libero et. Enim doloremque voluptas cumque autem qui. Aut occaecati praesentium laudantium eos ad dicta maiores.',
        lot_code: '',
        subdivision: 'odit',
      }

      const boundry: Boundary = {
        wkt: 'Magni consectetur et porro non cupiditate. Ut autem repellendus voluptatem eius esse nihil aliquam cumque doloribus. Reprehenderit delectus aspernatur aut magnam id. Delectus consequuntur pariatur excepturi eligendi consectetur voluptatum.\n \rCumque facere aut beatae ut iure. Fugit dolor eaque est numquam sapiente reiciendis. Voluptas aliquam velit qui quidem fugit eum. Libero suscipit eos ab qui consequuntur pariatur qui perspiciatis et.\n \rConsequatur in dolorem veritatis et. Corporis facilis nulla. Aut alias temporibus. Deserunt fuga sed natus. Ullam dolorem dolorem eveniet quae magnam at. Accusantium enim inventore.',
        geojson: [
          {
            type: 'type',
            coordinates: [2][3][2][1],
          },
        ],
      }

      const valuation = {
        value: 79348,
        high: 62702,
        low: 1401,
        date: 'Thu Jan 06 2022 14:19:37 GMT+0530 (India Standard Time)',
      }
      const structure: Structure = {
        year_built: 4347,
        effective_year_built: 40633,
        stories:
          'Nihil officiis dolor illo consequuntur dolores suscipit et voluptatum quisquam.',
        baths: 98810,
        partial_baths_count: 100,
        parking_spaces_count: 18009,
        pool_type: '',
        architecture_type:
          'Aut aperiam et non quis asperiores ex fugit vel. Dolor itaque excepturi explicabo fuga ea provident exercitationem eum. Accusamus repudiandae atque excepturi eius illum dignissimos minus vero.\n \rCommodi consequatur qui deleniti sequi non modi. Suscipit beatae occaecati porro dolore enim corporis. Quos et iusto non iste necessitatibus consequatur blanditiis. Ab quisquam atque praesentium et corrupti.\n \rLaboriosam recusandae quae maiores at ipsa repellat animi. Aspernatur impedit impedit quas. Facere sit et et voluptatem sed quos officia numquam dolore.',
        construction_type: 'labore',
        foundation_type: '',
        fireplaces: '',
        condition: 'assumenda',
        plumbing_fixtures_count: 100,
        interior_wall_type: 'accusamus optio veritatis',
        sewer_type: '',
        total_area_sq_ft: 88053,
        other_areas: [
          {
            type: 'Nostrum odit quis aut reiciendis et.',
            sq_ft: 'et',
          },
          {},
          {
            sq_ft:
              'Voluptatem qui nisi natus sed sapiente eum et non.\nEst ipsum aut culpa nulla.\nMolestiae est doloribus nihil molestias.\nQui provident natus.\nDoloribus tenetur dignissimos.',
          },
          {},
          {},
        ],
        other_improvements: [{}, {}, {}, {}, {}],
      }

      const taxes = {
        year: 4026,
        amount: 76606,
        exemptions: [
          'Aperiam omnis corrupti dolore. Non quia qui incidunt quia minus debitis quos est. Veniam voluptas facere enim sequi aut occaecati ab ut. Sint ad temporibus ex sunt aut.',
          'Impedit iste quia voluptatem.\nAperiam excepturi consequatur qui sequi molestiae dolorum laborum.\nBlanditiis ut magnam et.\nEum dolorem non ut culpa voluptatibus ut harum.',
          'fugit saepe reprehenderit',
          'Ea sit magni molestias voluptatum animi repudiandae eveniet cupiditate alias. Qui modi aut. Voluptas eum laborum sit. Corrupti debitis deleniti cupiditate.',
          'Facilis id sint quidem aspernatur omnis dolor voluptas. Quis exercitationem at voluptatibus omnis cupiditate aut ratione voluptatibus facere. Hic eos et asperiores. Rerum excepturi labore ipsam laborum adipisci tempora voluptas quam.',
        ],
        rate_code_area:
          'Voluptatibus eaque culpa est eum.\nFacere ab ea alias molestiae rerum.\nDoloribus eum saepe aut rerum maxime aut molestias.\nDolorem itaque placeat ut vel.\nDolore maiores dolores sequi enim nihil et eius.',
      }

      const assessmnet = {
        land_value: 83879,
        total_value: 85291,
      }

      const marketAssessment = {
        improvement_value:
          'Odit iure fugiat veritatis quia. Molestias voluptas commodi reiciendis est similique possimus rerum odio. Quisquam reprehenderit asperiores placeat quasi odio maiores rerum. Voluptatem ut nihil necessitatibus dignissimos sit sapiente. Et et et nihil dolores esse ut dolore enim voluptates.',
      }

      const owner = {
        second_name: '',
        unit_type: '',
        unit_number: '',
        formatted_street_address: '',
        city: '',
        zip_plus_four_code: '',
        owner_occupied: 'qui iste aut',
      }

      const deeds = {
        document_type:
          'Est dolor veritatis impedit aliquid molestiae accusantium nostrum.',
        deed_page:
          'Magnam ipsam aut dolorem possimus voluptate. Nobis enim non. Voluptate veritatis vel accusamus. Sapiente laborum qui reiciendis voluptatum qui vel. Qui sequi harum vel hic pariatur deleniti ducimus deserunt quos. Ratione ea qui quia recusandae sed et et quisquam dolorem.',
        sale_price: 70804,
        sale_price_description: 'ea fugiat ullam',
        distressed_sale: 'est veritatis nam',
        seller_unit_number: 'ut vitae blanditiis',
        seller_zip_code: 'autem',
        seller_zip_plus_four_code: 'Provident quos aliquam.',
        buyer2_last_name:
          'Consequatur eaque rerum eum. Enim qui eius quas omnis dicta dolorem molestias eum alias. Neque iure voluptas.',
        buyer_address: 'asperiores sit porro',
        buyer_unit_type:
          'Quos rem praesentium odit quae vero qui laborum. Corporis et fugit consequatur totam eos possimus. Dolorem ea reiciendis neque. Labore iste similique aut quae exercitationem ea. Sunt vel sequi cupiditate autem corporis esse nemo harum.\n \rQui deleniti maxime aut harum dolor qui laborum sed autem. Dolores minus sapiente veniam maiores. Autem voluptate ad sit reiciendis mollitia aut nesciunt sequi. Cupiditate voluptatem voluptas quos doloremque pariatur error maxime perferendis sapiente. Enim aspernatur veniam vel consequatur et illum ipsam delectus vel. Quis blanditiis autem dolore accusantium rerum.\n \rNihil architecto facilis est. Cupiditate dignissimos consequatur asperiores quia iure et reiciendis natus enim. Aspernatur asperiores dolorem repellat unde. Error amet amet est sunt similique.',
        buyer_unit_number: 'ab rerum ut',
        buyer_city: 'vero impedit debitis',
        lender_name: 'perferendis',
        lender_type: 'qui',
        loan_amount: 'neque',
        loan_finance_type:
          'Vel recusandae et. Qui nam vel delectus odio. Temporibus quidem delectus qui quibusdam molestias qui in natus. Doloremque quia in id ut minima. Maxime eveniet eos ipsa dicta numquam eveniet. Et molestias sed illo in.',
        loan_interest_rate: 'dolores',
      }
      const object = new PropertyInfoDynamo(
        { userId: 100 },
        { publishing_date: 'non et vitae' },
        address,
        parcel,
        boundry,
        structure,
        valuation,
        taxes,
        assessmnet,
        marketAssessment,
        owner,
        deeds,
      )

      AWSMock.setSDKInstance(AWS)
      AWSMock.mock(
        'DynamoDB.DocumentClient',
        'query',
        (_params: PutItemInput, callback: Function) => {
          console.log('DynamoDB.DocumentClient', 'query', 'mock called')
          callback(null, {
            Items: [object],
          })
        },
      )

      const str = await fetchProperty('add', 'city', 'state', 382021)

      const data = mapToObject(object)
      expect(str).toStrictEqual(data)

      AWSMock.restore('DynamoDB')
      // ! This is very critical comments
      // * This is a highlighted comments
      // TODO: This is todo comments
      // ? This is a questions comments
      // This is a normal comments
    })
  })
})
 */
