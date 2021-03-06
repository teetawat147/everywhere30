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
    unSetDialog();
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

export { DialogProvider, useDialog }