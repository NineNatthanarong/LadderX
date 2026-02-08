import { renderHook, act } from '@testing-library/react'
import { useTableOfContents } from './use-toc'

describe('useTableOfContents', () => {
  beforeAll(() => {
    // Mock IntersectionObserver
    global.IntersectionObserver = class IntersectionObserver {
      readonly root: Element | Document | null = null
      readonly rootMargin: string = ''
      readonly thresholds: ReadonlyArray<number> = []

      constructor(callback: IntersectionObserverCallback, options?: IntersectionObserverInit) {
        // save callback to trigger it manually if needed
      }
      disconnect() {}
      observe() {}
      unobserve() {}
      takeRecords() { return [] }
    }
  })

  it('should return empty activeId initially', () => {
    const { result } = renderHook(() => useTableOfContents())
    expect(result.current.activeId).toBe('')
  })
})
