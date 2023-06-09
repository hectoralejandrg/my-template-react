import { Checkbox, TableBody, TableCell, TableRow } from '@mui/material'
import { ColumnType } from './EnhancedTableHeadC'

type TableRowsProps<T, K extends keyof T> = {
  data: Array<T>
  columns: Array<ColumnType<T, K>>
  isSelected: (name: string) => boolean
  handleClick: (event: React.MouseEvent<unknown>, name: string) => void
}

const EnhancedTableRows = <T, K extends keyof T>({
  data,
  columns,
  isSelected,
  handleClick
}: TableRowsProps<T, K>) => {
  return (
    <TableBody>
      {data.map((row, index) => {
        // @ts-ignore
        const isItemSelected = isSelected(row[index].key.toString())
        const labelId = `enhanced-table-checkbox-${index}`
        return (
          <TableRow
            key={`row-${index}`}
            hover
            // @ts-ignore
            onClick={(event) => handleClick(event, row[index].key)}
            role="checkbox"
            aria-checked={isItemSelected}
            tabIndex={-1}
            selected={isItemSelected}
            sx={{ cursor: 'pointer' }}
          >
            {columns.map((column, index2) => {
              // @ts-ignore
              return row[column.type] === 'checkbox' ? (
                <TableCell padding="checkbox">
                  <Checkbox
                    color="primary"
                    checked={isItemSelected}
                    inputProps={{
                      'aria-labelledby': labelId
                    }}
                  />
                </TableCell>
              ) : (
                // @ts-ignore
                <TableCell key={`cell-${index2}`}>{row[column.key]}</TableCell>
              )
            })}
          </TableRow>
        )
      })}
    </TableBody>
  )
}

export default EnhancedTableRows
