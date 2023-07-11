import {
  Checkbox,
  TableCell,
  TableRow,
  styled,
  tableCellClasses
} from '@mui/material'
import { ReactNode, useEffect, useState } from 'react'

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
  width?: string | number
  render: (data: T[keyof T]) => ReactNode
}

interface TableRowProps<T> {
  data: T
  columns: TableColumn<T>[]
  actionsColumn?: (data: T) => ReactNode
  showCheckbox: boolean
  onSelectRow?: (item: T, checked: boolean) => void
  selectedItems: T[]
}

const EnhancedTableRow = <T extends Record<string, any>>({
  data,
  columns,
  showCheckbox = false,
  onSelectRow,
  actionsColumn,
  selectedItems
}: TableRowProps<T>) => {
  const [checked, setChecked] = useState(false)
  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = event.target.checked
    setChecked(isChecked)
    if (onSelectRow) {
      onSelectRow(data, isChecked)
    }
  }

  useEffect(() => {
    setChecked(selectedItems.includes(data))
  }, [data, selectedItems])

  return (
    <StyledTableRow
      hover
      role="checkbox"
      tabIndex={-1}
      sx={{ cursor: 'pointer' }}
    >
      {showCheckbox && (
        <StyledTableCell padding="checkbox">
          <Checkbox
            color="primary"
            checked={checked}
            onChange={handleCheckboxChange}
            sx={{
              '&.Mui-checked': {
                color: '#F4BB43'
              }
            }}
          />
        </StyledTableCell>
      )}
      {columns.map((column) => {
        return (
          <StyledTableCell key={column.key.toString()} align={column.align}>
            {column.render(data[column.key])}
          </StyledTableCell>
        )
      })}
      {actionsColumn && (
        <StyledTableCell align="center">{actionsColumn(data)}</StyledTableCell>
      )}
    </StyledTableRow>
  )
}

export default EnhancedTableRow
