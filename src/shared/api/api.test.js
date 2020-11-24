import { rest } from 'msw'
import { setupServer } from 'msw/node'
import * as Cookie from 'js-cookie'

import Api from './api'

const rawUserData = {
  profile: {
    username: 'hello',
    nb_orgs: 3,
  },
  orgs: [
    { id: 1, long_name: 'Codecov' },
    { id: 2, long_name: 'Github' },
  ],
}

// name in camelcase
const userData = {
  profile: {
    username: 'hello',
    nbOrgs: 3,
  },
  orgs: [
    { id: 1, longName: 'Codecov' },
    { id: 2, longName: 'Github' },
  ],
}

const server = setupServer(
  rest.get('/internal/test', (req, res, ctx) => {
    const hasToken = Boolean(req.headers.map['authorization'])
    return res(ctx.status(hasToken ? 200 : 401), ctx.json(rawUserData))
  }),
  rest.post('/internal/test', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(JSON.parse(req.body)))
  })
)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

let result, error
function callApi() {
  result = null
  error = null
  return Api.get({
    path: '/test',
  })
    .then((data) => {
      result = data
    })
    .catch((errorData) => {
      error = errorData
    })
}

describe('when calling an endpoint without a token', () => {
  beforeEach(callApi)

  it('has a 401 error', () => {
    expect(result.res.status).toBe(401)
  })
})

describe('when calling an endpoint with a token', () => {
  beforeEach(() => {
    Cookie.set('github-token', 'hello')
    return callApi()
  })

  afterEach(() => {
    Cookie.remove('github-token')
  })

  it('has the data and no error', () => {
    expect(error).toBeNull()
    expect(result.data).toEqual(userData)
  })
})

describe('when using a post erquest', () => {
  const data = {
    test: 'foo',
    camel_case: 'snakeCase',
  }
  beforeEach(() => {
    return Api.post({
      path: '/test',
      data,
    }).then((data) => {
      result = data
    })
  })

  it('returns the data, and transform to camelCase', () => {
    expect(result.data).toEqual({
      test: 'foo',
      camelCase: 'snakeCase',
    })
  })
})
