import {
  Box,
  Paper,
  Table,
  TableContainer
} from '@mui/material'
import React, { useState } from 'react'
import EnhancedTableToolbar from './EnhancedTableToolbar'
import EnhancedTableHead, { ColumnType } from './EnhancedTableHeadC'
// import EnhancedTableRows from './EnhancedTableRows'

// type ColumnType<T, K extends keyof T> = {
//   key: K
//   header: string
// }

type TableProps<T, K extends keyof T> = {
  rows: Array<T>
  columns: Array<ColumnType<T, K>>
}

const EnhancedTable = <T, K extends keyof T>({
  rows,
  columns
}: TableProps<T, K>) => {
  const [selected, setSelected] = useState<readonly string[]>([])
  //   const [page, setPage] = useState(0)
  //   const [dense, setDense] = useState(false)
  //   const [rowsPerPage, setRowsPerPage] = useState(5)

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
    if (event.target.checked) {
      // @ts-ignore
      const newSelected = rows.map((n: T) => n.id)
      setSelected(newSelected)
      return
    }
    setSelected([])
  }

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
      <Paper sx={{ width: '100%', mb: 2 }}>
        <EnhancedTableToolbar numSelected={selected.length} />
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size="medium"
          >
            <EnhancedTableHead
              headCells={columns}
              numSelected={selected.length}
              onSelectAllClick={handleSelectAllClick}
              rowCount={rows.length}
            />
            {/* <EnhancedTableRows
              data={rows}
              columns={columns}
              isSelected={isSelected}
              handleClick={handleClick}
            /> */}
            {/* <TableBody>
              {rows.map((row, index) => {
                const isItemSelected = isSelected(row.name)
                const labelId = `enhanced-table-checkbox-${index}`

                return (
                  <TableRow
                    hover
                    onClick={(event) => handleClick(event, row.name)}
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={row.name}
                    selected={isItemSelected}
                    sx={{ cursor: 'pointer' }}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        color="primary"
                        checked={isItemSelected}
                        inputProps={{
                          'aria-labelledby': labelId
                        }}
                      />
                    </TableCell>
                    <TableCell
                      component="th"
                      id={labelId}
                      scope="row"
                      padding="none"
                    >
                      {row.name}
                    </TableCell>
                    <TableCell align="right">{row.calories}</TableCell>
                    <TableCell align="right">{row.fat}</TableCell>
                    <TableCell align="right">{row.carbs}</TableCell>
                    <TableCell align="right">{row.protein}</TableCell>
                  </TableRow>
                )
              })} */}
            {/* {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: (dense ? 33 : 53) * emptyRows
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )} */}
            {/* </TableBody> */}
          </Table>
        </TableContainer>
        {/* <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        /> */}
      </Paper>
    </Box>
  )
}

export default EnhancedTable
