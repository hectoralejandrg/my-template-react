import {
  // Checkbox,
  styled,
  TableCell,
  tableCellClasses,
  TableHead,
  TableRow
} from '@mui/material'

// export interface HeadCell {
//   disablePadding: boolean
//   id: string
//   label: string
//   align: 'left' | 'center' | 'right' | 'justify' | 'inherit' | undefined
// }
export type ColumnType<T, K extends keyof T> = {
  key: K
  checkbox?: boolean
  label: string
  disablePadding: boolean
  align: 'left' | 'center' | 'right' | 'justify' | 'inherit' | undefined
}

type EnhancedTableProps<T, K extends keyof T> = {
  numSelected: number
  onSelectAllClick: (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => void
  rowCount: number
  headCells: Array<ColumnType<T, K>>
}

// interface EnhancedTableProps {
//   numSelected: number
//   onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void
//   rowCount: number
//   headCells: Array<HeadCell<T, K>>
// }

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: '#F3F2F7',
    color: '#718096',
    fontSize: 16
  }
}))

const EnhancedTableHead = <T, K extends keyof T>({
  onSelectAllClick,
  numSelected,
  rowCount,
  headCells
}: EnhancedTableProps<T, K>) => {
  console.log('hc', headCells)
  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell, index) => {
          return (
            // <>
            //   {headCell?.checkbox || (
            //     <StyledTableCell
            //       padding="checkbox"
            //       key={`headCellCheckbox-${headCell.label}-${index}`}
            //     >
            //       <Checkbox
            //         color="primary"
            //         indeterminate={numSelected > 0 && numSelected < rowCount}
            //         checked={rowCount > 0 && numSelected === rowCount}
            //         onChange={(e) => onSelectAllClick(e, index)}
            //         inputProps={{
            //           'aria-label': 'select all desserts'
            //         }}
            //         sx={{
            //           pr: 3,
            //           '&.Mui-checked': {
            //             color: '#F4BB43'
            //           }
            //         }}
            //       />
            //     </StyledTableCell>
            //   )}
            // </>
            <StyledTableCell
              key={`headCell-${headCell.label}-${index}`}
              align={headCell.align}
              padding={headCell.disablePadding ? 'none' : 'normal'}
            >
              {headCell.label}
            </StyledTableCell>
          )
        })}
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
      </TableRow>
    </TableHead>
  )
}

export default EnhancedTableHead
