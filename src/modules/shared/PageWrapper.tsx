import { styled } from '@mui/material'

const ContainerWrapper = styled('div')(({ theme }) => ({
  margin: 15,
  marginBottom: 0
}))

interface Prop {
  children?: React.ReactNode
}

const PageWrapper = ({ children }: Prop) => {
  return <ContainerWrapper>{children}</ContainerWrapper>
}

export default PageWrapper
