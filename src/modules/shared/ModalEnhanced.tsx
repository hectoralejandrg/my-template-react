import {
  Dialog,
  DialogProps,
  DialogTitle,
  IconButton
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'

interface ModalProps {
  title?: string
  open: boolean
  handleClose: () => void
  children?: string | JSX.Element | JSX.Element[]
}

type ModalCustomProps = DialogProps & ModalProps

const ModalEnhanced = ({ open, handleClose, title, children, ...props }: ModalCustomProps) => {
  return (
    <Dialog open={open} onClose={handleClose} {...props}>
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
      {children}
    </Dialog>
  )
}

export default ModalEnhanced
