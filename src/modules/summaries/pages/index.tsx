import { Button, IconButton, Toolbar, Tooltip } from '@mui/material'
import dayjs from 'dayjs'
import { useState } from 'react'
import { useGetSummariesQuery } from '../slice/summariesApiSlice'
import EnhancedTable, { Pagination } from '../../shared/Table/EnhancedTable'
import { Company, Summary } from '../interfaces/summaries.interface'
import { TableColumn } from '../../shared/Table/EnhancedTableRow'
import DescriptionIcon from '@mui/icons-material/Description'
import ModalEnhanced from '../../shared/ModalEnhanced'
import FormChangeStatuses from '../components/FormChangeStatuses'
import { useNavigate } from 'react-router-dom'
import ScreenWrapper from '../../shared/ScreenWrapper'
import FiltersTable from '../components/FiltersTable'

const columns: TableColumn<Summary>[] = [
  {
    key: 'id',
    title: 'ID',
    align: 'center',
    width: '8%',
    render: (id) => <>{id}</>
  },
  {
    key: 'company',
    title: 'Compañía',
    disablePadding: false,
    align: 'left',
    render: (company) => <>{(company as Company)?.name}</>
  },
  {
    key: 'CountDeliveries',
    title: 'Envíos',
    disablePadding: false,
    align: 'left',
    render: (CountDeliveries) => <>{CountDeliveries}</>
  },
  {
    key: 'updated_at',
    title: 'Actualizado',
    disablePadding: false,
    align: 'left',
    // eslint-disable-next-line camelcase
    render: (updated_at) => (
      // eslint-disable-next-line camelcase
      <>{dayjs(updated_at as string).format('DD-MM-YYYY HH:mm')}</>
    )
  },
  {
    key: 'created_at',
    title: 'Creado',
    disablePadding: false,
    align: 'left',
    // eslint-disable-next-line camelcase
    render: (created_at) => (
      // eslint-disable-next-line camelcase
      <>{dayjs(created_at as string).format('DD-MM-YYYY HH:mm')}</>
    )
  }
]

const actionsColumn = (data: Summary) => {
  const navigate = useNavigate()
  const handleChangeModalUpdate = () => {
    navigate(`/summaries/deliveries/${data?.id}`)
  }
  return (
    <>
      <Tooltip title="Ver envíos" arrow>
        <IconButton
          color="inherit"
          size="small"
          onClick={() => handleChangeModalUpdate()}
        >
          <DescriptionIcon fontSize="small" sx={{ color: '#1B8ACE' }} />
        </IconButton>
      </Tooltip>
    </>
  )
}

const actionsToolbar = (items: Summary[]) => {
  const [modal, setModal] = useState(false)

  const handleChange = () => {
    setModal((prev) => !prev)
  }
  return (
    <>
      <Toolbar
        sx={{
          pl: { sm: 2 },
          pr: { xs: 1, sm: 1 }
        }}
      >
        <Tooltip title="Delete">
          <span>
            <Button
              variant="contained"
              disabled={items?.length <= 0}
              sx={{
                mr: 1,
                background: '#F4BB43',
                boxShadow: 'none',
                '&:hover': {
                  background: '#F4BB43',
                  opacity: 0.9
                }
              }}
              onClick={handleChange}
            >
              Cambiar estados
            </Button>
          </span>
        </Tooltip>
      </Toolbar>
      <ModalEnhanced
        title="Cambiar estados"
        open={modal}
        handleClose={handleChange}
      >
        <FormChangeStatuses selected={items} handleClose={handleChange} />
      </ModalEnhanced>
    </>
  )
}

const SummariesPage = () => {
  const [pagination, setPagination] = useState<Pagination>({
    page: 0,
    perPage: 10
  })
  const [filters, setFilters] = useState({})
  const { data, isFetching } = useGetSummariesQuery({
    ...pagination,
    ...filters
  })

  return (
    <ScreenWrapper>
      <FiltersTable getValuesFilter={(values) => setFilters({ ...values })} />
      <EnhancedTable<Summary>
        data={data?.summaries}
        isFetching={isFetching}
        columns={columns}
        pagination={pagination}
        setPagination={setPagination}
        rowsPerPageOptions={[5, 10, 20, 30, 40, 50]}
        count={data?.total}
        actionsColumn={actionsColumn}
        actionsToolbar={actionsToolbar}
        showCheckbox
        showActions
      />
    </ScreenWrapper>
  )
}

export default SummariesPage
