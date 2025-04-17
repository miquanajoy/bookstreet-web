import React, { useRef } from "react";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import dayjs from "dayjs";
import useListOrderHook from "./useListOrderHook";
import CheckBillDialog from "../check-bill/check-bill";

const ListOrder = () => {
  const {
    transactions,
    loading,
    error,
    email,
    setEmail,
    fetchTransactions,
    totalGroupColumns,
    getTransactionTypeLabel,
    openDialog,
    handleCloseCheckBill,
    openCheckBill
  } = useListOrderHook("thanhhoang@gmail.com");

  const searchInputRef = useRef<HTMLInputElement>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const inputEmail = searchInputRef.current?.value || "";
    setEmail(inputEmail);
    fetchTransactions({ email: inputEmail });
  };

  const handleClear = () => {
    if (searchInputRef.current) {
      searchInputRef.current.value = "";
      setEmail("");
      fetchTransactions({ email: "" });
    }
  };

  const handleResetFilter = () => {
    const currentEmail = searchInputRef.current?.value || "";
    fetchTransactions({ email: currentEmail });
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className=" mx-auto p-4 bg-white rounded-md ">
        {/* Search Bar */}
        <div className="d-flex justify-between mb-4">
          <form
            onSubmit={handleSearch}
            className="w-50 flex items-center justify-between gap-4"
          >
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="thanhhoang@gmail.com"
                className="w-full rounded-full py-2 px-8 pl-10 pr-10 border border-gray-400 focus:outline-none focus:border-blue-500"
                defaultValue="thanhhoang@gmail.com"
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
            <button
              type="submit"
              className="bg-gray-800 hover:bg-gray-900 text-white font-bold py-2 px-4 rounded"
            >
              Tìm kiếm
            </button>
          </form>
          <div className="col-span-1">
            <button
              type="submit"
              className="bg-gray-800 hover:bg-gray-900 text-white font-bold py-2 px-4 rounded"
              onClick={openCheckBill}
            >
              Kiểm tra thanh toán
            </button>
            <CheckBillDialog
            open={openDialog}
            handleClose={handleCloseCheckBill} />
          </div>
        </div>
        <div className="grid grid-cols-10 gap-4">
          {/* Table */}
          <div className="col-span-8 border border-gray-400 rounded">
            {!loading && !error && (
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Mã đơn</TableCell>
                    <TableCell>Khách hàng</TableCell>
                    <TableCell>Trạng thái</TableCell>
                    <TableCell>Tổng giá trị đơn hàng</TableCell>
                    <TableCell>Thời gian</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {transactions.map((row) => (
                    <TableRow
                      key={row.id}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell>{row.amount}</TableCell>
                      <TableCell>
                        {dayjs(row.transactionDate).format("YYYY-MM-DD HH:mm")}
                      </TableCell>
                      <TableCell>
                        {getTransactionTypeLabel(row.transactionType)}
                      </TableCell>
                      <TableCell>{row.storeName}</TableCell>
                      <TableCell>
                        <button
                          type="submit"
                          className="bg-gray-800 hover:bg-gray-900 text-white font-bold py-2 px-4 rounded"
                        >
                          Xử lý đơn
                        </button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>

          {/* Filter Options */}
          <div className="col-span-2 ml-2 flex items-start justify-center">
            <div className="flex flex-col">
              <h3 className="mb-2">Trạng thái</h3>
              <div className="flex flex-col pl-2 gap-1">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    className="form-radio h-5 w-5 text-blue-500"
                    name="transactionType"
                    value="deposit"
                    onChange={() =>
                      fetchTransactions({
                        email: searchInputRef.current?.value || "",
                        type: "Tất cả",
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
                      })
                    }
                  />
                  <span className="ml-2 text-gray-700">
                    Đã thanh toán tại Kiosk
                  </span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    className="form-radio h-5 w-5 text-blue-500"
                    name="transactionType"
                    value="all"
                    defaultChecked
                    onChange={() =>
                      fetchTransactions({
                        email: searchInputRef.current?.value || "",
                      })
                    }
                  />
                  <span className="ml-2 text-gray-700">Tất cả</span>
                </label>
              </div>
              <button
                onClick={handleResetFilter}
                className="bg-gray-800 hover:bg-gray-900 text-white font-bold py-1 px-2 rounded mt-2 text-sm"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListOrder;
