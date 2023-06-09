import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectProps
} from '@mui/material'
import { keyStatus, useGetStatusesQuery } from '../tracking/slice/trackingApiSlice'

const styleLabelSelect = {
  'label + &': {
    marginTop: 3
  }
}

interface CustomProps {
  inputLabel: string
  keyStatus: keyStatus
}

type CustomPropsSelect = CustomProps & SelectProps

const StatusInput = ({ inputLabel, keyStatus, ...props }: CustomPropsSelect) => {
  const { data: statuses } = useGetStatusesQuery()
  return (
    <FormControl variant="standard" fullWidth>
      <InputLabel shrink sx={{ fontSize: 20 }}>
        {inputLabel}
      </InputLabel>
      <Select sx={styleLabelSelect} size="small" variant="outlined" {...props}>
        {statuses?.map((status) => (
          <MenuItem key={status?.id} value={status[keyStatus] as string | number}>
            {status?.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}

export default StatusInput
