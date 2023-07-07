import {
  // Checkbox,
  styled,
  TableCell,
  tableCellClasses,
  TableHead,
  TableRow
} from '@mui/material'
import { TableColumn } from './EnhancedTableRow'

export interface HeadCell {
  id: string
  label: string
}

interface EnhancedTableProps<T> {
  columns: TableColumn<T>[]
}

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: '#F3F2F7',
    color: '#718096',
    fontSize: 16
  }
}))

const EnhancedTableHead = <T extends Record<string, any>>({
  columns
}: EnhancedTableProps<T>) => {
  return (
    <TableHead>
      <TableRow>
        {columns.map((head, index) => (
          <StyledTableCell
            key={`${head.key.toString()}-${index}`}
            align={head.align}
            padding={head.disablePadding ? 'none' : 'normal'}
          >
            {head.title}
          </StyledTableCell>
        ))}
        <StyledTableCell align="center" width={25}>
          Acciones
        </StyledTableCell>
      </TableRow>
    </TableHead>
  )
}

export default EnhancedTableHead
