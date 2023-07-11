import {
  Box,
  Paper,
  Table,
  TableBody,
  TableContainer,
  TablePagination
} from '@mui/material'
import { ReactNode, useEffect, useState } from 'react'
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
  pagination?: Pagination
  count?: number
  rowsPerPageOptions?: number[]
  showCheckbox?: boolean
  showActions?: boolean
  setPagination?: React.Dispatch<React.SetStateAction<Pagination>>
  actionsColumn?: (data: T) => ReactNode
  actionsToolbar?: (items: T[]) => ReactNode
}

const EnhancedTable = <T extends Record<string, any>>({
  data,
  columns,
  isFetching,
  pagination,
  count,
  rowsPerPageOptions,
  showCheckbox = false,
  showActions = false,
  setPagination,
  actionsColumn,
  actionsToolbar
}: TableProps<T>) => {
  const [selectedItems, setSelectedItems] = useState<T[]>([])
  const [selectAllChecked, setSelectAllChecked] = useState(false)
  const [indeterminate, setIndeterminate] = useState(false)

  const handleSelectRow = (item: T, checked: boolean) => {
    if (checked) {
      setSelectedItems((prevSelectedItems) => [...prevSelectedItems, item])
    } else {
      setSelectedItems((prevSelectedItems) =>
        prevSelectedItems.filter((selectedItem) => selectedItem !== item)
      )
    }
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked && data) {
      setSelectedItems(data)
    } else {
      setSelectedItems([])
    }
    setSelectAllChecked(checked)
  }

  useEffect(() => {
    if (selectedItems.length === 0) {
      setSelectAllChecked(false)
      setIndeterminate(false)
    } else if (selectedItems.length === data?.length) {
      setSelectAllChecked(true)
      setIndeterminate(false)
    } else {
      setIndeterminate(true)
    }
  }, [selectedItems, data])

  const getHeadNum = () => {
    let count = 0
    if (showActions) count += 1
    if (showCheckbox) count += 1
    return columns.length + count
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2, boxShadow: 'none' }}>
        {actionsToolbar && <>{actionsToolbar(selectedItems)}</>}
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size="medium"
          >
            <EnhancedTableHead
              columns={columns}
              selectAllChecked={selectAllChecked}
              onSelectAll={handleSelectAll}
              showCheckbox={showCheckbox}
              showActions={showActions}
              indeterminate={indeterminate}
            />
            <TableBody>
              {isFetching ? (
                <TableRowsLoader rowsNum={10} headNum={getHeadNum()} />
              ) : (
                data?.map((row, index) => {
                  return (
                    <EnhancedTableRow<T>
                      key={row.id.toString()}
                      data={row}
                      columns={columns}
                      actionsColumn={actionsColumn}
                      showCheckbox={showCheckbox}
                      onSelectRow={handleSelectRow}
                      selectedItems={selectedItems}
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
        {data && count && pagination && setPagination && (
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
