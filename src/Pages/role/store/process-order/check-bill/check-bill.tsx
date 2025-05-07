import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import useCheckBillHook from "./useCheckBillHook";
import OrderDetail from "../order-info/order-info";

export default function CheckBillDialog({ emailFilter, onClose, fetchTransactions }) {
  const {
    openDialogInfo,
    handleCloseOrderInfo,
    openOrderInfo,
    register,
    watch,
    onchangeFilter,
    ordersFilter,
    totalOrder,
  } = useCheckBillHook(emailFilter);

  return (
    <div className="rounded-lg w-full border border-gray-200">
      {/* Header Section */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <button
          className="flex items-center text-gray-700 hover:text-black"
          onClick={onClose}
        >
          <span className="text-xl mr-2">←</span> Quay lại
        </button>
        <h2 className="text-lg font-semibold text-gray-800 m-0">
          Kiểm tra thanh toán
        </h2>
        <div className="w-16"></div>
      </div>
      <div className="p-4 pb-0">
        <div className="text-sm text-gray-700 mb-1">
          Tổng số đơn hàng: {totalOrder.total}
        </div>
        <div className="text-sm text-gray-700 mb-1">
          Đã thanh toán: {totalOrder.payment}
        </div>
        <div className="text-sm text-gray-700 mb-1">
        Chưa thanh toán cho cửa hàng: {totalOrder.notYetpayment}
        </div>
        <div className="text-sm text-gray-700">
        Tổng số tiền chưa được thanh toán: {totalOrder.totalPrice} VND
        </div>
      </div>
      {/* Main Content Area (Order List) */}
      <div className="p-4">
        {/* Filter Radio Buttons */}
        <div className="flex justify-end items-center mb-4 space-x-4">
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="radio"
              className="h-5 w-5 text-blue-500 focus:ring-blue-500"
              value="4"
              {...register("transactionType")}
              onChange={onchangeFilter}
            />
            <span className="ml-2 text-gray-700">Đã thanh toán</span>
          </label>
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="radio"
              className="h-5 w-5 text-blue-500 focus:ring-blue-500"
              value="3"
              {...register("transactionType")}
              onChange={onchangeFilter}
            />
            <span className="ml-2 text-gray-700">Chưa thanh toán</span>
          </label>
        </div>
        <div className="h-64 overflow-y-scroll">
          {ordersFilter.length ? (
            <Table aria-label="simple table" stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>Mã đơn</TableCell>
                  <TableCell colSpan={4}>Trạng thái thanh toán</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {ordersFilter.map((order) => (
                  <TableRow
                    key={order.storeOrderId}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell>{order.orderId}</TableCell>
                    <TableCell colSpan={4}>
                      {order.status === 4
                        ? "Đã thanh toán cho cửa hàng"
                        : "Chưa thanh toán cho cửa hàng"}
                    </TableCell>
                    <TableCell>
                      <button
                        type="button"
                        className="bg-gray-800 hover:bg-gray-900 text-white font-bold py-2 px-4 rounded"
                        onClick={() => openOrderInfo(order)}
                      >
                        Chi tiết
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center text-gray-500">
              Không có đơn hàng nào
            </div>
          )}
        </div>
      </div>
      {/* Footer Section */}
      <div className="p-4 border-t border-gray-200 mt-4">
        <div className="text-xs text-gray-600">
          Liên hệ
          <a
            href="mailto:manager@gmail.com"
            className="text-blue-600 hover:underline ml-1"
          >
            manager@gmail.com
          </a>
        </div>
        <div className="text-xs text-gray-600">
          để giải quyết nếu chưa nhận được thanh toán đơn hàng
        </div>
      </div>
      <Dialog
        open={!!openDialogInfo}
        maxWidth={"sm"}
        fullWidth={true}
        onClose={handleCloseOrderInfo}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent className="flex flex-col items-center">
          <OrderDetail
            fetchTransactions={fetchTransactions}
            orderDetail={openDialogInfo}
            handleClose={handleCloseOrderInfo}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}