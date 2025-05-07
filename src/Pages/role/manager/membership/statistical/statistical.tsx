import React, { useState, useEffect } from "react";
import config from "../../../../../config";
import { fetchWrapper } from "../../../../../_helpers/fetch-wrapper";

const StatisticalPage = () => {
  const [stats, setStats] = useState({
    paidOrders: 0,
    paidAmount: 0,
    unpaidOrders: 0,
    unpaidAmount: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTransactions = async (status) => {
    try {
      const response = await fetchWrapper.post(
        config.apiUrl + "Store/customer-transactions",
        {
          page: -1,
          limit: -1,
          filters: [
            {
              field: "status",
              value: status,
              operand: 0,
            },
          ],
        }
      );

      if (!response || !response.data || !Array.isArray(response.data.list)) {
        throw new Error(
          "Dữ liệu giao dịch không hợp lệ: Không tìm thấy mảng giao dịch"
        );
      }
      return response.data.list;
    } catch (err) {
      throw new Error("Lỗi khi lấy dữ liệu: " + err.message);
    }
  };

  const calculateStats = (transactions, status) => {
    if (!Array.isArray(transactions)) {
      console.error(
        `Dữ liệu giao dịch (status ${status}) không phải mảng:`,
        transactions
      );
      return { orders: 0, amount: 0 };
    }

    const orders = transactions.length;
    const amount = transactions.reduce((sum, transaction) => {
      const amountValue =
        typeof transaction.subTotal === "number" ? transaction.subTotal : 0;
      return sum + amountValue;
    }, 0);
    return { orders, amount };
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const paidTransactions = await fetchTransactions("4");
        const paidStats = calculateStats(paidTransactions, "4");

        const unpaidTransactions = await fetchTransactions("3");
        const unpaidStats = calculateStats(unpaidTransactions, "3");

        setStats({
          paidOrders: paidStats.orders,
          paidAmount: paidStats.amount,
          unpaidOrders: unpaidStats.orders,
          unpaidAmount: unpaidStats.amount,
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatCurrency = (amount) => {
    if (typeof amount !== "number" || isNaN(amount)) return "0 VNĐ";
    return (
      amount.toLocaleString("vi-VN", {
        style: "decimal", 
      }) + " VNĐ"
    );
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4 text-center">
          Thống Kê Cửa Hàng
        </h1>

        {loading && <p className="text-center">Đang tải dữ liệu...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}

        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Tổng số đơn đã thanh toán */}
            <div className="bg-white p-4 rounded-md shadow-md">
              <h2 className="text-lg font-semibold">
                Tổng số đơn hàng đã thanh toán cho cửa hàng:
              </h2>
              <p className="text-xl font-bold text-blue-600">
                {stats.paidOrders}
              </p>
            </div>

            {/* Tổng tiền đã thanh toán */}
            <div className="bg-white p-4 rounded-md shadow-md">
              <h2 className="text-lg font-semibold">
                Tổng số tiền đã thanh toán toàn cho cửa hàng:
              </h2>
              <p className="text-xl font-bold text-blue-600">
                {formatCurrency(stats.paidAmount)}
              </p>
            </div>

            {/* Tổng số đơn chưa thanh toán */}
            <div className="bg-white p-4 rounded-md shadow-md">
              <h2 className="text-lg font-semibold">
                Tổng số đơn hàng chưa thanh toán cho cửa hàng:
              </h2>
              <p className="text-xl font-bold text-red-600">
                {stats.unpaidOrders}
              </p>
            </div>

            {/* Tổng tiền chưa thanh toán */}
            <div className="bg-white p-4 rounded-md shadow-md">
              <h2 className="text-lg font-semibold">
                Tổng số tiền chưa thanh toán toàn cho cửa hàng:
              </h2>
              <p className="text-xl font-bold text-red-600">
                {formatCurrency(stats.unpaidAmount)}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatisticalPage;
