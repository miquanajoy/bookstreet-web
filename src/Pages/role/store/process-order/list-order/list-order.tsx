import React, { useRef } from "react";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import {
  Dialog,
  DialogContent,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";
import useListOrderHook from "./useListOrderHook";
import CheckBillDialog from "../check-bill/check-bill";
import OrderDetail from "../order-info/order-info";
import { Role } from "../../../../../models/Role";

const ListOrder = (prop?) => {
  const user = JSON.parse(localStorage.getItem("userInfo"));

  const formatCurrency = (value: number | string) => {
    if (!value && value !== 0) return "";
    return Number(value).toLocaleString("vi-VN");
  };


  const {
    transactions,
    loading,
    error,
    setEmail,
    fromDate,
    setFromDate,
    toDate,
    setToDate,
    fetchTransactions,
    totalGroupColumns,
    getTransactionTypeLabel,
    openDialog,
    handleCloseCheckBill,
    openCheckBill,
    register,
    openOrderDetailDialog,
    handleCloseOrderDetail,
    openOrderDetail,
  } = useListOrderHook(user.user.role, prop);

  const searchInputRef = useRef<HTMLInputElement>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const inputEmail = searchInputRef.current?.value || "";
    setEmail(inputEmail);
    fetchTransactions({
      email: inputEmail,
      type: "default",
      fromDate: fromDate ? fromDate.format("YYYY-MM-DD") : undefined,
      toDate: toDate ? toDate.format("YYYY-MM-DD") : undefined,
    });
  };

  const handleClear = () => {
    if (searchInputRef.current) {
      searchInputRef.current.value = "";
      setEmail("");
      setFromDate(null);
      setToDate(null);
      fetchTransactions({ email: "" });
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="bg-gray-100 min-h-screen">
        <div className="mx-auto p-4 bg-white rounded-md">
          {prop.storeId && (
            <div className="text-sm text-gray-700">
              Số đơn hàng chưa thanh toán:{" "}
              <span className="font-medium">{transactions.length}</span>
            </div>
          )}

          {/* Search Bar */}
          {user.user.role !== Role.Manager ? (
            <div className="flex justify-between mb-4">
              <form
                onSubmit={handleSearch}
                className="flex items-center justify-between gap-4"
              >
                <div className="flex-grow flex items-center gap-4">
                  <div className="relative flex-grow">
                    <input
                      type="text"
                      placeholder="Tìm theo email"
                      className="w-full rounded-full py-2 px-8 pl-10 pr-10 border border-gray-400 focus:outline-none focus:border-blue-500"
                      defaultValue=""
                      ref={searchInputRef}
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <SearchIcon className="text-gray-500" />
                    </div>
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      <button type="button" onClick={handleClear}>
                        <ClearIcon className="text-gray-500 hover:text-gray-700" />
                      </button>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <DatePicker
                      label="Từ ngày"
                      value={fromDate}
                      onChange={(newValue: Dayjs | null) =>
                        setFromDate(newValue)
                      }
                      format="DD/MM/YYYY" // Định dạng hiển thị ngày/tháng/năm
                      slotProps={{ textField: { size: "small" } }}
                    />
                    <DatePicker
                      label="Đến ngày"
                      value={toDate}
                      onChange={(newValue: Dayjs | null) => setToDate(newValue)}
                      format="DD/MM/YYYY" // Định dạng hiển thị ngày/tháng/năm
                      slotProps={{ textField: { size: "small" } }}
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="bg-gray-800 hover:bg-gray-900 text-white font-bold py-2 px-4 rounded"
                >
                  Tìm kiếm
                </button>
              </form>
              <div>
                <button
                  type="button"
                  className="bg-gray-800 hover:bg-gray-900 text-white font-bold py-2 px-4 rounded"
                  onClick={openCheckBill}
                >
                  Kiểm tra thanh toán
                </button>
                <Dialog
                  open={openDialog}
                  maxWidth={"sm"}
                  fullWidth={true}
                  onClose={handleCloseCheckBill}
                  aria-labelledby="alert-dialog-title"
                  aria-describedby="alert-dialog-description"
                >
                  <DialogContent className="flex flex-col items-center">
                    <CheckBillDialog
                      onClose={handleCloseCheckBill}
                      emailFilter={searchInputRef.current?.value}
                      fetchTransactions={fetchTransactions}
                    />
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          ) : (
            <></>
          )}

          <div className="grid grid-cols-10 gap-4">
            {/* Table */}
            <div
              className={`${
                user.user.role !== Role.Manager ? "col-span-8" : "col-span-10"
              } border border-gray-400 rounded`}
            >
              {!loading && !error && (
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell>Mã đơn</TableCell>
                      <TableCell>Cửa hàng</TableCell>
                      <TableCell>Trạng thái</TableCell>
                      <TableCell>Tổng giá trị đơn hàng</TableCell>
                      <TableCell>Thời gian</TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {transactions.map((row) => (
                      <TableRow
                        key={row.storeOrderId}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell>{row.storeOrderId}</TableCell>
                        <TableCell>{row.storeName}</TableCell>
                        <TableCell>
                          {getTransactionTypeLabel(row.status)}
                        </TableCell>
                        <TableCell>{formatCurrency(row.subTotal)} vnđ</TableCell>
                        <TableCell>
                          {dayjs(new Date(row.createDate)).format(
                            "DD/MM/YYYY - HH:mm"
                          )}
                        </TableCell>
                        <TableCell>
                          <button
                            type="button"
                            className="bg-gray-800 hover:bg-gray-900 text-white font-bold py-2 px-4 rounded w-32"
                            onClick={() => openOrderDetail(row)}
                          >
                            {row.status === 2 ? "Chi tiết" : row.statusTxt}
                          </button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>

            {/* Filter Options */}
            {user.user.role !== Role.Manager ? (
  <div className="col-span-2 ml-2 flex items-start justify-center">
    <div className="flex flex-col">
      <h3 className="mb-2">Trạng thái</h3>
      <div className="flex flex-col pl-2 gap-1">
        <label className="inline-flex items-center">
          <input
            type="radio"
            className="form-radio h-5 w-5 text-blue-500"
            name="transactionType"
            value="all"
            {...register("transactionType")}
            onChange={() =>
              fetchTransactions({
                email: searchInputRef.current?.value || "",
                type: "Tất cả",
                fromDate: fromDate ? fromDate.format("YYYY-MM-DD") : undefined,
                toDate: toDate ? toDate.format("YYYY-MM-DD") : undefined,
              })
            }
          />
          <span className="ml-2 text-gray-700">Tất cả</span>
        </label>

        <label className="inline-flex items-center">
          <input
            type="radio"
            className="form-radio h-5 w-5 text-blue-500"
            name="transactionType"
            value="withdraw"
            onChange={() =>
              fetchTransactions({
                email: searchInputRef.current?.value || "",
                type: "Đã xử lý đơn hàng",
                fromDate: fromDate ? fromDate.format("YYYY-MM-DD") : undefined,
                toDate: toDate ? toDate.format("YYYY-MM-DD") : undefined,
              })
            }
          />
          <span className="ml-2 text-gray-700">Đã xử lý đơn hàng</span>
        </label>

        <label className="inline-flex items-center">
          <input
            type="radio"
            className="form-radio h-5 w-5 text-blue-500"
            name="transactionType"
            value="purchase"
            onChange={() =>
              fetchTransactions({
                email: searchInputRef.current?.value || "",
                type: "Đã thanh toán tại Kiosk",
                fromDate: fromDate ? fromDate.format("YYYY-MM-DD") : undefined,
                toDate: toDate ? toDate.format("YYYY-MM-DD") : undefined,
              })
            }
          />
          <span className="ml-2 text-gray-700">Đã thanh toán tại Kiosk</span>
        </label>

        {/* ✅ THÊM MỚI: Đơn hàng đã hủy */}
        <label className="inline-flex items-center">
          <input
            type="radio"
            className="form-radio h-5 w-5 text-blue-500"
            name="transactionType"
            value="cancel"
            onChange={() =>
              fetchTransactions({
                email: searchInputRef.current?.value || "",
                type: "Đơn hàng đã hủy",
                fromDate: fromDate ? fromDate.format("YYYY-MM-DD") : undefined,
                toDate: toDate ? toDate.format("YYYY-MM-DD") : undefined,
              })
            }
          />
          <span className="ml-2 text-gray-700">Đơn hàng đã hủy</span>
        </label>
      </div>
    </div>
  </div>
) : null}

            {/* Order detail */}
            <Dialog
              open={openOrderDetailDialog}
              maxWidth={"sm"}
              fullWidth={true}
              onClose={handleCloseOrderDetail}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogContent className="flex flex-col items-center">
                <OrderDetail
                  orderDetail={openOrderDetailDialog}
                  handleClose={handleCloseOrderDetail}
                  fetchTransactions={fetchTransactions}
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </LocalizationProvider>
  );
};

export default ListOrder;
