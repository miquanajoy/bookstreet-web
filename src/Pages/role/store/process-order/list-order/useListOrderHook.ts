import { useEffect, useState } from "react";
import config from "../../../../../config";
import { fetchWrapper } from "../../../../../_helpers/fetch-wrapper";
import { alertService } from "../../../../../_services";
import { KIOS, STORE } from "../../../../../_helpers/const/const";
import { useForm } from "react-hook-form";
import { Role } from "../../../../../models/Role";
import dayjs, { Dayjs } from "dayjs";

enum EnumTransactionType {
  pending = 0,
  payByKiosk = 1,
  cancel = 2,
  payment = 3,
  refunded = 4,
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
  statusTxt: string;
  createDate: string;
}

interface TotalGroupColumns {
  Balance: number;
  Points: number;
}

interface TransactionFilter {
  email: string;
  type?: string;
  fromDate?: string;
  toDate?: string;
}

const useListOrderHook = (userRole: string = "", prop?) => {
  const [email, setEmail] = useState("");
  const [fromDate, setFromDate] = useState<Dayjs | null>(null);
  const [toDate, setToDate] = useState<Dayjs | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [totalGroupColumns, setTotalGroupColumns] =
    useState<TotalGroupColumns | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { register } = useForm({
    defaultValues: {
      transactionType: "all",
    },
  });

  // Dialog
  const [openDialog, setOpenDialog] = useState(false);
  const handleCloseCheckBill = () => {
    setOpenDialog(false);
  };
  const openCheckBill = () => {
    setOpenDialog(true);
  };

  const [openOrderDetailDialog, setOpenDetailDialog] = useState(false);
  const handleCloseOrderDetail = () => {
    setOpenDetailDialog(false);
  };
  const openOrderDetail = (orderDetail) => {
    setOpenDetailDialog(orderDetail);
  };

  const fetchTransactions = async (filter: TransactionFilter) => {
    setLoading(true);
    setError(null);

    const filters: {
      field: string;
      value: string | number;
      operand: number;
      isList?: boolean;
    }[] = [
      {
        field: "customer.email",
        value: filter.email,
        operand: 0,
      },
    ];

    let transactionType: any;
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
        transactionType = "1,3";
    }
    if (userRole === Role.Manager) {
      transactionType = "3";
    }
    transactionType = prop.status ? prop.status : transactionType;
    if (transactionType) {
      filters.push({
        field: "status",
        value: transactionType.toString(),
        operand: 0,
        isList: true,
      });
    }
    if (prop.storeId) {
      filters.push({
        field: "storeId",
        value: prop.storeId.toString(),
        operand: 0,
        isList: true,
      });
    }
    if (filter.fromDate) {
      filters.push({
        field: "createDate",
        value: filter.fromDate,
        operand: 2, // Greater than or equal
      });
    }
    if (filter.toDate) {
      filters.push({
        field: "createDate",
        value: filter.toDate,
        operand: 4, // Less than or equal
      });
    }

    try {
      const response = await fetchWrapper.post(
        config.apiUrl + STORE + "/customer-transactions",
        {
          page: -1,
          limit: -1,
          filters,
        }
      );
      if (response.success) {
        let dataConvert = response.data.list.map((val) => ({
          ...val,
          statusTxt: (() => {
            if (val.status == EnumTransactionType.payByKiosk) {
              return "Xử lí đơn";
            } else if (val.status == EnumTransactionType.payment) {
              if (
                val.status == EnumTransactionType.payment &&
                userRole === Role.Manager
              ) {
                return "Chi tiết";
              }
              return "Đã hoàn tất";
            }
          })(),
        }));
        dataConvert = dataConvert.sort((orderA, orderB) => {
          const dateA: any = new Date(orderA.createDate);
          const dateB: any = new Date(orderB.createDate);

          return dateB - dateA;
        });
        if (prop?.setOrder) {
          prop?.setOrder(dataConvert);
        }
        setTransactions(dataConvert);
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
    fetchTransactions({ email, type: "all" });
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

  return {
    transactions,
    loading,
    error,
    email,
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
  };
};

export default useListOrderHook;
