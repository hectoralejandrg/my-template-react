import { Box, Button, FormControl, Grid, InputLabel } from '@mui/material'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { useFormik } from 'formik'
import dayjs, { Dayjs } from 'dayjs'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import SearchIcon from '@mui/icons-material/Search'
import RestartAltIcon from '@mui/icons-material/RestartAlt'
import CustomInput from '../../shared/CustomInput'
import StatusAutocomplete from '../../tracking/components/StatusAutocomplete'
import { Status } from '../interfaces/deliveries.interfaces'
const styleLabel = {
  'label + &': {
    marginTop: 3
  }
}

interface ValuesFormik {
  imported_id?: string
  start_date?: string | Dayjs | null
  end_date?: string | Dayjs | null
  status?: Status | null
}

interface Props {
  getValuesFilter: (values: ValuesFormik) => void
}
const FiltersTable = ({ getValuesFilter }: Props) => {
  const { handleSubmit, values, setFieldValue, resetForm, getFieldProps } =
    useFormik<ValuesFormik>({
      initialValues: {
        start_date: null,
        end_date: null,
        status: null
      },
      //   validationSchema: loginSchema,
      onSubmit: (value) => {
        getValuesFilter(value)
      }
    })

  return (
    <Box component={'form'} onSubmit={handleSubmit} marginBottom={1}>
      <Grid container spacing={1}>
        <Grid item md={3} xs={12}>
          <CustomInput
            inputLabel="No Referencia"
            {...getFieldProps('imported_id')}
            size="small"
          />
        </Grid>
        <Grid item md={3} xs={12}>
          <StatusAutocomplete
            inputLabel="Estado"
            value={values?.status}
            handleChange={(value) => setFieldValue('status', value)}
          />
        </Grid>
        <Grid item md={2} xs={12}>
          <FormControl variant="standard" fullWidth>
            <InputLabel shrink sx={{ fontSize: 20 }}>
              Desde
            </InputLabel>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                value={values.start_date}
                onChange={(newValue) =>
                  setFieldValue(
                    'start_date',
                    dayjs(newValue?.toString()).format('YYYY-MM-DD')
                  )
                }
                sx={styleLabel}
                slotProps={{ textField: { size: 'small' } }}
                format="DD-MM-YYYY"
              />
            </LocalizationProvider>
          </FormControl>
        </Grid>
        <Grid item md={2} xs={12}>
          <FormControl variant="standard" fullWidth>
            <InputLabel shrink sx={{ fontSize: 20 }}>
              Hasta
            </InputLabel>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                value={values.end_date}
                onChange={(newValue) =>
                  setFieldValue(
                    'end_date',
                    dayjs(newValue?.toString()).format('YYYY-MM-DD')
                  )
                }
                sx={styleLabel}
                slotProps={{ textField: { size: 'small' } }}
                format="DD-MM-YYYY"
              />
            </LocalizationProvider>
          </FormControl>
        </Grid>
        <Grid item container md={2} alignSelf={'end'} spacing={1}>
          <Grid item>
            <Button
              type="submit"
              variant="contained"
              sx={{
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
          </Grid>
          <Grid item>
            <Button variant="outlined" onClick={() => resetForm()}>
              <RestartAltIcon />
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  )
}

export default FiltersTable
