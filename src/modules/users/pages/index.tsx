import { Box, Button, Grid } from '@mui/material'
import TableUsers, { Pagination } from '../components/TableUsers'
import ScreenWrapper from '../../shared/ScreenWrapper'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import ModalEnhanced from '../../shared/ModalEnhanced'
import { useState } from 'react'
import FormNewUser from '../components/FormNewUser'
import { useGetUsersQuery } from '../slice/usersApiSlice'
import ComponentRecovery from '../components/ComponentRecovery'
import { Users } from '../interfaces/users.interface'
import FormUpdateUser from '../components/FormUpdateUser'
import { useAppSelector } from '../../../store/useRedux'

export type DataUsers = {
  id: string
  user: string
  email: string
  rol: string
  created_at: string
  status: string
}

const PageUsers = () => {
  const { profile } = useAppSelector((state) => state.auth)
  const [open, setOpen] = useState(false)
  const [edit, setEdit] = useState(false)
  const [openRecovery, setOpenRecovery] = useState(false)
  const [user, setUser] = useState<Users>()
  const [pagination, setPagination] = useState<Pagination>({
    page: 0,
    limit: 10,
    sort: 'DESC'
  })
  const handleChangeModal = () => {
    setOpen((prev) => !prev)
  }

  const handleChangeModalRecovery = (user?: Users) => {
    if (user) setUser(user)
    setOpenRecovery((prev) => !prev)
  }

  const handleChangeModalUpdate = () => {
    setEdit((prev) => !prev)
  }

  const { data, isFetching } = useGetUsersQuery({ ...pagination, company: profile?.companyId })
  return (
    <ScreenWrapper>
      <Box sx={{ marginBottom: 3 }}>
        <Grid container justifyContent={'space-between'}>
          <Grid item>
            {/* <FormControl>
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
            </FormControl> */}
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
      <TableUsers
        data={data}
        pagination={pagination}
        setPagination={setPagination}
        isFetching={isFetching}
        handleModal={handleChangeModalRecovery}
        handleModalUpdate={handleChangeModalUpdate}
      />
      <ModalEnhanced
        title="Nuevo usuario"
        open={open}
        handleClose={handleChangeModal}
      >
        <FormNewUser handleClose={handleChangeModal} />
      </ModalEnhanced>
      <ModalEnhanced
        title="Actualizar usuario"
        open={edit}
        handleClose={handleChangeModalUpdate}
      >
        <FormUpdateUser handleClose={handleChangeModalUpdate} />
      </ModalEnhanced>
      <ModalEnhanced
        title="Recuperación contraseña"
        open={openRecovery}
        handleClose={handleChangeModalRecovery}
        maxWidth="sm"
      >
        <ComponentRecovery
          user={user}
          handleClose={handleChangeModalRecovery}
        />
      </ModalEnhanced>
    </ScreenWrapper>
  )
}

export default PageUsers
