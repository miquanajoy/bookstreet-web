import {
  Dialog,
  DialogContent,
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableRow,
} from "@mui/material";
import useOrderInfo from "./useOrderInfoHook";
import ConfirmOrder from "./handleOrder/handle-order";
import dayjs from "dayjs";

export default function OrderDetail({
  orderDetail,
  handleClose,
  fetchTransactions,
}) {
  const {
    openDialogInfo,
    handleConfirmOpen,
    handleConfirmClose,
    orders,
    totalOrder,
  } = useOrderInfo(orderDetail, handleClose);

  return !openDialogInfo ? (
    <div className="rounded-lg w-full border border-gray-200">
      {/* Header Section */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <button
          className="flex items-center text-gray-700 hover:text-black"
          onClick={handleClose}
        >
          <span className="text-xl mr-2">←</span> Quay lại
        </button>
        <h2 className="text-lg font-semibold text-gray-800 m-0">
          Thông tin đơn hàng
        </h2>
        {/* Placeholder for alignment, can be removed if title should be centered */}
        <div className="w-16"></div>
      </div>
      <div className="p-4 pb-0">
        <div className="text-sm text-gray-700 mb-1">
          Mã đơn: {orderDetail.storeOrderId}
        </div>
        <div className="text-sm text-gray-700 mb-1">
          Khách hàng: {orderDetail.customerName}
        </div>
        <div className="text-sm text-gray-700 mb-1">
          Thời gian: {dayjs(new Date(orderDetail.createDate)).format("DD/MM/YYYY - HH:mm")}
        </div>
        <div className="text-sm text-gray-700">
          Trạng thái: {orderDetail.subTotal} VNĐ
        </div>
      </div>
      {/* Main Content Area (Order List) */}
      <div className="p-4">
        <div className="h-64 overflow-y-scroll">
          <Table aria-label="simple table" stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Tên sản phẩm</TableCell>
                <TableCell className="w-24">Số lượng</TableCell>
                <TableCell className="w-32">Giá</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order) => (
                <TableRow
                  key={order.productId}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell>{order.productName}</TableCell>
                  <TableCell className="w-24">x{order.quantity}</TableCell>
                  <TableCell>{order.price} VNĐ</TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableCell className="!border-b-0 border-t">Tổng</TableCell>
              <TableCell className="!border-b-0 border-t">
                <div className="text-neutral-900 text-sm">
                  x{totalOrder.quantity}
                </div>
              </TableCell>
              <TableCell className="!border-b-0 border-t">
                <div className="text-neutral-900 text-sm">
                  {totalOrder.price} VNĐ
                </div>
              </TableCell>
            </TableFooter>
          </Table>
        </div>
        {orderDetail.status == 1 ? (
          <button
            type="submit"
            className="bg-gray-800 hover:bg-gray-900 text-white font-bold py-2 px-4 rounded mx-auto d-block"
            onClick={handleConfirmOpen}
          >
            Hoàn tất đơn
          </button>
        ) : (
          <></>
        )}
      </div>
    </div>
  ) : (
    <>
      <ConfirmOrder
        orderDetail={orderDetail}
        handleClose={handleClose}
        handleConfirmClose={handleConfirmClose}
        fetchTransactions={fetchTransactions}
      />
    </>
  );
}
