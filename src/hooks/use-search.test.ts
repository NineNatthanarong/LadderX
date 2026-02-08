import { renderHook, act, waitFor } from '@testing-library/react'
import { useSearch } from './use-search'
import { vi } from 'vitest'

// Mock the data loader
vi.mock('@/lib/data-loader', () => ({
  loadSearchIndex: vi.fn().mockResolvedValue([
    {
      id: '1',
      documentId: 'doc1',
      title: 'Constitution',
      category: 'Legal',
      content: 'We the people of the United States',
      path: 'const.pdf'
    },
    {
      id: '2',
      documentId: 'doc2',
      title: 'Amendments',
      category: 'Legal',
      content: 'Right to bear arms',
      path: 'amend.pdf'
    }
  ])
}))

describe('useSearch', () => {
  it('should initialize with empty results', async () => {
    const { result } = renderHook(() => useSearch())

    // Wait for initial load
    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current.results).toEqual([])
    expect(result.current.query).toBe('')
  })

  it('should filter results based on query', async () => {
    const { result } = renderHook(() => useSearch())

    await waitFor(() => expect(result.current.loading).toBe(false))

    act(() => {
      result.current.setQuery('Constitution')
    })

    // Search might be async/debounced in real impl, but Fuse is sync usually
    await waitFor(() => {
        expect(result.current.results).toHaveLength(1)
        expect(result.current.results[0].title).toBe('Constitution')
    })
  })

  it('should handle empty query', async () => {
    const { result } = renderHook(() => useSearch())
    await waitFor(() => expect(result.current.loading).toBe(false))

    act(() => {
      result.current.setQuery('')
    })

    expect(result.current.results).toEqual([])
  })
})
