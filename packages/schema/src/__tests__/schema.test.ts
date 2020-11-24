import * as Schema from '../schema'
import { createNonStrictValidator, createStrictValidator, ValidationResult } from '../validator'

const { Type, ObjectType, Struct, Int, Float, Literal, List, Union, Intersect, Nullable, Record, Json, Any } = Schema

let assertOk = <T>(result: ValidationResult<T>): T => {
  if (result.isOk) return result.value
  throw new Error(result.value.message)
}

describe('Schema', () => {
  it('supports number validation', () => {
    let validate = createStrictValidator(Schema.Number)

    expect(assertOk(validate(1))).toBe(1)

    expect(assertOk(validate(1.1))).toBe(1.1)

    expect(() => assertOk(validate('1'))).toThrow()

    expect(() => assertOk(validate('abc'))).toThrow()

    expect(() => assertOk(validate(false))).toThrow()

    expect(() => assertOk(validate(Number))).toThrow()

    expect(() => assertOk(validate([]))).toThrow()

    expect(() => assertOk(validate(null))).toThrow()

    expect(() => assertOk(validate({}))).toThrow()
  })

  it('supports integer validation', () => {
    let validate = createStrictValidator(Int)

    expect(assertOk(validate(1))).toBe(1)

    expect(() => assertOk(validate(1.1))).toThrow()

    expect(() => assertOk(validate('1'))).toThrow()

    expect(() => assertOk(validate('abc'))).toThrow()

    expect(() => assertOk(validate(false))).toThrow()

    expect(() => assertOk(validate(Number))).toThrow()

    expect(() => assertOk(validate([]))).toThrow()

    expect(() => assertOk(validate(null))).toThrow()

    expect(() => assertOk(validate({}))).toThrow()
  })

  it('supports float validation', () => {
    let validate = createStrictValidator(Float)

    expect(assertOk(validate(1))).toBe(1)

    expect(assertOk(validate(1.1))).toBe(1.1)

    expect(() => assertOk(validate('1'))).toThrow()

    expect(() => assertOk(validate('abc'))).toThrow()

    expect(() => assertOk(validate(false))).toThrow()

    expect(() => assertOk(validate(Number))).toThrow()

    expect(() => assertOk(validate([]))).toThrow()

    expect(() => assertOk(validate(null))).toThrow()

    expect(() => assertOk(validate({}))).toThrow()
  })

  it('supports string validation', () => {
    let validate = createStrictValidator(Schema.String)

    expect(assertOk(validate(''))).toBe('')
    expect(assertOk(validate('123'))).toBe('123')

    expect(() => assertOk(validate(123))).toThrow()

    expect(() => assertOk(validate(false))).toThrow()

    expect(() => assertOk(validate(Number))).toThrow()

    expect(() => assertOk(validate([]))).toThrow()

    expect(() => assertOk(validate(null))).toThrow()

    expect(() => assertOk(validate({}))).toThrow()
  })

  it('supports boolean validation', () => {
    let validate = createStrictValidator(Schema.Boolean)

    expect(assertOk(validate(true))).toBe(true)
    expect(assertOk(validate(false))).toBe(false)

    expect(() => assertOk(validate('true'))).toThrow()
    expect(() => assertOk(validate('false'))).toThrow()

    expect(() => assertOk(validate(123))).toThrow()

    expect(() => assertOk(validate('adf'))).toThrow()

    expect(() => assertOk(validate(Number))).toThrow()

    expect(() => assertOk(validate([]))).toThrow()

    expect(() => assertOk(validate(null))).toThrow()

    expect(() => assertOk(validate({}))).toThrow()
  })

  it('supports ID validation', () => {
    let validate = createStrictValidator(Schema.ID)

    expect(() => assertOk(validate(''))).toThrow()
    expect(assertOk(validate('123'))).toBe('123')

    expect(() => assertOk(validate(123))).toThrow()

    expect(() => assertOk(validate(false))).toThrow()

    expect(() => assertOk(validate(Number))).toThrow()

    expect(() => assertOk(validate([]))).toThrow()

    expect(() => assertOk(validate(null))).toThrow()

    expect(() => assertOk(validate({}))).toThrow()
  })

  it('supports nullable validation', () => {
    let validateNullableNumber = createStrictValidator(Nullable(Number))
    let validateNullableString = createStrictValidator(Nullable(String))
    let validateNullableBoolean = createStrictValidator(Nullable(Boolean))

    expect(assertOk(validateNullableNumber(null))).toBe(null)
    expect(assertOk(validateNullableNumber(undefined))).toBe(undefined)
    expect(assertOk(validateNullableNumber(1))).toBe(1)

    expect(assertOk(validateNullableString(null))).toBe(null)
    expect(assertOk(validateNullableString(undefined))).toBe(undefined)
    expect(assertOk(validateNullableString('1'))).toBe('1')

    expect(assertOk(validateNullableBoolean(null))).toBe(null)
    expect(assertOk(validateNullableBoolean(undefined))).toBe(undefined)
    expect(assertOk(validateNullableBoolean(true))).toBe(true)
    expect(assertOk(validateNullableBoolean(false))).toBe(false)
  })

  it('supports list validation', () => {
    let validateNumbers = createStrictValidator(List(Number))
    let validateStrings = createStrictValidator(List(String))
    let validateBooleans = createStrictValidator(List(Boolean))

    expect(assertOk(validateNumbers([1, 2, 3]))).toEqual([1, 2, 3])

    expect(() => assertOk(validateNumbers(['1', '2', '3']))).toThrow()

    expect(() => assertOk(validateNumbers(['a', 'b', 'c']))).toThrow()

    expect(assertOk(validateStrings(['a', 'b', 'c']))).toEqual(['a', 'b', 'c'])

    expect(assertOk(validateStrings(['1', '2', '3']))).toEqual(['1', '2', '3'])

    expect(() => assertOk(validateStrings([1, 2, 3]))).toThrow()

    expect(assertOk(validateBooleans([true, false, true]))).toEqual([true, false, true])

    expect(() => assertOk(validateBooleans(['true', false, 'true']))).toThrow()

    expect(() => assertOk(validateBooleans([1, 2, 3]))).toThrow()
  })

  it('supports object validation', () => {
    class Obj extends ObjectType {
      a = Number
      b = String
      c = Boolean
      d = {
        [Type]: List(Number),
      }
      e = {
        [Type]: Nullable(String),
      }
    }

    let validate = createStrictValidator(Obj)

    expect(
      assertOk(
        validate({
          a: 1,
          b: '1',
          c: false,
          d: [1, 2, 3],
          e: null,
        }),
      ),
    ).toEqual({
      a: 1,
      b: '1',
      c: false,
      d: [1, 2, 3],
      e: null,
    })

    expect(
      assertOk(
        validate({
          a: 1,
          b: '1',
          c: false,
          d: [1, 2, 3],
        }),
      ),
    ).toEqual({
      a: 1,
      b: '1',
      c: false,
      d: [1, 2, 3],
    })

    expect(
      assertOk(
        validate({
          a: 1,
          b: '1',
          c: false,
          d: [1, 2, 3],
          e: 'string',
        }),
      ),
    ).toEqual({
      a: 1,
      b: '1',
      c: false,
      d: [1, 2, 3],
      e: 'string',
    })

    expect(
      assertOk(
        validate({
          a: 1,
          b: '1',
          c: false,
          d: [1, 2, 3],
          e: 'string',
          f: 'not existed',
        }),
      ),
    ).toEqual({
      a: 1,
      b: '1',
      c: false,
      d: [1, 2, 3],
      e: 'string',
    })

    expect(() =>
      assertOk(
        validate({
          a: 1,
          b: '1',
          c: false,
          e: 'field d is missing',
        }),
      ),
    ).toThrow()

    expect(() => assertOk(validate(null))).toThrow()
    expect(() => assertOk(validate(123))).toThrow()
  })

  it('supports struct validation', () => {
    let Struct0 = Struct({
      a: {
        [Type]: Number,
      },
      b: {
        [Type]: String,
      },
      c: Boolean,
    })

    let Struct1 = Struct({
      struct0: {
        [Type]: Struct0,
      },
      d: List(Number),
    })

    let validateStruct0 = createStrictValidator(Struct0)
    let validateStruct1 = createStrictValidator(Struct1)

    expect(
      assertOk(
        validateStruct0({
          a: 1,
          b: '1',
          c: false,
        }),
      ),
    ).toEqual({
      a: 1,
      b: '1',
      c: false,
    })

    expect(() =>
      assertOk(
        validateStruct0({
          a: 1,
          b: 1,
          c: false,
        }),
      ),
    ).toThrow()

    expect(
      assertOk(
        validateStruct1({
          struct0: {
            a: 1,
            b: '1',
            c: false,
          },
          d: [1, 2, 3],
          f: 123,
        }),
      ),
    ).toEqual({
      struct0: {
        a: 1,
        b: '1',
        c: false,
      },
      d: [1, 2, 3],
    })
  })

  it('supports union validation', () => {
    let validate = createStrictValidator(Union(Number, Boolean, String))

    expect(assertOk(validate('10'))).toBe('10')
    expect(assertOk(validate(10))).toBe(10)
    expect(assertOk(validate('abc'))).toBe('abc')
    expect(assertOk(validate(false))).toBe(false)
  })

  it('supports intersect validation', () => {
    class Obj0 extends ObjectType {
      a = Number
    }

    class Obj1 extends ObjectType {
      b = String
    }

    let Obj2 = Intersect(Obj0, Obj1)

    let validateObj0 = createStrictValidator(Obj0)
    let validateObj1 = createStrictValidator(Obj1)
    let validateObj2 = createStrictValidator(Obj2)

    expect(assertOk(validateObj0({ a: 1 }))).toEqual({ a: 1 })
    expect(assertOk(validateObj1({ b: '1' }))).toEqual({ b: '1' })

    expect(() => assertOk(validateObj0({ b: '1' }))).toThrow()

    expect(() => assertOk(validateObj1({ a: 1 }))).toThrow()

    expect(
      assertOk(
        validateObj2({
          a: 1,
          b: '1',
        }),
      ),
    ).toEqual({
      a: 1,
      b: '1',
    })

    expect(
      assertOk(
        validateObj2({
          a: 1,
          b: '1',
          c: 3,
        }),
      ),
    ).toEqual({
      a: 1,
      b: '1',
    })

    expect(() => assertOk(validateObj2({ b: '1' }))).toThrow()

    expect(() => assertOk(validateObj2({ a: 1 }))).toThrow()
  })

  it('supports literal validation', () => {
    let validateLiteralOne = createStrictValidator(Literal(1))
    let validateLiteralTwo = createStrictValidator(Literal(2))
    let validateLiteralAAA = createStrictValidator(Literal('AAA'))
    let validateLiteralTrue = createStrictValidator(Literal(true))

    expect(assertOk(validateLiteralOne(1))).toBe(1)
    expect(assertOk(validateLiteralTwo(2))).toBe(2)
    expect(assertOk(validateLiteralAAA('AAA'))).toBe('AAA')
    expect(assertOk(validateLiteralTrue(true))).toBe(true)

    expect(() => assertOk(validateLiteralOne(2))).toThrow()
    expect(() => assertOk(validateLiteralTwo(1))).toThrow()
    expect(() => assertOk(validateLiteralAAA('aaa'))).toThrow()
    expect(() => assertOk(validateLiteralTrue(false))).toThrow()
  })

  it('supports json validation', () => {
    let validateJson = createStrictValidator(Json)

    expect(assertOk(validateJson(null))).toEqual(null)
    expect(assertOk(validateJson(1))).toEqual(1)
    expect(assertOk(validateJson('1'))).toEqual('1')
    expect(assertOk(validateJson(false))).toEqual(false)
    expect(assertOk(validateJson(true))).toEqual(true)

    expect(
      assertOk(
        validateJson({
          a: 1,
          b: 2,
          c: null,
          d: [1, '1', false],
        }),
      ),
    ).toEqual({
      a: 1,
      b: 2,
      c: null,
      d: [1, '1', false],
    })

    expect(assertOk(validateJson([1, 2, 3, 'false']))).toEqual([1, 2, 3, 'false'])

    expect(() => assertOk(validateJson(() => {}))).toThrow()
  })

  it('supports record validation', () => {
    let validateNumberRecord = createStrictValidator(Record(Number))
    let validateStringRecord = createStrictValidator(Record(String))

    expect(assertOk(validateNumberRecord({ a: 1, b: 1 }))).toEqual({ a: 1, b: 1 })

    expect(assertOk(validateStringRecord({ a: 'a', b: 'b' }))).toEqual({ a: 'a', b: 'b' })

    expect(() => assertOk(validateNumberRecord({ a: 'a', b: 1 }))).toThrow()

    expect(() => assertOk(validateStringRecord({ a: 'a', b: 1 }))).toThrow()
  })

  it('supports any pattern', () => {
    let validateAny = createStrictValidator(Any)
    expect(assertOk(validateAny(0))).toEqual(0)
    expect(assertOk(validateAny('1'))).toEqual('1')
    expect(assertOk(validateAny(null))).toEqual(null)
    expect(assertOk(validateAny([1, 2, 3]))).toEqual([1, 2, 3])
    expect(assertOk(validateAny({ a: 1, b: 2 }))).toEqual({ a: 1, b: 2 })
    expect(assertOk(validateAny(false))).toEqual(false)
  })

  it('supports defining recursive schema', () => {
    class Nest extends ObjectType {
      value = Number
      nest = Nullable(Nest)
    }

    let validateNest = createStrictValidator(Nest)

    expect(
      assertOk(
        validateNest({
          value: 0,
          nest: {
            value: 1,
            nest: {
              value: 2,
              nest: {
                value: 3,
              },
            },
          },
        }),
      ),
    ).toEqual({
      value: 0,
      nest: {
        value: 1,
        nest: {
          value: 2,
          nest: {
            value: 3,
          },
        },
      },
    })

    expect(() => assertOk(validateNest(null))).toThrow()
    expect(() =>
      assertOk(
        validateNest({
          value: 'abc',
        }),
      ),
    ).toThrow()
  })
})

