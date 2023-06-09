import { Box, Grid } from '@mui/material'
import StatusInput from '../../shared/StatusInput'
import { ButtonSubmit } from '../../shared/ButtonSubmit'
import { useFormik } from 'formik'
import CustomInput from '../../shared/CustomInput'
import { useChangeStatusesSummariesMutation } from '../slice/summariesApiSlice'

interface ValuesFormik {
  name: string
  status: string
  comment: string
  rut: string
}

interface Props {
  selected: readonly string[]
}

const FormChangeStatuses = ({ selected }: Props) => {
  console.log('form selecte', selected)
  const [changeStatuses, { isLoading }] = useChangeStatusesSummariesMutation()
  const { handleSubmit, handleChange, setFieldValue, values, touched, errors } =
    useFormik<ValuesFormik>({
      initialValues: {
        name: '',
        status: '',
        comment: '',
        rut: ''
      },
      //   validationSchema: loginSchema,
      onSubmit: async ({ name, status, comment, rut }) => {
        await changeStatuses({
          summaries_ids: selected?.map((id) => Number(id)),
          status_id: Number(status),
          user_id: 1,
          evidence: {
            comment,
            name,
            rut
          }
        })
      }
    })
  return (
    <Box
      component="form"
      noValidate
      onSubmit={handleSubmit}
      sx={{ width: '100%' }}
    >
      <Grid container gap={3}>
        <StatusInput
          inputLabel="Estado"
          keyStatus="id"
          value={values.status}
          onChange={(e) => setFieldValue('status', e.target.value)}
        />
        <CustomInput
          inputLabel="Nombre"
          id="name"
          name="name"
          type="text"
          size="small"
          value={values.name}
          onChange={handleChange}
          error={touched.name && Boolean(errors.name)}
          helperText={touched.name && errors.name}
        />
        <CustomInput
          inputLabel="Rut"
          id="rut"
          name="rut"
          type="text"
          size="small"
          value={values.rut}
          onChange={handleChange}
          error={touched.rut && Boolean(errors.rut)}
          helperText={touched.rut && errors.rut}
        />
        <CustomInput
          inputLabel="Comentario"
          id="comment"
          name="comment"
          type="comment"
          size="small"
          fullWidth
          multiline
          rows={3}
          value={values.comment}
          onChange={handleChange}
          error={touched.comment && Boolean(errors.comment)}
          helperText={touched.comment && errors.comment}
        />
        <Grid container justifyContent="flex-end">
          <ButtonSubmit isLoading={isLoading} icon="nope" sx={{ px: 10 }}>
            Guardar
          </ButtonSubmit>
        </Grid>
      </Grid>
    </Box>
  )
}

export default FormChangeStatuses
