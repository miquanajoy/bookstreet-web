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
          page: 0,
          limit: 0,
          filters: [{
            field: "status",
            value: '4',
            operand: 0,
          }]
        }
      );
      if (response.success) {
        const dc = response.data.list.map((val, i) => ({
          id: i,
          ...val,
          storeName: convertAddress(
            val.storeId,
            val.transactionType,
            stores,
            kiosk
          ),
        }));
        setTransactions(dc);
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
      default:
        return "Không xác định";
    }
  };

  const convertAddress = (storeId, transactionType, kiosk, stores) => {
    if (transactionType == 3) {
      return (
        stores.find((storeDt) => storeDt.storeId === storeId)?.storeName || "Thanh toán tại cửa hàng"
      );
    }
    if (transactionType == 1) {
      return kiosk.find((v) => v.id === storeId)?.kiosName || "Nạp tiền tại máy kiosk";
    }
    return "";
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
