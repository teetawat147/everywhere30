import React from "react";
import {
  Button,
  DialogTitle,
  DialogContent,
  DialogActions
} from "@material-ui/core";
import { useDialog } from "./DialogProvider";

const CustomDialog = (props: any) => {
  const [openDialog, closeDialog] = useDialog();
  const handlerClick = () => {
    props.onClick();
    closeDialog();
  }
  // const onOpenDialog = () => {
  openDialog({
    children: (
      <>
        <DialogTitle style={{ padding: '30px 24px 0 24px' }}>{props.title}</DialogTitle>
        <DialogContent style={{ width: props.contentWidth, padding: '24px', textAlign: 'center' }}>{props.content}</DialogContent>
        <DialogActions style={{ padding: '0 24px 24px 24px' }}>
          <Button color="primary" onClick={handlerClick}>ปิด</Button>
        </DialogActions>
      </>
    )
  });
  return (<></>);
  // };
}
export default CustomDialog;