describe('createValidator', () => {
  it('support custom visitor', () => {
    let struct = Struct({
      a: Number,
      b: Int,
      c: Boolean,
    })

    let validate0 = createStrictValidator(struct)

    let validate1 = createNonStrictValidator(struct)

    // valid data for both
    let data0 = {
      a: 1.23,
      b: 1,
      c: false,
    }

    // invalid for strict mode, valid for non-strict mode
    let data1 = {
      a: 1,
      b: 1.1,
      c: 'false',
    }

    let data2 = {
      a: '1',
      b: '1.1',
      c: true,
    }

    let data3 = {
      a: '1.1',
      b: '1',
      c: 'true',
    }

    expect(assertOk(validate0(data0))).toEqual({
      a: 1.23,
      b: 1,
      c: false,
    })

    expect(assertOk(validate1(data0))).toEqual({
      a: 1.23,
      b: 1,
      c: false,
    })

    expect(() => assertOk(validate0(data1))).toThrow()

    expect(assertOk(validate1(data1))).toEqual({
      a: 1,
      b: 1,
      c: false,
    })

    expect(() => assertOk(validate0(data2))).toThrow()

    expect(assertOk(validate1(data2))).toEqual({
      a: 1,
      b: 1,
      c: true,
    })

    expect(() => assertOk(validate0(data3))).toThrow()

    expect(assertOk(validate1(data3))).toEqual({
      a: 1.1,
      b: 1,
      c: true,
    })
  })
})