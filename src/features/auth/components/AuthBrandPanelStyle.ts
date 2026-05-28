import { keyframes } from '@emotion/react'

export const containerFlow = keyframes`
  0%, 55% {
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) scale(1);
  }
  100% {
    top: 48px;
    left: 48px;
    transform: translate(0, 0) scale(1);
  }
`

export const imageSize = keyframes`
  0%, 55% {
    height: 9rem;
  }
  100% {
    height: 4rem;
  }
`

export const textSize = keyframes`
  0%, 55% {
    font-size: 9rem;
  }
  100% {
    font-size: 2rem;
  }
`

export const brandPanelSize = keyframes`
  from {
    width: 100%;
  }
  to {
    width: 70%;
  }
`
