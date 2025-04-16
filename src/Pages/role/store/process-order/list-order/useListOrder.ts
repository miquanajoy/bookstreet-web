import { useEffect, useState } from "react";
import config from "../../../../../config";
import { fetchWrapper } from "../../../../../_helpers/fetch-wrapper";
import { alertService } from "../../../../../_services";
import { KIOS, STORE } from "../../../../../_helpers/const/const";

enum EnumTransactionType {
  Deposit = 1,
  Withdraw = 2,
  Payment = 3,
}

interface Transaction {
  id: number;
  amount: string;
  transactionType: string;
  transactionDate: string;
  storeName: string;
}

interface TotalGroupColumns {
  Balance: number;
  Points: number;
}

interface TransactionFilter {
  email: string;
  type?: string;
}

const useListOrderHook = (initialEmail: string = "") => {
  const [email, setEmail] = useState(initialEmail);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [totalGroupColumns, setTotalGroupColumns] =
    useState<TotalGroupColumns | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTransactions = async (filter: TransactionFilter) => {
    setLoading(true);
    setError(null);

    const filters: {
      field: string;
      value: string | number;
      operand: number;
    }[] = [
      {
        field: "email",
        value: filter.email,
        operand: 0,
      },
    ];

    if (filter.type) {
      let transactionType: number | undefined;
      switch (filter.type) {
        case "Nạp tiền":
          transactionType = EnumTransactionType.Deposit;
          break;
        case "Rút tiền":
          transactionType = EnumTransactionType.Withdraw;
          break;
        case "Mua hàng":
          transactionType = EnumTransactionType.Payment;
          break;
        default:
          transactionType = undefined;
      }
      if (transactionType) {
        filters.push({
          field: "transactionType",
          value: transactionType.toString(),
          operand: 0,
        });
      }
    }

    try {
      const stores: any = await fetchWrapper.get(config.apiUrl + STORE);
      const kiosk: any = await fetchWrapper.get(config.apiUrl + KIOS);
      const response = await fetchWrapper.post(
        config.apiUrl + "Customer/transactions",
        {
          page: 0,
          limit: 0,
          filters,
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
    fetchTransactions({ email });
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
    email,
    setEmail,
    fetchTransactions,
    totalGroupColumns,
    getTransactionTypeLabel,
  };
};

export default useListOrderHook;
