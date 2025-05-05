import { useEffect, useState } from "react";
import config from "../../../../../config";
import { fetchWrapper } from "../../../../../_helpers/fetch-wrapper";
import { alertService } from "../../../../../_services";
import { KIOS, STORE } from "../../../../../_helpers/const/const";

interface TotalGroupColumns {
  Balance: number;
  Points: number;
}

const useTransactionHistory = () => {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [totalGroupColumns, setTotalGroupColumns] =
    useState<TotalGroupColumns | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTransactions = async () => {
    setLoading(true);
    setError(null);

    try {
      const stores: any = await fetchWrapper.get(config.apiUrl + STORE);
      const kiosk: any = await fetchWrapper.get(config.apiUrl + KIOS);
      const response = await fetchWrapper.post(
        config.apiUrl + "Store/customer-transactions",
        {
          page: -1,
          limit: -1,
          filters: [
            {
              field: "status",
              value: "4",
              operand: 0,
            },
          ],
        }
      );
      if (response.success) {
        let res = response.data.list.map((val, i) => ({
          id: i,
          ...val,
          
        }));
        res = res.sort((orderA, orderB) => {
          const dateA: any = new Date(orderA.createDate);
          const dateB: any = new Date(orderB.createDate);

          return dateB - dateA;
        });
        setTransactions(res);
        setTotalGroupColumns(response.data.totalGroupColumns);
      } else {
        alertService.alert({
          content: response.message,
        });
      }
    } catch (err) {
      setError("Không thể tải lịch sử giao dịch. Vui lòng thử lại!");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const getTransactionTypeLabel = (type: string) => {
    switch (parseInt(type)) {
      case 1:
        return "Nạp tiền";
      case 2:
        return "Rút tiền";
      case 3:
        return "Mua hàng";
      case 4:
        return "Đã thanh toán cho cửa hàng";
      default:
        return "Không xác định";
    }
  };

  return {
    transactions,
    loading,
    error,
    fetchTransactions,
    totalGroupColumns,
    getTransactionTypeLabel,
  };
};

export default useTransactionHistory;
