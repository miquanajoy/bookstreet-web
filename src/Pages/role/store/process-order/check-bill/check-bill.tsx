import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  DialogContentText,
  Button,
} from "@mui/material";
import useCheckBillHook from "./useCheckBillHook";
import OrderInfo from "../order-info/order-info";

export default function CheckBillDialog({ open, handleClose }) {
  const { openDialogInfo, handleCloseOrderInfo, openOrderInfo } =
    useCheckBillHook();
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
        <Button
          onClick={openOrderInfo}
          className="cancel-btn"
        >
          Fk
        </Button>
      </DialogActions>
      <OrderInfo open={openDialogInfo} handleClose={handleCloseOrderInfo} />
    </Dialog>
  );
}
