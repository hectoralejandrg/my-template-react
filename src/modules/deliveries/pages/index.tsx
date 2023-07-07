import TableDeliveries, { Pagination } from '../components/TableDeliveries'
// import SearchIcon from '@mui/icons-material/Search'
// import RestartAltIcon from '@mui/icons-material/RestartAlt'
// import { useFormik } from 'formik'
// import StatusInput from '../../shared/StatusInput'
import { useGetDeliveriesQuery } from '../slice/deliveriesApiSlice'
import ScreenWrapper from '../../shared/ScreenWrapper'
import { useState } from 'react'
import ModalEnhanced from '../../shared/ModalEnhanced'
import FormUpdateDeliveries from '../components/FormUpdateDeliveries'
import FiltersTable from '../components/FiltersTable'
import { Dayjs } from 'dayjs'

interface Filters {
  imported_id?: string
  start_date?: string | Dayjs | null
  end_date?: string | Dayjs | null
  status?: number
}

const DeliveriesPage = () => {
  const [edit, setEdit] = useState(false)
  const [selected, setSelected] = useState<readonly string[]>([])
  const [filters, setFilters] = useState<Filters>()
  const [toolbar, setToolbar] = useState<{ terminal?: string }>()
  const [pagination, setPagination] = useState<Pagination>({
    page: 0,
    perPage: 10,
    paginate: true,
    sort: 'DESC'
  })
  const { data, isFetching } = useGetDeliveriesQuery({
    ...pagination,
    ...filters,
    ...toolbar
  })

  const handleChangeModalUpdate = () => {
    setEdit((prev) => !prev)
  }

  return (
    <ScreenWrapper>
      <FiltersTable
        getValuesFilter={(values) =>
          setFilters({ ...values, status: values?.status?.id })
        }
      />
      <TableDeliveries
        data={data}
        selected={selected}
        setSelected={setSelected}
        handleModalUpdate={handleChangeModalUpdate}
        isFetching={isFetching}
        pagination={pagination}
        setPagination={setPagination}
        getValueToolbar={(value) => setToolbar({ terminal: value })}
      />
      <ModalEnhanced
        title="Actualizar estados de envíos"
        open={edit}
        handleClose={handleChangeModalUpdate}
      >
        <FormUpdateDeliveries
          handleClose={handleChangeModalUpdate}
          selected={selected}
        />
      </ModalEnhanced>
    </ScreenWrapper>
  )
}

export default DeliveriesPage
