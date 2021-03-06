/* eslint-disable no-unused-vars */
import React, { useCallback, useEffect, useState } from 'react'
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import { useHistory } from "react-router-dom";
const DialogContext = React.createContext();
const UDialog = ({ dialog, unSetDialog }) => {
  const [open, setOpen] = React.useState(true);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const { title, content, contentStyle, button } = dialog;
  const redirect = useHistory();
  const handleClose = (routePath) => {
    setOpen(false);
    if (typeof routePath !== 'undefined' && routePath != null && routePath !== '') {
      redirect.push(routePath);
    }
  };
  return (
    <Dialog
      fullScreen={fullScreen}
      maxWidth='md'
      open={open}
      onClose={handleClose}
      aria-labelledby="responsive-dialog-title"
    >
      <DialogTitle id="responsive-dialog-title">{title}</DialogTitle>
      <DialogContent style={contentStyle}>
        <DialogContentText style={{ color: contentStyle.color }}>{content}</DialogContentText>
      </DialogContent>
      <DialogActions>
        {(button.cancel.enable) && (
          <Button onClick={() => { handleClose(button.cancel.redirect); }} color="primary" autoFocus>
            {button.cancel.text}
          </Button>
        )}
        {(button.confirm.enable) && (
          <Button onClick={handleClose} color="primary" autoFocus>
            {button.confirm.text}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
const DialogProvider = props => {
  const [dialog, setDialog] = useState();
  const unSetDialog = useCallback(() => {
    setDialog();
  }, [setDialog])

  return (
    <DialogContext.Provider value={{ unSetDialog, setDialog }} {...props} >
      {props.children}
      {dialog && <UDialog dialog={dialog} unSetDialog={unSetDialog} />}
    </DialogContext.Provider>
  )
}
const useDialog = () => {
  const context = React.useContext(DialogContext)
  if (context === undefined) {
    throw new Error('useDialog must be used within a UserProvider')
  }
  return context
}

const ModalContext = React.createContext();
const Modal = ({ modal, unSetModal }) => {
  useEffect(() => {
    const bind = e => {
      if (e.keyCode !== 27) {
        return
      }

      if (document.activeElement && ['INPUT', 'SELECT'].includes(document.activeElement.tagName)) {
        return
      }

      unSetModal()
    }

    document.addEventListener('keyup', bind)
    return () => document.removeEventListener('keyup', bind)
  }, [modal, unSetModal])

  return (
    <div className="modal">
      <button className="modal__close" onClick={unSetModal} />
      <div className="modal__inner">
        <button className="modal__close-btn" onClick={unSetModal}>
          <svg height="20" width="20" viewBox="0 0 20 20" aria-hidden="true" focusable="false">
            <path d="M14.348 14.849c-0.469 0.469-1.229 0.469-1.697 0l-2.651-3.030-2.651 3.029c-0.469 0.469-1.229 0.469-1.697 0-0.469-0.469-0.469-1.229 0-1.697l2.758-3.15-2.759-3.152c-0.469-0.469-0.469-1.228 0-1.697s1.228-0.469 1.697 0l2.652 3.031 2.651-3.031c0.469-0.469 1.228-0.469 1.697 0s0.469 1.229 0 1.697l-2.758 3.152 2.758 3.15c0.469 0.469 0.469 1.229 0 1.698z"></path>
          </svg>
        </button>
        {modal}
      </div>
    </div>
  )
}
const ModalProvider = props => {
  const [modal, setModal] = useState()
  const unSetModal = useCallback(() => {
    setModal()
  }, [setModal])

  return (
    <ModalContext.Provider value={{ unSetModal, setModal }} {...props} >
      {props.children}
      {modal && <Modal modal={modal} unSetModal={unSetModal} />}
    </ModalContext.Provider>
  )
}
const useModal = () => {
  const context = React.useContext(ModalContext)
  if (context === undefined) {
    throw new Error('useModal must be used within a UserProvider')
  }

  return context
}

export { ModalProvider, useModal, DialogProvider, useDialog }