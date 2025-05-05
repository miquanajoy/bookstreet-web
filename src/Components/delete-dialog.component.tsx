import { BehaviorSubject, ReplaySubject, Subject } from "rxjs";
import { loadingService } from "../_services/loading.service";
import { useEffect, useState } from "react";
import React from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { fetchWrapper } from "../_helpers/fetch-wrapper";
export const CONFIRMED_DELETE = "fetData";
export class DeleteService {
  $isDelete = new BehaviorSubject(null);
  $isReload = new Subject();

  showDeleteALert(url) {
    this.$isDelete.next(url);
    this.$isReload.next(false);
  }

  hiddenDeleteAlert() {
    this.$isDelete.next(null);
  }

}

export const deleteService = new DeleteService();

export default function DeleteDialog(prop) {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  function confirmDelete() {
    fetchWrapper.confirmedDelete(deleteService.$isDelete.value)
  }

useEffect(() => {
  deleteService.$isDelete.subscribe({
    next: (v) => {
      if(v) {
        handleClickOpen()
      } else {
        handleClose()
      }
    }
  })
}, [])
  if (deleteService.$isDelete.value) {
    return (
      <React.Fragment>
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"Xác nhận xóa?"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
            Bấm "Đồng ý" để xác nhận xóa
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Hủy</Button>
            <Button onClick={confirmDelete} autoFocus>
            Đồng ý
            </Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    );
  } else {
    return <></>;
  }
}
