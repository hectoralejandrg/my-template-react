import { Box, DialogContent, Grid } from '@mui/material'
import { useFormik } from 'formik'
import { Status } from '../../tracking/interfaces/statusses.interface'
import StatusAutocomplete from '../../tracking/components/StatusAutocomplete'
import CustomInput from '../../shared/CustomInput'
import { ButtonSubmit } from '../../shared/ButtonSubmit'
import { useUpdateStatusDeliveriesMutation } from '../slice/deliveriesApiSlice'
import { useAppDispatch, useAppSelector } from '../../../store/useRedux'
import { showNotification } from '../../auth/slice/authSlice'

interface ValuesFormik {
  reference: string
  status: Status | null
  comment: string
  name?: string
  rut?: string
}

interface Props<T> {
  selected: T[]
  handleClose: () => void
}

const FormUpdateDeliveries = <T extends Record<string, any>>({ selected, handleClose }: Props<T>) => {
  const dispatch = useAppDispatch()
  const { profile } = useAppSelector((state) => state.auth)
  const [changeStatuses, { isLoading }] = useUpdateStatusDeliveriesMutation()
  const { handleSubmit, handleChange, setFieldValue, values, touched, errors } =
    useFormik<ValuesFormik>({
      initialValues: {
        reference: '',
        status: null,
        comment: '',
        name: '',
        rut: ''
      },
      onSubmit: async ({ name, status, comment, rut }) => {
        await changeStatuses({
          delivery_ids: selected?.map(({ id }) => id),
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
            </>
          )}
          <CustomInput
            inputLabel="Comentario"
            id="comment"
            name="comment"
            type="text"
            size="small"
            value={values.comment}
            onChange={handleChange}
            error={touched.comment && Boolean(errors.comment)}
            helperText={touched.comment && errors.comment}
            rows={3}
            multiline
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

export default FormUpdateDeliveries
