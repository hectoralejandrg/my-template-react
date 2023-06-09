import { Dialog, DialogContent, DialogTitle } from '@mui/material'

interface ModalProps {
  open: boolean
  handleClose: () => void
  children?: string | JSX.Element | JSX.Element[]
}

const ModalSummaries = ({ open, handleClose, children }: ModalProps) => {
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle id="alert-dialog-title">Cambiar estados</DialogTitle>
      <DialogContent>
        {children}
      </DialogContent>
    </Dialog>
  )
}

export default ModalSummaries
