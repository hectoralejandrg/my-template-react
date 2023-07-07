import { Box, Paper, Table, TableBody, TableContainer, TablePagination } from '@mui/material'
import { ReactNode } from 'react'
import EnhancedTableRow, { TableColumn } from './EnhancedTableRow'
import EnhancedTableHead from './EnhancedTableHead'
import TableRowsLoader from './TableRowsLoader'

export interface Pagination {
  page: number
  perPage: number
}

interface TableProps<T> {
  data?: T[]
  columns: TableColumn<T>[]
  isFetching: boolean
  pagination: Pagination
  count?: number
  rowsPerPageOptions: number[]
  setPagination: React.Dispatch<React.SetStateAction<Pagination>>
  actionsColumn?: (data: T) => ReactNode
}

const EnhancedTable = <T extends Record<string, any>>({
  data,
  columns,
  isFetching,
  pagination,
  count,
  rowsPerPageOptions,
  setPagination,
  actionsColumn
}: TableProps<T>) => {
  // const [selected, setSelected] = useState<readonly string[]>([])
  //   const [page, setPage] = useState(0)
  //   const [dense, setDense] = useState(false)
  //   const [rowsPerPage, setRowsPerPage] = useState(5)

  // const handleSelectAllClick = (
  //   event: React.ChangeEvent<HTMLInputElement>,
  //   index: number
  // ) => {
  //   if (event.target.checked) {
  //     // @ts-ignore
  //     const newSelected = rows.map((n: T) => n.id)
  //     setSelected(newSelected)
  //     return
  //   }
  //   setSelected([])
  // }

  // const handleClick = (event: React.MouseEvent<unknown>, name: string) => {
  //   const selectedIndex = selected.indexOf(name)
  //   let newSelected: readonly string[] = []

  //   if (selectedIndex === -1) {
  //     newSelected = newSelected.concat(selected, name)
  //   } else if (selectedIndex === 0) {
  //     newSelected = newSelected.concat(selected.slice(1))
  //   } else if (selectedIndex === selected.length - 1) {
  //     newSelected = newSelected.concat(selected.slice(0, -1))
  //   } else if (selectedIndex > 0) {
  //     newSelected = newSelected.concat(
  //       selected.slice(0, selectedIndex),
  //       selected.slice(selectedIndex + 1)
  //     )
  //   }

  //   setSelected(newSelected)
  // }

  // const isSelected = (name: string) => selected.indexOf(name) !== -1

  //   const emptyRows =
  //     page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0
  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2, boxShadow: 'none' }}>
        {/* <EnhancedTableToolbar numSelected={selected.length} /> */}
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size="medium"
          >
            <EnhancedTableHead columns={columns} />
            <TableBody>
              {isFetching ? (
                <TableRowsLoader rowsNum={10} headNum={columns.length + 1} />
              ) : (
                data?.map((row, index) => {
                  // const isItemSelected = isSelected(row.name)
                  // const labelId = `enhanced-table-checkbox-${index}`

                  return (
                    <EnhancedTableRow<T>
                      key={row.id.toString()}
                      data={row}
                      columns={columns}
                      actionsColumn={actionsColumn}
                      // hover
                      // onClick={(event) => handleClick(event, row.name)}
                      // role="checkbox"
                      // aria-checked={isItemSelected}
                      // tabIndex={-1}
                      // selected={isItemSelected}
                      // sx={{ cursor: 'pointer' }}
                    />
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
        {data && count && (
          <TablePagination
            component="div"
            rowsPerPageOptions={rowsPerPageOptions}
            count={count}
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
            labelDisplayedRows={({ from, to, count }) =>
              `${from}-${to} de ${count}`
            }
          />
        )}
      </Paper>
    </Box>
  )
}

export default EnhancedTable
