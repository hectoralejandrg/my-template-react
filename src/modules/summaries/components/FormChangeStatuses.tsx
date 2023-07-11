import { Box, DialogContent, Grid } from '@mui/material'
import { ButtonSubmit } from '../../shared/ButtonSubmit'
import { useFormik } from 'formik'
import CustomInput from '../../shared/CustomInput'
import { useChangeStatusesSummariesMutation } from '../slice/summariesApiSlice'
import { Summary } from '../interfaces/summaries.interface'
import StatusAutocomplete from '../../tracking/components/StatusAutocomplete'
import { Status } from '../../tracking/interfaces/statusses.interface'
import { useAppDispatch, useAppSelector } from '../../../store/useRedux'
import { showNotification } from '../../auth/slice/authSlice'

interface ValuesFormik {
  status: Status | null
  name?: string
  comment?: string
  rut?: string
}

interface Props {
  selected: Summary[]
  handleClose: () => void
}

const FormChangeStatuses = ({ selected, handleClose }: Props) => {
  const dispatch = useAppDispatch()
  const { profile } = useAppSelector((state) => state.auth)
  const [changeStatuses, { isLoading }] = useChangeStatusesSummariesMutation()
  const {
    handleSubmit,
    setFieldValue,
    values,
    touched,
    errors,
    getFieldProps
  } = useFormik<ValuesFormik>({
    initialValues: {
      status: null
    },
    //   validationSchema: loginSchema,
    onSubmit: async ({ name, status, comment, rut }) => {
      await changeStatuses({
        summaries_ids: selected?.map(({ id }) => id),
        status_id: status?.id,
        user_id: profile?.user_entity_id,
        evidence: {
          comment,
          name,
          rut
        }
      })
        .unwrap()
        .then((res) => {
          dispatch(
            showNotification({
              // @ts-ignore
              message: res.message,
              type: 'success'
            })
          )
          handleClose()
        })
        .catch((err) => {
          dispatch(
            showNotification({
              message: err.response.data.info,
              type: 'error'
            })
          )
        })
    }
  })
  return (
    <DialogContent>
      <Box
        component="form"
        noValidate
        onSubmit={handleSubmit}
        sx={{ width: '100%' }}
      >
        <Grid container gap={3}>
          <StatusAutocomplete
            inputLabel="Estado"
            value={values?.status}
            handleChange={(value) => setFieldValue('status', value)}
            error={touched.status && Boolean(errors.status)}
            helperText={touched.status && errors.status}
          />
          {values?.status?.terminal && (
            <>
              <CustomInput
                inputLabel="Nombre"
                {...getFieldProps('name')}
                error={touched.name && Boolean(errors.name)}
                helperText={touched.name && errors.name}
              />
              <CustomInput
                inputLabel="Rut"
                {...getFieldProps('rut')}
                error={touched.rut && Boolean(errors.rut)}
                helperText={touched.rut && errors.rut}
              />
            </>
          )}
          <CustomInput
            inputLabel="Comentario"
            {...getFieldProps('comment')}
            multiline
            rows={3}
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
    </DialogContent>
  )
}

export default FormChangeStatuses
