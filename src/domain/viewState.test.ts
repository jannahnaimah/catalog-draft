import { listViewStatus } from './viewState';

describe('listViewStatus', () => {
  it('prioritizes loading, then error, then empty, then success', () => {
    expect(
      listViewStatus({ isInitialLoading: true, error: 'ignored', itemCount: 0 }),
    ).toBe('loading');
    expect(
      listViewStatus({ isInitialLoading: false, error: 'offline', itemCount: 0 }),
    ).toBe('error');
    expect(
      listViewStatus({ isInitialLoading: false, error: null, itemCount: 0 }),
    ).toBe('empty');
    expect(
      listViewStatus({ isInitialLoading: false, error: null, itemCount: 20 }),
    ).toBe('success');
  });
});
