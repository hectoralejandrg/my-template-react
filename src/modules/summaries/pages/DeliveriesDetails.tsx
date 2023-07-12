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
import { Button, Grid, IconButton, Toolbar, Tooltip, Typography, useTheme } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { useEffect, useState } from 'react'
import ModalEnhanced from '../../shared/ModalEnhanced'
import FormUpdateDeliveries from '../../deliveries/components/FormUpdateDeliveries'

const columns: TableColumn<SummaryToDeliveriesResponse>[] = [
  {
    key: 'id',
    title: 'ID',
    align: 'center',
    render: (id) => <>{id}</>
  },
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
    key: 'status_name',
    title: 'Estado',
    disablePadding: false,
    align: 'center',
    render: (status_name) => <>{status_name}</>
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

const actionsToolbar = (items: SummaryToDeliveriesResponse[]) => {
  const [modal, setModal] = useState(false)

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
              onClick={handleChangeModalUpdate}
            >
              Cambiar estados
            </Button>
          </span>
        </Tooltip>
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
        actionsToolbar={actionsToolbar}
        showCheckbox
      />
    </ScreenWrapper>
  )
}

export default DeliveriesDetails
