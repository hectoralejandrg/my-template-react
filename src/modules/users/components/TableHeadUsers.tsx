import {
  styled,
  TableCell,
  tableCellClasses,
  TableHead,
  TableRow
} from '@mui/material'

export interface HeadCell {
  disablePadding: boolean
  id: string
  label: string
  align: 'left' | 'center' | 'right' | 'justify' | 'inherit' | undefined
}

interface EnhancedTableProps {
  numSelected?: number
  onSelectAllClick?: (event: React.ChangeEvent<HTMLInputElement>) => void
  rowCount?: number
  headCells: HeadCell[]
}

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: '#F3F2F7',
    color: '#718096',
    fontSize: 16
  }
}))

const TableHeadUsers = ({
  onSelectAllClick,
  numSelected,
  rowCount,
  headCells
}: EnhancedTableProps) => {
  return (
    <TableHead>
      <TableRow>
        {/* <StyledTableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              'aria-label': 'select all desserts'
            }}
            sx={{
              pr: 3,
              '&.Mui-checked': {
                color: '#F4BB43'
              }
            }}
          />
        </StyledTableCell> */}
        {headCells.map((headCell) => (
          <StyledTableCell
            key={headCell.id}
            align={headCell.align}
            padding={headCell.disablePadding ? 'none' : 'normal'}
          >
            {headCell.label}
          </StyledTableCell>
        ))}
      </TableRow>
    </TableHead>
  )
}

export default TableHeadUsers
