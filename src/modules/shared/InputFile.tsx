import {
  Box,
  Chip,
  Grid,
  IconButton,
  InputLabel,
  styled,
  Typography
} from '@mui/material'
// import { FormikErrors } from 'formik'
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined'
import { FormikErrors } from 'formik'

const Input = styled('input')({
  display: 'none'
})

interface CustomProps {
  error?: string | string[] | FormikErrors<any> | FormikErrors<any>[]
  title: string
  files?: File[]
  setFieldValue: (
    field: string,
    value: any,
    shouldValidate?: boolean | undefined
  ) => void
}

type InputFileProps = React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
> &
  CustomProps
const InputFile = ({
  title,
  error,
  files,
  setFieldValue,
  ...props
}: InputFileProps) => {
  const handleDelete = (index: number) => {
    const newFiles = files?.filter((_, idx) => index !== idx)
    setFieldValue(props.id!, newFiles)
  }
  return (
    <Box sx={{ minWidth: '100%' }}>
      <Input type="file" multiple {...props} />
      <InputLabel htmlFor={props.id} style={{ width: '100%' }}>
        <Typography
          color={'#00000099'}
          style={{ fontSize: '15.3px' }}
          paddingBottom={1}
        >
          {title}
        </Typography>
        <IconButton
          component="span"
          color="primary"
          sx={{
            border: '1px solid',
            width: '100%',
            height: '100px',
            borderRadius: '5px',
            borderColor: '#C4C4C4'
          }}
        >
          <Grid>
            <CloudUploadOutlinedIcon fontSize="large" />
            <Typography component={'p'}>Subir foto|archivo</Typography>
          </Grid>
        </IconButton>
      </InputLabel>
      <Grid container gap={1} mt={1}>
        {files?.map(({ name }, index) => (
          <Chip key={name} label={name} onDelete={() => handleDelete(index)} />
        ))}
      </Grid>
      {error && (
        <Box component={'div'} paddingTop={1}>
          <Typography noWrap color={'error'}>
            {error?.toString()}
          </Typography>
        </Box>
      )}
    </Box>
  )
}

export default InputFile
