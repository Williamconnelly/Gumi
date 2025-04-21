import { SetToArrayPipe } from './set-to-array.pipe';

describe('SetToArrayPipe', () => {
  it('create an instance', () => {
    const pipe: SetToArrayPipe = new SetToArrayPipe();

    expect(pipe).toBeTruthy();
  });
});
