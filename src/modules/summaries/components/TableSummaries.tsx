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
import EnhancedTableHead, { HeadCell } from '../../shared/Table/EnhancedTableHead'
import EnhancedTableToolbar from '../../shared/Table/EnhancedTableToolbar'
import { Pagination, Summaries, SummariesResponse } from '../interfaces/summaries.interface'

interface Props {
  data?: SummariesResponse
  pagination: Pagination
  selected: readonly string[]
  setPagination: React.Dispatch<React.SetStateAction<Pagination>>
  handleModal?: () => void
  setSelected: React.Dispatch<React.SetStateAction<readonly string[]>>
}

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
    disablePadding: true,
    label: 'ID del manifiesto',
    align: 'left'
  },
  {
    id: 'carrier',
    disablePadding: false,
    label: 'Carrier',
    align: 'left'
  },
  {
    id: 'evidence',
    disablePadding: false,
    label: 'Evidencia',
    align: 'left'
  },
  {
    id: 'truck_id',
    disablePadding: false,
    label: 'Truck ID',
    align: 'left'
  },
  {
    id: 'craeted_at',
    disablePadding: false,
    label: 'Fecha de creacion',
    align: 'left'
  }
]

const TableSummaries = ({ data, pagination, selected, setPagination, handleModal, setSelected }: Props) => {
  const [rows, setRows] = useState<Summaries[]>(data?.data || [])

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = rows.map((n) => n.id.toString())
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
    if (data) setRows(data.data)
  }, [data])

  //   const emptyRows =
  //     page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0
  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2, boxShadow: 'none' }}>
        <EnhancedTableToolbar numSelected={selected.length} handleModal={handleModal}/>
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size="medium"
          >
            <EnhancedTableHead
              headCells={headCell}
              numSelected={selected.length}
              onSelectAllClick={handleSelectAllClick}
              rowCount={rows.length}
            />
            <TableBody>
              {rows.map((row, index) => {
                const isItemSelected = isSelected(row?.id.toString())
                const labelId = `enhanced-table-checkbox-${index}`

                return (
                  <StyledTableRow
                    hover
                    onClick={(event) => handleClick(event, row?.id.toString())}
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
                      {row?.id}
                    </StyledTableCell>
                    <StyledTableCell align="left">
                      {row?.carrier?.name}
                    </StyledTableCell>
                    <StyledTableCell align="left">
                      {row?.evidence}
                    </StyledTableCell>
                    <StyledTableCell align="left">
                      {row?.truck_id}
                    </StyledTableCell>
                    <StyledTableCell align="left">
                      {row?.created_at}
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
        <TablePagination
          component="div"
          rowsPerPageOptions={[10, 20, 30, 40, 50]}
          count={data?.lastpage ?? 0}
          page={pagination.page}
          rowsPerPage={pagination.limit}
          onPageChange={(_, page) =>
            setPagination((prev) => ({ ...prev, page }))
          }
          onRowsPerPageChange={(e) => {
            setPagination({ page: 0, limit: parseInt(e.target.value) })
          }}
        />
      </Paper>
    </Box>
  )
}

export default TableSummaries
