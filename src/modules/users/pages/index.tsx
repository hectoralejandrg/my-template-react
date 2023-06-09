import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup
} from '@mui/material'
import TableUsers from '../components/TableUsers'
import ScreenWrapper from '../../shared/ScreenWrapper'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import ModalEnhanced from '../../shared/ModalEnhanced'
import { useState } from 'react'
import FormNewUser from '../components/FormNewUser'
import { useGetUsersQuery } from '../slice/usersApiSlice'

export type DataUsers = {
  id: string
  user: string
  email: string
  rol: string
  created_at: string
  status: string
}

const PageUsers = () => {
  const [open, setOpen] = useState(false)
  const handleChangeModal = () => {
    setOpen((prev) => !prev)
  }

  const { data } = useGetUsersQuery()
  console.log(data)
  return (
    <ScreenWrapper>
      <Box sx={{ marginBottom: 3 }}>
        <Grid container justifyContent={'space-between'}>
          <Grid item>
            <FormControl>
              <RadioGroup
                row
                aria-labelledby="demo-row-radio-buttons-group-label"
                name="row-radio-buttons-group"
              >
                <FormControlLabel
                  value="female"
                  control={<Radio />}
                  label="Todos"
                />
                <FormControlLabel
                  value="male"
                  control={<Radio />}
                  label="Activos"
                />
                <FormControlLabel
                  value="other"
                  control={<Radio />}
                  label="Inactivos"
                />
              </RadioGroup>
            </FormControl>
          </Grid>
          <Grid item>
            <Button
              type="submit"
              variant="contained"
              sx={{
                background:
                  'linear-gradient(90deg, #F49143 -21.52%, #F4BB43 104.43%)',
                boxShadow: 'none'
              }}
              startIcon={<PersonAddIcon />}
              onClick={handleChangeModal}
            >
              Nuevo usuario
            </Button>
          </Grid>
        </Grid>
      </Box>
      <TableUsers data={data?.data} />
      <ModalEnhanced
        title="Nuevo usuario"
        open={open}
        handleClose={handleChangeModal}
      >
        <FormNewUser />
      </ModalEnhanced>
    </ScreenWrapper>
  )
}

export default PageUsers
