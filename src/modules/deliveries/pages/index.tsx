import { useGetDeliveriesQuery } from '../slice/deliveriesApiSlice'
import ScreenWrapper from '../../shared/ScreenWrapper'
import { useEffect, useState } from 'react'
import ModalEnhanced from '../../shared/ModalEnhanced'
import FormUpdateDeliveries from '../components/FormUpdateDeliveries'
import FiltersTable from '../components/FiltersTable'
import dayjs, { Dayjs } from 'dayjs'
import EnhancedTable, { Pagination } from '../../shared/Table/EnhancedTable'
import {
  Deliveries,
  Destination,
  Status
} from '../interfaces/deliveries.interfaces'
import { TableColumn } from '../../shared/Table/EnhancedTableRow'
import {
  Button,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Toolbar,
  Tooltip
} from '@mui/material'
import { useAppSelector } from '../../../store/useRedux'
import { useDispatch } from 'react-redux'
import { setTerminal } from '../slice/deliveriesSlice'

const columns: TableColumn<Deliveries>[] = [
  {
    key: 'id',
    title: 'ID',
    align: 'center',
    width: '5%',
    render: (id) => <>{id}</>
  },
  {
    key: 'imported_id',
    title: 'Referencia de envío',
    disablePadding: false,
    align: 'left',
    render: (imported_id) => <>{imported_id}</>
  },
  {
    key: 'tracking_number',
    title: 'Número de tracking',
    disablePadding: false,
    align: 'left',
    render: (tracking_number) => <>{tracking_number}</>
  },
  {
    key: 'destination',
    title: 'Dirección',
    disablePadding: false,
    align: 'left',
    render: (destination) => (
      <>{(destination as Destination)?.addressDestination}</>
    )
  },
  {
    key: 'status',
    title: 'Estado',
    disablePadding: false,
    align: 'center',
    render: (status) => <>{(status as Status)?.name}</>
  },
  {
    key: 'created_at',
    title: 'Creado',
    disablePadding: false,
    align: 'left',
    render: (created_at) => (
      <>{dayjs(created_at as string).format('DD-MM-YYYY HH:mm')}</>
    )
  }
]

const actionsToolbar = (items: Deliveries[]) => {
  const dispatch = useDispatch()
  const [modal, setModal] = useState(false)
  const [selectedValue, setSelectedValue] = useState('all')

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedValue((event.target as HTMLInputElement).value)
  }

  useEffect(() => {
    if (selectedValue === 'all') dispatch(setTerminal(undefined))
    else dispatch(setTerminal(selectedValue))
  }, [selectedValue, dispatch])

  const handleChangeModalUpdate = () => {
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
        {items?.length > 0 ? (
          <Tooltip title="Delete">
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
              onClick={handleChangeModalUpdate}
            >
              Cambiar estados
            </Button>
          </Tooltip>
        ) : (
          <FormControl>
            <RadioGroup
              row
              aria-labelledby="demo-row-radio-buttons-group-label"
              name="row-radio-buttons-group"
              onChange={handleChange}
              value={selectedValue}
            >
              <FormControlLabel
                value={'all'}
                control={<Radio />}
                label="Todos"
              />
              <FormControlLabel
                value={'0'}
                control={<Radio />}
                label="Activos"
              />
              <FormControlLabel
                value={'1'}
                control={<Radio />}
                label="Archivados"
              />
            </RadioGroup>
          </FormControl>
        )}
      </Toolbar>
      <ModalEnhanced
        title="Actualizar estados de envíos"
        open={modal}
        handleClose={handleChangeModalUpdate}
      >
        <FormUpdateDeliveries
          handleClose={handleChangeModalUpdate}
          selected={items}
        />
      </ModalEnhanced>
    </>
  )
}
interface Filters {
  imported_id?: string
  start_date?: string | Dayjs | null
  end_date?: string | Dayjs | null
  status?: number
}

const DeliveriesPage = () => {
  const { terminal } = useAppSelector((state) => state.deliveries)
  const [filters, setFilters] = useState<Filters>()
  const [pagination, setPagination] = useState<Pagination>({
    page: 0,
    perPage: 10
  })
  const { data, isFetching } = useGetDeliveriesQuery({
    ...pagination,
    ...filters,
    terminal,
    paginate: true,
    sort: 'DESC'
  })

  return (
    <ScreenWrapper>
      <FiltersTable
        getValuesFilter={(values) =>
          setFilters({ ...values, status: values?.status?.id })
        }
      />
      <EnhancedTable<Deliveries>
        data={data?.data}
        isFetching={isFetching}
        columns={columns}
        pagination={pagination}
        setPagination={setPagination}
        actionsToolbar={actionsToolbar}
        count={data?.count}
        showCheckbox
      />
    </ScreenWrapper>
  )
}

export default DeliveriesPage
