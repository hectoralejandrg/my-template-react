import { Switch } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useUpdateUserMutation } from '../slice/usersApiSlice'
import { Users } from '../interfaces/users.interface'

interface Props {
  user?: Users
}

const SwitchStatus = ({ user }: Props) => {
  const [checked, setChecked] = useState(user?.active)

  const [updateStatus] = useUpdateUserMutation()

  const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked)
    await updateStatus({ id: user?.id, active: event.target.checked })
  }

  useEffect(() => {
    setChecked(user?.active)
  }, [user])

  return (
    <Switch
      color="success"
      size="small"
      checked={checked}
      onChange={handleChange}
    />
  )
}

export default SwitchStatus
