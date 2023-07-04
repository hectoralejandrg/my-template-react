import {
  Box,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  TableRow,
  Tooltip,
  styled,
  tableCellClasses
} from '@mui/material'
import React, { useEffect, useState } from 'react'
import TableHeadUsers, { HeadCell } from './TableHeadUsers'
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined'
import VpnKeyOutlinedIcon from '@mui/icons-material/VpnKeyOutlined'
import { Users, UsersResponse } from '../interfaces/users.interface'
import dayjs from 'dayjs'
import TableRowsLoader from '../../shared/Table/TableRowsLoader'
import SwitchStatus from './SwitchStatus'
import { useAppDispatch } from '../../../store/useRedux'
import { setUsers } from '../slice/usersSlice'

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14
  }
}))

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: '#FAFAFC;'
  },
  '&:nth-of-type(even)': {
    backgroundColor: 'white'
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    // backgroundColor: '#FAFAFC',
    border: 0
  },
  '& > td, th': {
    color: '#6E6B7B'
  }
}))

const headCell: HeadCell[] = [
  {
    id: 'id',
    disablePadding: false,
    label: 'ID',
    align: 'center'
  },
  {
    id: 'user',
    disablePadding: false,
    label: 'Usuario',
    align: 'left'
  },
  {
    id: 'email',
    disablePadding: false,
    label: 'Correo',
    align: 'left'
  },
  {
    id: 'rol',
    disablePadding: false,
    label: 'Rol',
    align: 'left'
  },
  {
    id: 'created_at',
    disablePadding: false,
    label: 'Fecha de creacion',
    align: 'left'
  },
  {
    id: 'status',
    disablePadding: false,
    label: 'Estado',
    align: 'left'
  },
  {
    id: 'actions',
    disablePadding: false,
    label: 'Accion',
    align: 'center'
  }
]

export interface Pagination {
  page: number
  limit: number
  total?: number
  sort: string
}

interface Props {
  data?: UsersResponse
  pagination: Pagination
  selected?: readonly string[]
  setPagination: React.Dispatch<React.SetStateAction<Pagination>>
  handleModal: (user?: Users) => void
  handleModalUpdate: () => void
  setSelected?: React.Dispatch<React.SetStateAction<readonly string[]>>
  isFetching: boolean
}

const TableUsers = ({
  data,
  pagination,
  setPagination,
  isFetching,
  handleModal,
  handleModalUpdate
}: Props) => {
  const [rows, setRows] = useState<Users[]>([])
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (data) setRows(data?.users)
  }, [data])

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2, boxShadow: 'none' }}>
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size="medium"
          >
            <TableHeadUsers headCells={headCell} />
            <TableBody>
              {isFetching ? (
                <TableRowsLoader
                  rowsNum={pagination.limit}
                  headNum={headCell.length}
                />
              ) : (
                rows.map((row, index) => {
                  return (
                    <StyledTableRow hover key={`${row?.id}-${index}`}>
                      <StyledTableCell align="center">
                        {row?.id}
                      </StyledTableCell>
                      <StyledTableCell align="left">
                        {row?.name}
                      </StyledTableCell>
                      <StyledTableCell align="left">
                        {row?.email}
                      </StyledTableCell>
                      <StyledTableCell align="left">
                        {row?.role?.name}
                      </StyledTableCell>
                      <StyledTableCell align="left">
                        {dayjs(row?.created_at).format('DD-MM-YYYY HH:mm')}
                      </StyledTableCell>
                      <StyledTableCell align="left">
                        <SwitchStatus user={row} />
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        <Tooltip title="Editar usuario" arrow>
                          <IconButton
                            color="inherit"
                            size="small"
                            onClick={() => {
                              dispatch(setUsers(row))
                              handleModalUpdate()
                            }}
                          >
                            <CreateOutlinedIcon
                              fontSize="small"
                              sx={{ color: '#1B8ACE' }}
                            />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Cambiar contraseña" arrow>
                          <IconButton
                            color="inherit"
                            size="small"
                            onClick={() => handleModal(row)}
                          >
                            <VpnKeyOutlinedIcon
                              fontSize="small"
                              sx={{ color: '#1B8ACE' }}
                            />
                          </IconButton>
                        </Tooltip>
                      </StyledTableCell>
                    </StyledTableRow>
                  )
                })
              )}
              {/* {emptyRows > 0 && (
              <TableRow
                style={{
                  height: (dense ? 33 : 53) * emptyRows
                }}
              >
                <TableCell colSpan={6} />
              </TableRow>
            )} */}
            </TableBody>
          </Table>
        </TableContainer>
        {data?.users && (
          <TablePagination
            component="div"
            rowsPerPageOptions={[10, 20, 30, 40, 50]}
            count={data.total}
            page={pagination.page}
            rowsPerPage={pagination.limit}
            onPageChange={(_, page) =>
              setPagination((prev) => ({ ...prev, page }))
            }
            onRowsPerPageChange={(e) =>
              setPagination((prev) => ({ ...prev, page: 0, limit: parseInt(e.target.value) }))
            }
            labelRowsPerPage={'Filas por página'}
            labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
          />
        )}
      </Paper>
    </Box>
  )
}

export default TableUsers
