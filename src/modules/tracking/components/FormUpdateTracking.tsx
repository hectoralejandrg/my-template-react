import { Box, FormControl, Grid, InputLabel, TextField } from '@mui/material'
import { useFormik } from 'formik'
import { ButtonSubmit } from '../../shared/ButtonSubmit'
import InputFile from '../../shared/InputFile'

const styleLabel = {
  'label + &': {
    marginTop: 3
  }
}
const FormUpdateTracking = () => {
  const { handleSubmit, handleChange, values, touched, errors } = useFormik({
    initialValues: {
      reference: '',
      status: '',
      comment: '',
      proof: null
    },
    //   validationSchema: loginSchema,
    onSubmit: ({ reference, status, comment, proof }) => {
      console.log(reference, status, comment, proof)
    }
  })
  return (
    <Grid container item sx={{ width: '100%', p: 5 }}>
      <Box
        component="form"
        noValidate
        onSubmit={handleSubmit}
        sx={{ width: '100%' }}
      >
        <Grid container gap={3}>
          <FormControl variant="standard" fullWidth>
            <InputLabel htmlFor="status" shrink sx={{ fontSize: 20 }}>
              N° de referencia
            </InputLabel>
            <TextField
              id="reference"
              name="reference"
              type="text"
              size="small"
              value={values.reference}
              onChange={handleChange}
              sx={styleLabel}
              error={touched.reference && Boolean(errors.reference)}
              helperText={touched.reference && errors.reference}
            />
          </FormControl>
          <FormControl variant="standard" fullWidth>
            <InputLabel htmlFor="status" shrink sx={{ fontSize: 20 }}>
              Estado
            </InputLabel>
            <TextField
              id="status"
              name="status"
              type="status"
              size="small"
              fullWidth
              sx={styleLabel}
              value={values.status}
              onChange={handleChange}
              error={touched.status && Boolean(errors.status)}
              helperText={touched.status && errors.status}
            />
          </FormControl>
          <FormControl variant="standard" fullWidth>
            <InputLabel htmlFor="comment" shrink sx={{ fontSize: 20 }}>
              Comentario
            </InputLabel>
            <TextField
              id="comment"
              name="comment"
              type="comment"
              size="small"
              sx={styleLabel}
              fullWidth
              multiline
              rows={3}
              value={values.comment}
              onChange={handleChange}
              error={touched.comment && Boolean(errors.comment)}
              helperText={touched.comment && errors.comment}
            />
          </FormControl>
          <InputFile />
          <Grid container justifyContent="flex-end">
            <ButtonSubmit isLoading={false} icon="nope" sx={{ px: 10 }}>
              Actualizar
            </ButtonSubmit>
          </Grid>
        </Grid>
      </Box>
    </Grid>
  )
}

export default FormUpdateTracking
