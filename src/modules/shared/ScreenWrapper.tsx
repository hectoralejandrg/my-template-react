import { Box, styled } from '@mui/material'

interface ScreenWrapperProps {
  children?: string | JSX.Element | JSX.Element[] | React.ReactNode
}
const Page = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(3)
}))

const ScreenWrapper = ({ children }: ScreenWrapperProps) => {
  return <Page>{children}</Page>
}

export default ScreenWrapper
