import { Dialog, DialogContent, DialogTitle, IconButton } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'

interface ModalProps {
  title?: string
  open: boolean
  handleClose: () => void
  children?: string | JSX.Element | JSX.Element[]
}

const ModalEnhanced = ({ open, handleClose, title, children }: ModalProps) => {
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle id="alert-dialog-title">
        {title}
        {handleClose && (
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500]
            }}
          >
            <CloseIcon />
          </IconButton>
        )}
      </DialogTitle>
      <DialogContent>{children}</DialogContent>
    </Dialog>
  )
}

export default ModalEnhanced
