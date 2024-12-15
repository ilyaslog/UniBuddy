import { useMemo } from 'react'

export function useLoadingAnimation() {
  const bounceAnimation = useMemo(() => ({
    animation: '2s infinite',
    '@keyframes bounce': {
      '0%, 100%': { transform: 'translateY(0)' },
      '50%': { transform: 'translateY(-10px)' }
    }
  }), [])

  return { bounceAnimation }
}