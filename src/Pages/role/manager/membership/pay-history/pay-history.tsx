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
import useTransactionHistory from "./usePayHistory";

const CustomerHistory = () => {
  const {
    transactions,
    loading,
    error,
    getTransactionTypeLabel,
  } = useTransactionHistory();

  const formatCurrency = (value: number | string) => {
    if (!value && value !== 0) return "";
    return Number(value).toLocaleString("vi-VN");
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="container mx-auto p-4 bg-white rounded-md">
        {/* Transaction History */}
        <div className="col-span-3 border border-gray-400 rounded">
          {!loading && !error && (
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Mã đơn</TableCell>
                  <TableCell>Cửa hàng</TableCell>
                  <TableCell>Trạng thái thanh toán</TableCell>
                  <TableCell>Thời gian</TableCell>
                  <TableCell>Tổng thanh toán</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {transactions.length ? (
                  transactions.map((row) => (
                    <TableRow
                      key={row.storeOrderId}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell>{row.orderId}</TableCell>
                      <TableCell>{row.storeName}</TableCell>
                      <TableCell>{getTransactionTypeLabel(row.status)}</TableCell>
                      <TableCell>
                        {dayjs(new Date(row.createDate)).format(
                          "YYYY/MM/DD - HH:mm"
                        )}
                      </TableCell>
                      <TableCell>{formatCurrency(row.subTotal)} VNĐ</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-gray-500">
                      Không có lịch sử hiển thị
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerHistory;
