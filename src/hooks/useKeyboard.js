import { useEffect } from 'react'
import { usePlannerStore } from '../store'

export const useKeyboard = () => {
  const selectedId = usePlannerStore((s) => s.selectedId)
  const deleteSelected = usePlannerStore((s) => s.deleteSelected)

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedId) {
        const target = e.target
        if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
          return
        }
        e.preventDefault()
        deleteSelected()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedId, deleteSelected])
}
