import {
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  TextField
} from '@mui/material'
import { useFormik } from 'formik'
import SearchIcon from '@mui/icons-material/Search'
import RestartAltIcon from '@mui/icons-material/RestartAlt'
// import { useGetSummariesQuery } from '../slice/summariesApiSlice'
// import TableSummaries from '../components/TableSummaries'
// import { useState } from 'react'
// import { Pagination } from '../interfaces/summaries.interface'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import dayjs, { Dayjs } from 'dayjs'
// import ModalSummaries from '../components/ModalSummaries'
// import FormChangeStatuses from '../components/FormChangeStatuses'

const styleLabel = {
  'label + &': {
    marginTop: 3
  }
}
interface ValuesFormik {
  id?: string
  carrier_id?: string
  start_date?: string | Dayjs | null
  end_date?: string | Dayjs | null
  sort?: string
}

const SummariesPage = () => {
  // const [formikValues, setFormikValues] = useState<ValuesFormik>()
  // const [selected, setSelected] = useState<readonly string[]>([])
  // const [pagination, setPagination] = useState<Pagination>({
  //   page: 0,
  //   limit: 10
  // })
  // const [open, setOpen] = useState(false)
  // const handleChangeModal = () => {
  //   setOpen(prev => !prev)
  // }
  // const { data, isFetching } = useGetSummariesQuery({ ...pagination, ...formikValues })

  const { handleSubmit, values, handleChange, setFieldValue, resetForm } =
    useFormik<ValuesFormik>({
      initialValues: {
        id: '',
        carrier_id: '',
        start_date: null,
        end_date: null,
        sort: 'asc'
      },
      //   validationSchema: loginSchema,
      onSubmit: (value) => {
        // setFormikValues({
        //   id: value?.id || undefined,
        //   carrier_id: value?.carrier_id || undefined,
        //   start_date: value?.start_date || undefined,
        //   end_date: value?.end_date || undefined,
        //   sort: value?.sort
        // })
      }
    })

  return (
    <>
      <Box component={'form'} onSubmit={handleSubmit}>
        <Grid container my={3} gap={1}>
          <Grid item lg={2}>
            <FormControl variant="standard" fullWidth>
              <InputLabel htmlFor="id" shrink sx={{ fontSize: 20 }}>
                ID del manifiesto
              </InputLabel>
              <TextField
                id="id"
                name="id"
                type="text"
                size="small"
                sx={styleLabel}
                placeholder="Ingrese id del manifiesto"
                value={values.id}
                onChange={handleChange}
                // error={touched.reference && Boolean(errors.reference)}
                // helperText={touched.reference && errors.reference}
              />
            </FormControl>
          </Grid>
          <Grid item lg={2}>
            <FormControl variant="standard" fullWidth>
              <InputLabel htmlFor="carrier_id" shrink sx={{ fontSize: 20 }}>
                ID del carrier
              </InputLabel>
              <TextField
                id="carrier_id"
                name="carrier_id"
                type="text"
                size="small"
                sx={styleLabel}
                placeholder="Ingrese id del carrier"
                value={values.carrier_id}
                onChange={handleChange}
                // error={touched.reference && Boolean(errors.reference)}
                // helperText={touched.reference && errors.reference}
              />
            </FormControl>
          </Grid>
          <Grid item lg={2}>
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
                      dayjs(newValue).format('YYYY-MM-DD')
                    )
                  }
                  sx={styleLabel}
                  slotProps={{ textField: { size: 'small' } }}
                />
              </LocalizationProvider>
            </FormControl>
          </Grid>
          <Grid item lg={2}>
            <FormControl variant="standard" fullWidth>
              <InputLabel shrink sx={{ fontSize: 20 }}>
                Hasta
              </InputLabel>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  value={values.start_date}
                  onChange={(newValue) =>
                    setFieldValue(
                      'end_date',
                      dayjs(newValue).format('YYYY-MM-DD')
                    )
                  }
                  sx={styleLabel}
                  slotProps={{ textField: { size: 'small' } }}
                />
              </LocalizationProvider>
            </FormControl>
          </Grid>

          <Grid item lg={2} alignSelf="end">
            <Button
              type="submit"
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
            <Button variant="outlined" onClick={() => resetForm()}>
              <RestartAltIcon />
            </Button>
          </Grid>
        </Grid>
      </Box>
      {/* <TableSummaries
        data={data}
        setPagination={setPagination}
        pagination={pagination}
        handleModal={handleChangeModal}
        selected={selected}
        setSelected={setSelected}
        isFetching={isFetching}
      />
      <ModalSummaries open={open} handleClose={handleChangeModal}>
        <FormChangeStatuses selected={selected}/>
      </ModalSummaries> */}
    </>
  )
}

export default SummariesPage
