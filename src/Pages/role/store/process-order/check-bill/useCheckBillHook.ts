import { useEffect, useState } from "react";
import config from "../../../../../config";
import { fetchWrapper } from "../../../../../_helpers/fetch-wrapper";
import { alertService } from "../../../../../_services";
import { KIOS, STORE } from "../../../../../_helpers/const/const";
import { useForm } from "react-hook-form";

const useCheckBillHook = (emailFilter: string = "") => {
  const [openDialogInfo, setOpenDialog] = useState(null);
  const handleCloseOrderInfo = () => {
    setOpenDialog(false);
  };
  const openOrderInfo = (orderId) => {
    setOpenDialog(orderId);
  };

  const [orders, setOrders] = useState([]);
  const [ordersFilter, setOrdersFilter] = useState([]);

  const { register, handleSubmit, watch } = useForm({
    defaultValues: {
      transactionType: "1",
    },
  });

  const [totalOrder, setTotalOrder] = useState({
    total: 0,
    payment: 0,
    notYetpayment: 0,
    totalPrice: 0,
  });

  const onchangeFilter = (data) => {
    setOrdersFilter(orders.filter((val) => val.status == data.target.value));

  };

  const fetchTransactions = async (transactionType = 1) => {
    const filters: {
      field: string;
      value: string | number;
      operand: number;
    }[] = [
      {
        field: "customer.email",
        value: emailFilter,
        operand: 0,
      },
    ];

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
        const res = response.data.list.filter((val) => val.status <= 1);
        setOrders(res);
        const payment = res.filter((val) => val.status == 1);
        setOrdersFilter(payment);
        const notYetpayment = res.filter((val) => val.status == 0);
        const total = res
          .map((val) => val.subTotal)
          .reduce((pre, next) => {
            return pre + next;
          });
        setTotalOrder({
          total: res.length,
          payment: payment.length,
          notYetpayment: notYetpayment.length,
          totalPrice: total,
        });
      } else {
        alertService.alert({
          content: response.message,
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);
  return {
    openDialogInfo,
    handleCloseOrderInfo,
    openOrderInfo,
    register,
    handleSubmit,
    watch,
    onchangeFilter,
    ordersFilter,
    totalOrder,
  };
};

export default useCheckBillHook;
