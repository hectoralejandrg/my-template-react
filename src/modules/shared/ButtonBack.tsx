import { Button, ButtonProps } from '@mui/material'
import { useNavigate } from 'react-router'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'

interface CustomProps {
  isLoading: boolean
  routeNavigate: string
  propsButton?: ButtonProps
}

type ButtonBackProps = ButtonProps & CustomProps

export const ButtonBack = ({
  isLoading,
  routeNavigate,
  children,
  ...propsButton
}: ButtonBackProps) => {
  const navigate = useNavigate()
  const handleBack = () => navigate(routeNavigate, { replace: true })
  return (
    <>
      <Button
        variant="contained"
        color="secondary"
        disabled={isLoading}
        startIcon={<ArrowBackIcon fontSize="small" />}
        onClick={handleBack}
        {...propsButton}
      >
        {children ?? 'Back'}
      </Button>
    </>
  )
}
