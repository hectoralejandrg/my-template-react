import { Box, Grid } from '@mui/material'
import { useFormik } from 'formik'
import { ButtonSubmit } from '../../shared/ButtonSubmit'
import { useUpdateTrackingMutation } from '../slice/trackingApiSlice'
import { useAppSelector } from '../../../store/useRedux'
import StatusAutocomplete from './StatusAutocomplete'
import { Status } from '../interfaces/statusses.interface'
import CustomInput from '../../shared/CustomInput'
import { updateTrackingSchema } from '../utils/updateTrackingSchema'
import InputFile from '../../shared/InputFile'
import { onSelectFiles } from '../../shared/fileToBase64'

interface Files64 {
  fileName: string
  base64String: string
}
interface ValuesFormik {
  reference: string
  status: Status | null
  comment: string
  name?: string
  rut?: string
  imagesFile?: Files64[]
}

const FormUpdateTracking = () => {
  const { profile } = useAppSelector((state) => state.auth)
  const [updateTracking, { isLoading }] = useUpdateTrackingMutation()
  const { handleSubmit, handleChange, setFieldValue, values, touched, errors } =
    useFormik<ValuesFormik>({
      initialValues: {
        reference: '',
        status: null,
        comment: ''
      },
      validationSchema: updateTrackingSchema,
      onSubmit: async (
        { reference, status, comment, name, rut, imagesFile },
        { resetForm }
      ) => {
        await updateTracking({
          imported_id: reference,
          user_id: profile?.user_entity_id,
          status: status?.id,
          evidence: {
            comment,
            name,
            rut,
            images: imagesFile?.map((f) => f.base64String)
          }
        })
          .unwrap()
          .then(() => resetForm())
      }
    })

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file: File[] = []
    if (e.target.value.length > 0) {
      for (const f of e.target.files!) {
        file.push(f)
      }
      const files: Files64[] = await onSelectFiles(e)
      setFieldValue('imagesFile', files)
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
          <CustomInput
            inputLabel="N° de referencia"
            id="reference"
            name="reference"
            type="text"
            size="small"
            value={values.reference}
            onChange={handleChange}
            error={touched.reference && Boolean(errors.reference)}
            helperText={touched.reference && errors.reference}
          />
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
          <InputFile
            title="Adjuntar prueba"
            id="imagesFile"
            accept=".jpg,.jpeg,.png"
            files={values.imagesFile}
            setFieldValue={setFieldValue}
            onChange={(e) => handleFile(e)}
          />
          <Grid container justifyContent="flex-end">
            <ButtonSubmit isLoading={isLoading} icon="nope" sx={{ px: 10 }}>
              Actualizar
            </ButtonSubmit>
          </Grid>
        </Grid>
      </Box>
    </Grid>
  )
}

export default FormUpdateTracking
