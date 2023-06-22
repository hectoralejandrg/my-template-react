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
  TableRow
} from '@mui/material'
import React, { useEffect, useState } from 'react'
import TableHeadDeliveries from './TableHeadDeliveries'
import TableToolbarDeliveries from './TableToolbarDeliveries'
import { DeliveriesResponse } from '../interfaces/deliveries.interfaces'
import TableRowsLoader from '../../shared/Table/TableRowsLoader'

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
    id: 'status',
    disablePadding: false,
    label: 'Status',
    align: 'left'
  },
  {
    id: 'destination',
    disablePadding: false,
    label: 'Comuna',
    align: 'left'
  }
  // {
  //   id: 'craetedAt',
  //   disablePadding: false,
  //   label: 'Fecha de creacion',
  //   align: 'left'
  // }
]

export interface Pagination {
  page: number
  limit: number
  sort?: string
}

interface Props {
  data?: DeliveriesResponse[]
  handleModalUpdate: () => void
  setSelected: React.Dispatch<React.SetStateAction<readonly string[]>>
  selected: readonly string[]
  isFetching: boolean
}

const TableDeliveries = ({
  data,
  selected,
  handleModalUpdate,
  setSelected,
  isFetching
}: Props) => {
  const [rows, setRows] = useState<DeliveriesResponse[]>(data || [])

  console.log('selected', selected)
  //   const [page, setPage] = useState(0)
  //   const [dense, setDense] = useState(false)
  //   const [rowsPerPage, setRowsPerPage] = useState(5)
  // const [pagination, setPagination] = useState<Pagination>({
  //   page: 0,
  //   limit: 20
  // })

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

  useEffect(() => {
    if (data) setRows(data)
  }, [data])

  //   const emptyRows =
  //     page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0
  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2, boxShadow: 'none' }}>
        <TableToolbarDeliveries numSelected={selected.length} handleModal={handleModalUpdate}/>
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
                  // rowsNum={pagination.limit}
                  rowsNum={10}
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
                        {row?.status?.name}
                      </StyledTableCell>
                      <StyledTableCell align="left">
                        {row?.destination?.level2}
                      </StyledTableCell>
                      {/* <StyledTableCell align="left">
                        {row?.ecommerce_id}
                      </StyledTableCell> */}
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

export default TableDeliveries
