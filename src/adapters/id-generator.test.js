import { IdGeneratorAdapter } from './id-generator'

describe('IdGeneratorAdapter', () => {
    it('should return a random id', async () => {
        const sut = new IdGeneratorAdapter()

        const result = await sut.execute()

        expect(result).toBeTruthy()
        expect(typeof result).toBe('string')
        const uuidRegex =
            /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
        expect(result).toMatch(uuidRegex)
    })
})
