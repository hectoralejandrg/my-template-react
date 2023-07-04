import {
  Box,
  Checkbox,
  Paper,
  styled,
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableContainer,
  TablePagination,
  TableRow
} from '@mui/material'
import React, { useEffect, useState } from 'react'
import TableHeadDeliveries from './TableHeadDeliveries'
import TableToolbarDeliveries from './TableToolbarDeliveries'
import {
  Deliveries,
  DeliveriesResponse
} from '../interfaces/deliveries.interfaces'
import TableRowsLoader from '../../shared/Table/TableRowsLoader'
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

export interface HeadCell {
  disablePadding: boolean
  id: string
  label: string
  align: 'left' | 'center' | 'right' | 'justify' | 'inherit' | undefined
}

const headCell: HeadCell[] = [
  {
    id: 'id',
    disablePadding: true,
    label: 'Referencia del envío',
    align: 'left'
  },
  {
    id: 'tracking_number',
    disablePadding: false,
    label: 'Número de tracking',
    align: 'left'
  },
  {
    id: 'destination',
    disablePadding: false,
    label: 'Comuna',
    align: 'left'
  },
  {
    id: 'status',
    disablePadding: false,
    label: 'Estado',
    align: 'left'
  },
  {
    id: 'created_at',
    disablePadding: false,
    label: 'Fecha de creación',
    align: 'left'
  }
]

export interface Pagination {
  page: number
  perPage: number
  paginate: boolean
  sort: string
}

interface Props {
  data?: DeliveriesResponse
  handleModalUpdate: () => void
  setSelected: React.Dispatch<React.SetStateAction<readonly string[]>>
  selected: readonly string[]
  isFetching: boolean
  pagination: Pagination
  setPagination: React.Dispatch<React.SetStateAction<Pagination>>
  getValueToolbar: (value?: string) => void
}

const TableDeliveries = ({
  data,
  selected,
  handleModalUpdate,
  setSelected,
  isFetching,
  pagination,
  setPagination,
  getValueToolbar
}: Props) => {
  const [rows, setRows] = useState<Deliveries[]>(data?.data || [])

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = rows.map((n) => n.imported_id.toString())
      setSelected(newSelected)
      return
    }
    setSelected([])
  }

  const handleClick = (event: React.MouseEvent<unknown>, id: string) => {
    const selectedIndex = selected.indexOf(id)
    let newSelected: readonly string[] = []

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id)
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1))
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1))
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      )
    }

    setSelected(newSelected)
  }

  const isSelected = (id: string) => selected.indexOf(id) !== -1

  const handleValueToolbar = (value: string) => {
    if (value === 'all') getValueToolbar(undefined)
    else getValueToolbar(value)
  }

  useEffect(() => {
    if (data) {
      setRows(data?.data)
      setSelected([])
    }
  }, [data])

  //   const emptyRows =
  //     page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0
  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2, boxShadow: 'none' }}>
        <TableToolbarDeliveries
          numSelected={selected.length}
          handleModal={handleModalUpdate}
          handleValueToolbar={handleValueToolbar}
        />
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size="medium"
          >
            <TableHeadDeliveries
              headCells={headCell}
              numSelected={selected.length}
              onSelectAllClick={handleSelectAllClick}
              rowCount={rows.length}
            />
            <TableBody>
              {isFetching ? (
                <TableRowsLoader
                  rowsNum={pagination.perPage}
                  headNum={headCell.length + 1}
                />
              ) : (
                rows.map((row, index) => {
                  const isItemSelected = isSelected(row?.imported_id)
                  const labelId = `enhanced-table-checkbox-${index}`

                  return (
                    <StyledTableRow
                      hover
                      onClick={(event) => handleClick(event, row?.imported_id)}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row?.id}
                      selected={isItemSelected}
                      sx={{ cursor: 'pointer' }}
                    >
                      <StyledTableCell padding="checkbox">
                        <Checkbox
                          color="primary"
                          checked={isItemSelected}
                          inputProps={{
                            'aria-labelledby': labelId
                          }}
                          sx={{
                            '&.Mui-checked': {
                              color: '#F4BB43'
                            }
                          }}
                        />
                      </StyledTableCell>
                      <StyledTableCell
                        component="th"
                        id={labelId}
                        scope="row"
                        padding="none"
                      >
                        {row?.imported_id}
                      </StyledTableCell>
                      <StyledTableCell align="left">
                        {row?.tracking_number}
                      </StyledTableCell>
                      <StyledTableCell align="left">
                        {row?.destination?.level2}
                      </StyledTableCell>
                      <StyledTableCell align="left">
                        {row?.status?.name}
                      </StyledTableCell>
                      <StyledTableCell align="left">
                      {dayjs(row?.created_at).format('DD-MM-YYYY HH:mm')}
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
        {data?.data && (
          <TablePagination
            component="div"
            rowsPerPageOptions={[10, 20, 30, 40, 50]}
            count={data.count}
            page={pagination.page}
            rowsPerPage={pagination.perPage}
            onPageChange={(_, page) =>
              setPagination((prev) => ({ ...prev, page }))
            }
            onRowsPerPageChange={(e) => {
              setPagination((prev) => ({
                ...prev,
                page: 0,
                perPage: parseInt(e.target.value)
              }))
            }}
            labelRowsPerPage={'Filas por página'}
            labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
          />
        )}
      </Paper>
    </Box>
  )
}

export default TableDeliveries
