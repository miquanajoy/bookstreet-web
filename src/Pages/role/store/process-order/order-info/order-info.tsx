import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  DialogContentText,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function OrderInfo({ open, handleClose }) {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogContent className="flex flex-col items-center">
        <DialogTitle
          id="alert-dialog-title"
          className="text-center font-bold text-2xl"
        >
          Order food

        </DialogTitle>
        <DialogContentText
          id="alert-dialog-description"
          className="text-center text-gray-700"
        >
          Are you sure you want to order these food?
          <br />
          This action cannot be undone.
        </DialogContentText>
      </DialogContent>
      <DialogActions className="justify-center p-4">
        <Button
          onClick={handleClose}
          className="cancel-btn"
        >
          No, go back
        </Button>
        
      </DialogActions>
    </Dialog>
  );
}
