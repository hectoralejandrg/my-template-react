import {
  Checkbox,
  // Checkbox,
  styled,
  TableCell,
  tableCellClasses,
  TableHead,
  TableRow
} from '@mui/material'
import { TableColumn } from './EnhancedTableRow'

// export interface HeadCell {
//   id: string
//   label: string
// }

interface EnhancedTableProps<T> {
  columns: TableColumn<T>[]
  showCheckbox: boolean
  showActions: boolean
  selectAllChecked: boolean
  indeterminate: boolean
  onSelectAll: (checked: boolean) => void
}

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: '#F3F2F7',
    color: '#718096',
    fontSize: 16
  }
}))

const EnhancedTableHead = <T extends Record<string, any>>({
  columns,
  showCheckbox,
  onSelectAll,
  indeterminate,
  showActions,
  selectAllChecked
}: EnhancedTableProps<T>) => {
  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    const checked = event.target.checked
    onSelectAll(checked)
  }
  return (
    <TableHead>
      <TableRow>
        {showCheckbox && (
          <StyledTableCell padding="checkbox" width={5}>
            <Checkbox
              color="primary"
              indeterminate={indeterminate}
              checked={selectAllChecked}
              onChange={handleSelectAll}
              sx={{
                '&.Mui-checked': {
                  color: '#F4BB43'
                }
              }}
            />
          </StyledTableCell>
        )}
        {columns.map((head, index) => (
          <StyledTableCell
            key={`${head.key.toString()}-${index}`}
            align={head.align}
            padding={head.disablePadding ? 'none' : 'normal'}
            width={head?.width}
          >
            {head?.title}
          </StyledTableCell>
        ))}
        {showActions && (
          <StyledTableCell align="center" width={25}>
            Acciones
          </StyledTableCell>
        )}
      </TableRow>
    </TableHead>
  )
}

export default EnhancedTableHead
