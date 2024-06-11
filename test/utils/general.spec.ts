import { expect } from 'chai'
import { describe, it } from 'mocha'

import { firstAvailable, flatten } from 'src/utils/general'

describe('Testing firstAvailable function', () => {
  it('should return the first defined value', () => {
    const val = firstAvailable([undefined, '', 'something'], 'something else')
    expect(val).to.eql('something')
  })

  it('should return the first defined value', () => {
    const val = firstAvailable(
      [undefined, 'first', '', 'something'],
      'something else',
    )
    expect(val).to.eql('first')
  })

  it('should return something else', () => {
    const val = firstAvailable([undefined, '', '', undefined], 'something else')
    expect(val).to.eql('something else')
  })
})

describe('Testing flatten function', () => {
  it('should return all valid items in order', () => {
    const res = flatten(['', undefined, 'a', '', 'b', 'c'])
    expect(res).to.deep.equal(['a', 'b', 'c'])
  })

  it('should return all valid items including nested arrays too in order', () => {
    const res = flatten([
      '',
      [],
      undefined,
      'a',
      'b',
      [undefined],
      ['', 'c', 'd'],
    ])
    expect(res).to.deep.equal(['a', 'b', 'c', 'd'])
  })

  it('should return empty array', () => {
    expect(flatten(['', null, undefined])).to.deep.equal([])
  })
})
