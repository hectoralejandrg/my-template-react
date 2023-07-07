import { TableCell, TableRow, styled, tableCellClasses } from '@mui/material'
import { ReactNode } from 'react'

export const StyledTableRow = styled(TableRow)(({ theme }) => ({
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

export const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14
  }
}))

export interface TableColumn<T> {
  key: keyof T
  title: string
  align?: 'left' | 'center' | 'right' | 'justify' | 'inherit' | undefined
  disablePadding?: boolean
  render: (data: T[keyof T]) => ReactNode
}

interface TableRowProps<T> {
  data: T
  columns: TableColumn<T>[]
  actionsColumn?: (data: T) => ReactNode
}

const EnhancedTableRow = <T extends Record<string, any>>({
  data,
  columns,
  actionsColumn
}: TableRowProps<T>) => {
  return (
    <StyledTableRow
      hover
      // @ts-ignore
      // onClick={(event) => handleClick(event, row[index].key)}
      role="checkbox"
      // aria-checked={isItemSelected}
      tabIndex={-1}
      // selected={isItemSelected}
      sx={{ cursor: 'pointer' }}
    >
      {columns.map((column) => {
        return (
          <StyledTableCell key={column.key.toString()}>
            {column.render(data[column.key])}
          </StyledTableCell>
        )
      })}
      {actionsColumn && <StyledTableCell align='center'>{actionsColumn(data)}</StyledTableCell>}
    </StyledTableRow>
  )
}

export default EnhancedTableRow
