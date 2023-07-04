import {
  Button,
  // alpha,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Toolbar,
  Tooltip
} from '@mui/material'
import { useEffect, useState } from 'react'

interface EnhancedTableToolbarProps {
  numSelected: number
  handleModal?: () => void
  handleValueToolbar: (value: string) => void
}

const TableToolbarDeliveries = ({
  numSelected,
  handleModal,
  handleValueToolbar
}: EnhancedTableToolbarProps) => {
  const [selectedValue, setSelectedValue] = useState('all')

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedValue((event.target as HTMLInputElement).value)
  }

  useEffect(() => {
    handleValueToolbar(selectedValue)
  }, [selectedValue])

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 }
        //   ...(numSelected > 0 && {
        //     bgcolor: (theme) =>
        //       alpha(
        //         theme.palette.primary.main,
        //         theme.palette.action.activatedOpacity
        //       )
        //   })
      }}
    >
      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <Button
            variant="contained"
            sx={{
              mr: 1,
              background: '#F4BB43',
              boxShadow: 'none',
              '&:hover': {
                background: '#F4BB43',
                opacity: 0.9
              }
            }}
            onClick={handleModal}
          >
            Cambiar estados
          </Button>
        </Tooltip>
      ) : (
        <FormControl>
          <RadioGroup
            row
            aria-labelledby="demo-row-radio-buttons-group-label"
            name="row-radio-buttons-group"
            onChange={handleChange}
            value={selectedValue}
          >
            <FormControlLabel value={'all'} control={<Radio />} label="Todos" />
            <FormControlLabel value={'0'} control={<Radio />} label="Activos" />
            <FormControlLabel
              value={'1'}
              control={<Radio />}
              label="Archivados"
            />
          </RadioGroup>
        </FormControl>
      )}
    </Toolbar>
  )
}

export default TableToolbarDeliveries
