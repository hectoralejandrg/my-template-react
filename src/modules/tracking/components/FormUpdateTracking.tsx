import { Box, FormControl, Grid, InputLabel, TextField } from '@mui/material'
import { useFormik } from 'formik'
import { ButtonSubmit } from '../../shared/ButtonSubmit'
import InputFile from '../../shared/InputFile'
import StatusInput from '../../shared/StatusInput'

const styleLabel = {
  'label + &': {
    marginTop: 3
  }
}

interface ValuesFormik {
  reference: string
  status: string
  comment: string
  proof: File[]
}
const FormUpdateTracking = () => {
  const { handleSubmit, handleChange, setFieldValue, values, touched, errors } =
    useFormik<ValuesFormik>({
      initialValues: {
        reference: '',
        status: '',
        comment: '',
        proof: []
      },
      //   validationSchema: loginSchema,
      onSubmit: ({ reference, status, comment, proof }) => {
        console.log(reference, status, comment, proof)
      }
    })

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file: File[] = []
    if (e.target.value.length > 0) {
      for (const f of e.target.files!) {
        file.push(f)
      }
      setFieldValue('proof', file)
    }
  }
  return (
    <Grid container item sx={{ width: '100%' }} padding={{ xs: 0, sm: 5 }}>
      <Box
        component="form"
        noValidate
        onSubmit={handleSubmit}
        sx={{ width: '100%' }}
      >
        <Grid container gap={3}>
          <FormControl variant="standard" fullWidth>
            <InputLabel shrink sx={{ fontSize: 20 }}>
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
          <StatusInput
            inputLabel="Estado"
            keyStatus="id"
            value={values.status}
            onChange={(e) => setFieldValue('status', e.target.value)}
          />
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
          <InputFile
            title="Adjuntar prueba"
            id="proof"
            accept=".jpg,.jpeg,.png"
            files={values.proof}
            setFieldValue={setFieldValue}
            onChange={(e) => handleFile(e)}
          />
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
