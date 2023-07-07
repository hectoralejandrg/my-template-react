import { useState } from 'react'
import ScreenWrapper from '../../shared/ScreenWrapper'
import EnhancedTable, { Pagination } from '../../shared/Table/EnhancedTable'
import { Company } from '../interfaces/companies.interface'
import { useGetCompaniesQuery } from '../slice/companiesApiSlice'
import { TableColumn } from '../../shared/Table/EnhancedTableRow'
import { Box, Button, Grid, IconButton, Tooltip } from '@mui/material'
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined'
import ModalEnhanced from '../../shared/ModalEnhanced'
import FormCreateCompany from '../components/FormCreateCompany'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import FormUpdateCompany from '../components/FormUpdateCompany'

const columns: TableColumn<Company>[] = [
  { key: 'id', title: 'ID', align: 'left', render: (id) => <>{id}</> },
  {
    key: 'name',
    title: 'Nombre',
    disablePadding: false,
    align: 'left',
    render: (name) => <>{name}</>
  },
  {
    key: 'carrier_code',
    title: 'Carrier',
    disablePadding: false,
    align: 'left',
    render: (carrier) => <>{carrier}</>
  }
]

const actionsColumn = (data: Company) => {
  const [modal, setModal] = useState(false)
  const handleChangeModalUpdate = () => {
    setModal((prev) => !prev)
  }
  return (
    <>
      <Tooltip title="Editar compañía" arrow>
        <IconButton
          color="inherit"
          size="small"
          onClick={() => handleChangeModalUpdate()}
        >
          <CreateOutlinedIcon fontSize="small" sx={{ color: '#1B8ACE' }} />
        </IconButton>
      </Tooltip>
      <ModalEnhanced
        title="Actualizar compañía"
        open={modal}
        handleClose={handleChangeModalUpdate}
      >
        <FormUpdateCompany handleClose={handleChangeModalUpdate} data={data} />
      </ModalEnhanced>
    </>
  )
}

const CompaniesPage = () => {
  const [modal, setModal] = useState(false)
  const [pagination, setPagination] = useState<Pagination>({
    page: 0,
    perPage: 10
  })
  const { data, isFetching } = useGetCompaniesQuery({
    ...pagination,
    paginate: true
  })

  const handleChangeModalUpdate = () => {
    setModal((prev) => !prev)
  }

  return (
    <ScreenWrapper>
      <Box sx={{ marginBottom: 3 }}>
        <Grid container justifyContent={'end'}>
          <Grid item>
            <Button
              type="submit"
              variant="contained"
              sx={{
                background:
                  'linear-gradient(90deg, #F49143 -21.52%, #F4BB43 104.43%)',
                boxShadow: 'none'
              }}
              startIcon={<AddCircleIcon />}
              onClick={handleChangeModalUpdate}
            >
              Nueva compañía
            </Button>
          </Grid>
        </Grid>
      </Box>
      <EnhancedTable<Company>
        data={data?.companies?.data}
        columns={columns}
        isFetching={isFetching}
        pagination={pagination}
        setPagination={setPagination}
        rowsPerPageOptions={[5, 10, 20, 30, 40, 50]}
        count={data?.companies?.count}
        actionsColumn={actionsColumn}
      />
      <ModalEnhanced
        title="Crear nueva compañía"
        open={modal}
        handleClose={handleChangeModalUpdate}
      >
        <FormCreateCompany handleClose={handleChangeModalUpdate} />
      </ModalEnhanced>
    </ScreenWrapper>
  )
}

export default CompaniesPage
