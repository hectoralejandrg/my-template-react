import { styled } from '@mui/material'

const ToastWrapper = styled('div')(({ theme }) => ({
  minHeight: '100%',
  minWidth: '100%'
}))

const ToastContainer = () => {
  return <ToastWrapper>ToastContainer</ToastWrapper>
}

export default ToastContainer
