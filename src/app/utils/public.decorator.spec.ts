import { SetMetadata } from '@nestjs/common';
import { IS_PUBLIC_KEY, Public } from './public.decorator';

describe('Public Decorator', () => {
  it('should add metadata to class method', () => {
    const metadataValue = true;

    class TestClass {
      @Public()
      testMethod() {}
    }

    const reflector = {
      get: jest.fn().mockReturnValue(metadataValue),
    };

    const decoratorFn = SetMetadata(IS_PUBLIC_KEY, metadataValue);
    decoratorFn(TestClass.prototype, 'testMethod', null);

    const result = reflector.get(IS_PUBLIC_KEY, TestClass.prototype.testMethod);
    expect(result).toBe(metadataValue);
  });
});
