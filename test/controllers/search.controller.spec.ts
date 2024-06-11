import { expect } from 'chai'
import { describe, it } from 'mocha'

import { processQuery } from 'controllers/search.controller'

describe('Testing processQuery', () => {
  it('should return first available query and defaults', () => {
    const res = processQuery({
      query: ['first', 'second'],
      category: [],
      limit: [],
      provider: [],
    })

    expect(res).to.deep.equal({ query: 'first', category: 'All', limit: 10 })
  })

  it('should first available category and defaults', () => {
    const res = processQuery({
      query: ['first', 'second'],
      category: ['', 'a', 'b', 'c'],
      limit: [],
      provider: [],
    })

    expect(res).to.deep.equal({ query: 'first', category: 'a', limit: 10 })
  })

  it('should first available limit and defaults', () => {
    const res = processQuery({
      query: ['first', 'second'],
      category: [],
      limit: ['', '50'],
      provider: [],
    })

    expect(res).to.deep.equal({ query: 'first', category: 'All', limit: 50 })
  })

  it('should return no providers in non was passed', () => {
    const res = processQuery({
      query: ['first', 'second'],
      category: [],
      limit: [],
      provider: [],
    })

    expect(res.provider).to.eql(undefined)
  })

  it('should return all providers in one array and defaults', () => {
    const res = processQuery({
      query: ['first', 'second'],
      category: [],
      limit: [],
      provider: ['a', 'b', [], ['c', 'd', 'e'], 'g'],
    })

    expect(res).to.deep.equal({
      query: 'first',
      category: 'All',
      limit: 10,
      provider: ['a', 'b', 'c', 'd', 'e', 'g'],
    })
  })
})
