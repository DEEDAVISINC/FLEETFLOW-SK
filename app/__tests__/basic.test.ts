// Basic test to verify testing infrastructure is working
describe('Basic Test Suite', () => {
  it('should pass a simple test', () => {
    expect(1 + 1).toBe(2);
  });

  it('should handle basic assertions', () => {
    const value = 'test';
    expect(value).toBe('test');
    expect(value).toHaveLength(4);
  });

  it('should work with arrays', () => {
    const array = [1, 2, 3];
    expect(array).toContain(2);
    expect(array).toHaveLength(3);
  });

  it('should work with objects', () => {
    const obj = { name: 'test', value: 42 };
    expect(obj).toHaveProperty('name');
    expect(obj).toHaveProperty('value', 42);
  });
});


