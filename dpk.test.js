const { deterministicPartitionKey } = require("./dpk");
const crypto = require("crypto");

describe("deterministicPartitionKey", () => {
  it("Returns the literal '0' when given no input", () => {
    const trivialKey = deterministicPartitionKey();
    expect(trivialKey).toBe("0");
  });

  it("Returns string on string input", () => {
    const key = deterministicPartitionKey({ partitionKey: '#' })
    expect(typeof key).toBe('string')
  })

  it("Returns string on object input", () => {
    const key = deterministicPartitionKey({ partitionKey: ['qwewq', {'eqw': 'qweqw'}] })
    expect(typeof key).toBe('string')
  })

  it("Returns partitionKey if set and is string", () => {
    const partitionKey = '##'
    const actual = deterministicPartitionKey({ partitionKey })
    expect(actual).toBe(partitionKey)
  })

   it("Returns stringified partitionKey if set and is not string", () => {
    const partitionKey = {'eqw': 'qweqw'}
    const actual = deterministicPartitionKey({ partitionKey })
    expect(actual).toBe(JSON.stringify(partitionKey))
  })

  it("Returns hash of stringified event", () => {
    let data = 'wewewqewqewq'
    let actual = deterministicPartitionKey(data)
    expect(actual).toBe(crypto.createHash("sha3-512").update(JSON.stringify(data)).digest("hex"))
    
    data = { simple: 'object' }
    actual = deterministicPartitionKey(data)
    expect(actual).toBe(crypto.createHash("sha3-512").update(JSON.stringify(data)).digest("hex"))
  })

  it ("Returns string not longer than 256 chars", () => {
    let longKey = deterministicPartitionKey({ partitionKey: '#'.repeat(3000) });
    expect(longKey.length).toBeLessThanOrEqual(256);
    longKey = deterministicPartitionKey('#'.repeat(3000));
    expect(longKey.length).toBeLessThanOrEqual(256);
    longKey = deterministicPartitionKey({ long: { nested: { object: { with: { long: { string: { inside: '#'.repeat(3000) } } } } } } });
    expect(longKey.length).toBeLessThanOrEqual(256);
  });
});
