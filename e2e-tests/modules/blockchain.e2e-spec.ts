import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../../src/app/app.module';
import { queries } from '../gql-gen';

const gql = '/graphql';
jest.setTimeout(90000)

describe('RealEstate Resolver (e2e)', () => {
    let app: INestApplication;
    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    afterAll(async () => {
        await app.close();
    });

    describe('realestate-query', () => {
        it('passing the properId', async () => {
            // will generate random 127.0.0.1:49580
            await request(app.getHttpServer())
                .post(gql)
                .send({
                    operationName: null,
                    variables: {
                        "input": {
                            "re_id": "8c294a15-1bcd-4794-8e50-37b301a798b9"
                        }
                    },
                    query: queries.getRealEstateFinanceByReId,
                })
                .expect((res) => {
                    const resp = JSON.parse(res?.text)
                    expect(resp.data.getRealEstateFinanceByReId).toBeDefined()
                    // expect(res['body'].errors[0]).toStrictEqual(dataNotFoundRealEstate().dataNotFound)
                });
        });
    })

})