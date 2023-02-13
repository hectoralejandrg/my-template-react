import { Grid, IconButton, styled, Typography } from '@mui/material'
// import { FormikErrors } from 'formik'
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined'

const Input = styled('input')({
  display: 'none'
})

// interface CustomProps {
//   error?: string | string[] | FormikErrors<any> | FormikErrors<any>[]
//   title: string
//   nameFile?: string
// }

// type InputUploadProps = React.DetailedHTMLProps<
//   React.InputHTMLAttributes<HTMLInputElement>,
//   HTMLInputElement
// > &
//   CustomProps
const InputFile = () => {
  return (
    <>
      <Input type="file" id="file" />
      <label htmlFor="file" style={{ width: '100%' }}>
        <Typography
          color={'#00000099'}
          style={{ fontSize: '15.3px' }}
          paddingBottom={1}
        >
          Adjuntar prueba
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
      </label>
    </>
  )
}

export default InputFile
