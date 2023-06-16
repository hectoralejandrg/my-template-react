import {
  Skeleton,
  TableCell,
  TableRow,
  styled,
  tableCellClasses
} from '@mui/material'

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14
  }
}))

const StyledTableRow = styled(TableRow)(({ theme }) => ({
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
interface Props {
  rowsNum: number
  headNum: number
}
const TableRowsLoader = ({ rowsNum, headNum }: Props) => {
  return (
    <>
      {[...Array(rowsNum)].map((_, index) => (
        <StyledTableRow hover key={`row-${index}`}>
          {[...Array(headNum)].map((_, index) => (
            <StyledTableCell align="center" key={`cell-${index}`}>
              <Skeleton animation="wave" variant="text" />
            </StyledTableCell>
          ))}
        </StyledTableRow>
      ))}
    </>
  )
}

export default TableRowsLoader
