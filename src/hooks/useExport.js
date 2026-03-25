import { useCallback } from 'react'

export const useExport = (stageRef) => {
  const exportAsPng = useCallback(() => {
    if (!stageRef?.current) return

    const uri = stageRef.current.toDataURL({ pixelRatio: 2 })
    const link = document.createElement('a')
    link.download = 'apartment-plan.png'
    link.href = uri
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }, [stageRef])

  return { exportAsPng }
}
