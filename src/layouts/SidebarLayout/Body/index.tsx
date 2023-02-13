import { Card, CardContent, Divider, styled } from '@mui/material'
import { useOutlet } from 'react-router-dom'
import Header from '../Header'

const PrincipalWrapper = styled('div')(() => ({
  width: '100%',
  minHeight: '100vh',
  backgroundColor: '#EDF2F7'
}))

const PaperWrapper = styled('div')(() => ({
  width: '100%',
  height: '100vh',
  paddingLeft: 15,
  paddingRight: 15,
  paddingTop: 10
}))

const BodyLayout = () => {
  const outlet = useOutlet()
  return (
    <PrincipalWrapper>
      <PaperWrapper>
        <Card sx={{ height: '100%', px: 4, py: 1 }}>
          <CardContent>
            <Header />
            <Divider />
            {outlet}
          </CardContent>
        </Card>
      </PaperWrapper>
    </PrincipalWrapper>
  )
}

export default BodyLayout
