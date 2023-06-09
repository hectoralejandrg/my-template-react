import { Button, FormControl, Grid, InputLabel, TextField } from '@mui/material'
import TableDeliveries from '../components/TableDeliveries'
import SearchIcon from '@mui/icons-material/Search'
import RestartAltIcon from '@mui/icons-material/RestartAlt'
import { useFormik } from 'formik'
import StatusInput from '../../shared/StatusInput'
import { useGetDeliveriesQuery } from '../slice/deliveriesApiSlice'

const styleLabel = {
  'label + &': {
    marginTop: 3
  }
}
interface ValuesFormik {
  reference: string
  status: string
  created_at: string
}

const DeliveriesPage = () => {
  const { data } = useGetDeliveriesQuery()
  console.log(data)
  const { setFieldValue, values } = useFormik<ValuesFormik>({
    initialValues: {
      reference: '',
      status: '',
      created_at: ''
    },
    //   validationSchema: loginSchema,
    onSubmit: ({ reference, status }) => {
      console.log(reference, status)
    }
  })
  return (
    <>
      <Grid container my={3} gap={1}>
        <Grid item lg={3}>
          <FormControl variant="standard" fullWidth>
            <InputLabel htmlFor="status" shrink sx={{ fontSize: 20 }}>
              Referencia/Numero de tracking
            </InputLabel>
            <TextField
              id="reference"
              name="reference"
              type="text"
              size="small"
              sx={styleLabel}
              placeholder="Ingrese referencia/num de tracking"
              // value={values.reference}
              // onChange={handleChange}
              // error={touched.reference && Boolean(errors.reference)}
              // helperText={touched.reference && errors.reference}
            />
          </FormControl>
        </Grid>
        <Grid item lg={3}>
          <StatusInput
            inputLabel="Estado"
            keyStatus="code"
            value={values.status}
            onChange={(e) => setFieldValue('status', e.target.value)}
          />
        </Grid>
        <Grid item lg={3}>
          <FormControl variant="standard" fullWidth>
            <InputLabel htmlFor="status" shrink sx={{ fontSize: 20 }}>
              Fecha de creacion
            </InputLabel>
            <TextField
              id="reference"
              name="reference"
              type="text"
              size="small"
              sx={styleLabel}
              // value={values.reference}
              // onChange={handleChange}
              // error={touched.reference && Boolean(errors.reference)}
              // helperText={touched.reference && errors.reference}
            />
          </FormControl>
        </Grid>

        <Grid item lg={2} alignSelf="end">
          <Button
            variant="contained"
            sx={{
              mr: 1,
              background: '#F4BB43',
              boxShadow: 'none',
              '&:hover': {
                background: '#F4BB43',
                opacity: 0.9
              }
            }}
          >
            <SearchIcon />
          </Button>
          <Button variant="outlined">
            <RestartAltIcon />
          </Button>
        </Grid>
      </Grid>
      <TableDeliveries data={data} />
    </>
  )
}

export default DeliveriesPage
