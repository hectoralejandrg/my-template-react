import {
  Box,
  IconButton,
  Paper,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Tooltip,
  styled,
  tableCellClasses
} from '@mui/material'
import React, { useEffect, useState } from 'react'
import TableHeadUsers, { HeadCell } from './TableHeadUsers'
import { Pagination } from '../../deliveries/components/TableDeliveries'
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined'
import VpnKeyOutlinedIcon from '@mui/icons-material/VpnKeyOutlined'
import { Users } from '../interfaces/users.interface'
import dayjs from 'dayjs'

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

interface Props {
  data?: Users[]
  pagination?: Pagination
  selected?: readonly string[]
  setPagination?: React.Dispatch<React.SetStateAction<Pagination>>
  handleModal?: () => void
  setSelected?: React.Dispatch<React.SetStateAction<readonly string[]>>
}

const TableUsers = ({ data }: Props) => {
  //   const theme = useTheme()
  const [rows, setRows] = useState<Users[]>([])

  //   console.log('selected', selected)

  //   const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
  //     if (event.target.checked) {
  //       const newSelected = rows.map((n) => n.id.toString())
  //       setSelected(newSelected)
  //       return
  //     }
  //     setSelected([])
  //   }

  //   const handleClick = (event: React.MouseEvent<unknown>, id: string) => {
  //     const selectedIndex = selected.indexOf(id)
  //     let newSelected: readonly string[] = []

  //     if (selectedIndex === -1) {
  //       newSelected = newSelected.concat(selected, id)
  //     } else if (selectedIndex === 0) {
  //       newSelected = newSelected.concat(selected.slice(1))
  //     } else if (selectedIndex === selected.length - 1) {
  //       newSelected = newSelected.concat(selected.slice(0, -1))
  //     } else if (selectedIndex > 0) {
  //       newSelected = newSelected.concat(
  //         selected.slice(0, selectedIndex),
  //         selected.slice(selectedIndex + 1)
  //       )
  //     }

  //     setSelected(newSelected)
  //   }

  //   const isSelected = (id: string) => selected.indexOf(id) !== -1

  useEffect(() => {
    if (data) setRows(data)
  }, [data])

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2, boxShadow: 'none' }}>
        {/* <TableToolbarUsers numSelected={selected.length} /> */}
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size="medium"
          >
            <TableHeadUsers headCells={headCell} />
            <TableBody>
              {rows.map((row, index) => {
                // const isItemSelected = isSelected(row?.imported_id)
                // const labelId = `enhanced-table-checkbox-${index}`

                return (
                  <StyledTableRow
                    hover
                    // onClick={(event) => handleClick(event, row?.imported_id)}
                    // role="checkbox"
                    // aria-checked={isItemSelected}
                    // tabIndex={-1}
                    key={`${row?.id}-${index}`}
                    // selected={isItemSelected}
                    // sx={{ cursor: 'pointer' }}
                  >
                    <StyledTableCell align="center">{row?.id}</StyledTableCell>
                    <StyledTableCell align="left">{row?.name}</StyledTableCell>
                    <StyledTableCell align="left">{row?.email}</StyledTableCell>
                    <StyledTableCell align="left">{row?.role?.name}</StyledTableCell>
                    <StyledTableCell align="left">
                      {dayjs(row?.created_at).format('DD-MM-YYYY HH:mm')}
                    </StyledTableCell>
                    <StyledTableCell align="left">
                      <Switch defaultChecked color="success" />
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <Tooltip title="Editar usuario" arrow>
                        <IconButton
                          color="inherit"
                          size="small"
                          onClick={() => console.log('click')}
                        >
                          <CreateOutlinedIcon
                            fontSize="small"
                            sx={{ color: '#1B8ACE' }}
                          />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Cambiar contrasena" arrow>
                        <IconButton
                          color="inherit"
                          size="small"
                          onClick={() => console.log('click')}
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
              })}
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
        {/* <TablePagination
          component="div"
          rowsPerPageOptions={[20, 30, 40, 50]}
          count={data?.lastpage ?? 0}
          page={pagination.page}
          rowsPerPage={pagination.limit}
          onPageChange={(_, page) =>
            setPagination((prev) => ({ ...prev, page }))
          }
          onRowsPerPageChange={(e) => {
            setPagination({ page: 0, limit: parseInt(e.target.value) })
          }}
        /> */}
      </Paper>
    </Box>
  )
}

export default TableUsers
