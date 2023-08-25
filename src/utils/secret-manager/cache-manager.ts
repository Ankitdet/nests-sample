// import { Logger } from '@nestjs/common'
import { Logger } from '@nestjs/common'
import { cache } from '../../global-vars'
import { decrptFromSecret } from './crypto-js'
import { secretsValue } from './secret-manager'

export class SecretManagerCache {
  constructor(
    private readonly loadValue: (key: string) => Promise<string | undefined>,
  ) {}
  public async get(key: string): Promise<any> {
    // if we find the value in the cache, return immediately
    if (cache[key]) {
      Logger.log('Return key from Cache')
      return cache[key]
    }
    // load it with the provided function
    const res = await this.loadValue(key)
    if (res == null) {
      return res
    }
    // put the value in the cache and return.
    // The next time we need the value, we don't have to fetch it again.
    cache[key] = decrptFromSecret(res)
    return cache[key]
  }
}

export const secretManagerClient = new SecretManagerCache(key =>
  secretsValue(key).then(e => e.SecretString),
)
