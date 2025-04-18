import { useEffect, useState } from "react";
import config from "../../../../../config";
import { fetchWrapper } from "../../../../../_helpers/fetch-wrapper";
import { alertService } from "../../../../../_services";
import { KIOS, STORE } from "../../../../../_helpers/const/const";

enum EnumTransactionType {
  pending = 0,
  payByKiosk = 1,
  cancel = 2,
  payment = 3,
  refunded = 4
}

interface Transaction {
  customerEmail: string;
  customerId: number;
  customerName: string;
  customerPhone: any;
  orderId: number;
  status: number;
  storeId: number;
  storeName: string;
  storeOrderId: number;
  subTotal: number;
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

  // Dialog
  const [openDialog, setOpenDialog] = useState(false);
  const handleCloseCheckBill = () => {
    setOpenDialog(false);
  };
  const openCheckBill = () => {
    setOpenDialog(true);
  };
  const fetchTransactions = async (filter: TransactionFilter) => {
    setLoading(true);
    setError(null);

    const filters: {
      field: string;
      value: string | number;
      operand: number;
    }[] = [
      {
        field: "customer.email",
        value: filter.email,
        operand: 0,
      },
    ];

    if (filter.type) {
      let transactionType: number | undefined;
      switch (filter.type) {
        case "chưa thanh toán":
          transactionType = EnumTransactionType.pending;
          break;
        case "Đã thanh toán tại Kiosk":
          transactionType = EnumTransactionType.payByKiosk;
          break;
        case "Hủy hóa đơn":
          transactionType = EnumTransactionType.cancel;
          break;
        case "Đã xử lý đơn hàng":
          transactionType = EnumTransactionType.payment;
          break;
        case "Đã hoàn tiền":
          transactionType = EnumTransactionType.refunded;
          break;
        default:
          transactionType = undefined;
      }
      if (transactionType) {
        filters.push({
          field: "status",
          value: transactionType.toString(),
          operand: 0,
        });
      }
    }

    try {
      const response = await fetchWrapper.post(
        config.apiUrl + STORE + "/customer-transactions",
        {
          page: 0,
          limit: 0,
          filters,
        }
      );
      if (response.success) {
        setTransactions(response.data.list);
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

  const getTransactionTypeLabel = (type: number) => {
    switch (type) {
      case 0:
        return "chưa thanh toán";
      case 1:
        return "Đã thanh toán tại Kiosk";
      case 2:
        return "Hủy hóa đơn";
      case 3:
        return "Thanh toán cho store";
      case 4:
        return "Đã hoàn tiền";
      default:
        return "Không xác định";
    }
  };

  const convertAddress = (storeId, transactionType, kiosk, stores) => {
    if (transactionType == 3) {
      return (
        stores.find((storeDt) => storeDt.storeId === storeId)?.storeName ||
        "Thanh toán tại cửa hàng"
      );
    }
    if (transactionType == 1) {
      return (
        kiosk.find((v) => v.id === storeId)?.kiosName ||
        "Nạp tiền tại máy kiosk"
      );
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
    openDialog,
    handleCloseCheckBill,
    openCheckBill,
  };
};

export default useListOrderHook;
