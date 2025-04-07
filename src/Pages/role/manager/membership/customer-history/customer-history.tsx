import React from "react";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";

const CustomerHistory = () => {
  // Mock Data
  const transactionData = [
    {
      id: 1,
      type: "Nạp tiền",
      amount: "+ 500,000 VND",
      time: "10/03/2025",
      location: "Máy kiosk",
    },
    {
      id: 2,
      type: "Mua hàng",
      amount: "- 200,000 VND",
      time: "10/03/2025",
      location: "Nhà sách A",
    },
    {
      id: 3,
      type: "Mua hàng",
      amount: "- 100,000 VND",
      time: "15/03/2025",
      location: "Nhà sách B",
    },
  ];

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="container mx-auto p-4 bg-white rounded-md ">
        {/* Search Bar */}
        <div className="mb-4 flex items-center justify-between gap-4">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="quanquan2411@gmail.com"
              className="w-full rounded-full py-2 px-8 pl-10 pr-10 border border-gray-400 focus:outline-none focus:border-blue-500"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon className="text-gray-500" />
            </div>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              <button>
                <ClearIcon className="text-gray-500 hover:text-gray-700" />
              </button>
            </div>
          </div>
          <button className="bg-gray-800 hover:bg-gray-900 text-white font-bold py-2 px-4 rounded">
            Tìm kiếm
          </button>
        </div>

        {/* User Info */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>ID: quanquan@gmail.com</div>
          <div className="text-right">
            <div>Số dư trong ví: XXX,XXX VND</div>
            <div>Số điểm: XX Điểm</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-4 mb-6">
          <button className="bg-transparent hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded">
            Xem lịch sử biến động số dư
          </button>
          <button className="bg-transparent hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded">
            Xem lịch sử biến động điểm
          </button>
        </div>

        <div className="grid grid-cols-3">
          {/* Transaction History */}
          <div className="col-span-2 border border-gray-400 rounded">
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Biến động số dư</TableCell>
                  <TableCell>Thời gian</TableCell>
                  <TableCell>Loại giao dịch</TableCell>
                  <TableCell>Địa điểm</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {transactionData.map((row) => (
                  <TableRow
                    key={row.id}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell>{row.amount}</TableCell>
                    <TableCell>{row.time}</TableCell>
                    <TableCell>{row.type}</TableCell>
                    <TableCell>{row.location}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Filter Options */}
          <div className="col-span-1 mt-6 flex items-start justify-center">
            <div className="flex flex-col mr-8">
              <div className="mb-4">Loại giao dịch</div>
              <div className="flex flex-col">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    className="form-radio h-5 w-5 text-blue-500"
                    name="transactionType"
                    value="deposit"
                  />
                  <span className="ml-2 text-gray-700">Nạp tiền</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    className="form-radio h-5 w-5 text-blue-500"
                    name="transactionType"
                    value="purchase"
                  />
                  <span className="ml-2 text-gray-700">Mua hàng</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    className="form-radio h-5 w-5 text-blue-500"
                    name="transactionType"
                    value="all"
                    defaultChecked
                  />
                  <span className="ml-2 text-gray-700">Tất cả</span>
                </label>
              </div>
              <button className="bg-gray-800 hover:bg-gray-900 text-white font-bold py-1 px-2 rounded mt-2 text-sm">
                Reset
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerHistory;
