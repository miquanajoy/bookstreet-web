import {
  Dialog,
  DialogContent,
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
    onchangeFilter,
    ordersFilter,
    totalOrder,
  } = useCheckBillHook(emailFilter);

  const formatCurrency = (value) =>
    value?.toLocaleString("vi-VN", { style: "currency", currency: "VND" });

  return (
    <div className="rounded-lg w-full border border-gray-200">
      {/* Header */}
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
        <div className="w-16" />
      </div>

      {/* Summary */}
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
          Tổng số tiền chưa được thanh toán:{" "}
          {formatCurrency(totalOrder.totalPrice)}
        </div>
      </div>

      {/* Filters */}
      <div className="p-4">
        <div className="flex justify-end items-center mb-4 space-x-4">
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="radio"
              className="h-5 w-5 text-blue-500"
              value="4"
              {...register("transactionType")}
              onChange={onchangeFilter}
            />
            <span className="ml-2 text-gray-700">Đã thanh toán</span>
          </label>
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="radio"
              className="h-5 w-5 text-blue-500"
              value="3"
              {...register("transactionType")}
              onChange={onchangeFilter}
            />
            <span className="ml-2 text-gray-700">Chưa thanh toán</span>
          </label>
        </div>

        {/* Orders Table */}
        <div className="h-64 overflow-y-scroll">
          {ordersFilter.length > 0 ? (
            <Table stickyHeader aria-label="orders table">
              <TableHead>
                <TableRow>
                  <TableCell>Mã đơn</TableCell>
                  <TableCell colSpan={4}>Trạng thái thanh toán</TableCell>
                  <TableCell />
                </TableRow>
              </TableHead>
              <TableBody>
                {ordersFilter.map((order) => (
                  <TableRow key={order.storeOrderId}>
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

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 mt-4">
        <div className="text-xs text-gray-600">
          Liên hệ
          <a
            href="mailto:manager@gmail.com"
            className="text-blue-600 hover:underline ml-1"
          >
            manager@gmail.com
          </a>{" "}
          để giải quyết nếu chưa nhận được thanh toán đơn hàng
        </div>
      </div>

      {/* Chi tiết đơn hàng */}
      <Dialog
        open={!!openDialogInfo}
        maxWidth="sm"
        fullWidth
        onClose={handleCloseOrderInfo}
      >
        <DialogContent>
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
