import { useGetDeliveriesToSummariesQuery } from '../slice/summariesApiSlice'
import { useNavigate, useParams } from 'react-router-dom'
import EnhancedTable from '../../shared/Table/EnhancedTable'
import {
  Destination,
  SummaryToDeliveriesResponse
} from '../interfaces/deliveries.interface'
import { TableColumn } from '../../shared/Table/EnhancedTableRow'
import dayjs from 'dayjs'
import { useAppDispatch } from '../../../store/useRedux'
import { setPageName } from '../../auth/slice/authSlice'
import ScreenWrapper from '../../shared/ScreenWrapper'
import { Grid, IconButton, Typography, useTheme } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { useEffect } from 'react'

const columns: TableColumn<SummaryToDeliveriesResponse>[] = [
  {
    key: 'imported_id',
    title: 'Referencia del envío',
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
    render: (status) => <>{status}</>
  },
  {
    key: 'created_at',
    title: 'Fecha de creación',
    disablePadding: false,
    align: 'left',
    render: (created_at) => (
      <>{dayjs(created_at as string).format('DD-MM-YYYY HH:mm')}</>
    )
  }
]

const DeliveriesDetails = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const theme = useTheme()
  const { data, isFetching } = useGetDeliveriesToSummariesQuery({
    summaryId: id
  })
  useEffect(() => {
    dispatch(setPageName('Detalle de envíos'))
  }, [id, dispatch])

  const handleClick = () => {
    navigate('/summaries')
    dispatch(setPageName('Manifiestos'))
  }

  return (
    <ScreenWrapper>
      <Grid container marginBottom={2} alignItems={'center'} gap={2}>
        <Grid item>
          <IconButton color="primary" onClick={handleClick}>
            <ArrowBackIcon />
          </IconButton>
        </Grid>
        <Grid item>
          <Typography
            sx={{
              fontSize: '16px',
              color: `${theme.palette.primary.main}`,
              fontWeight: 'bold'
            }}
          >
            ID manifiesto {id}
          </Typography>
        </Grid>
      </Grid>
      <EnhancedTable<SummaryToDeliveriesResponse>
        data={data}
        isFetching={isFetching}
        columns={columns}
      />
    </ScreenWrapper>
  )
}

export default DeliveriesDetails
