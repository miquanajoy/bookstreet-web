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
      transactionType: "4", 
    },
  });

  const [totalOrder, setTotalOrder] = useState({
    total: 0,
    payment: 0,
    notYetpayment: 0,
    totalPrice: 0,
  });

  const transactionType = watch("transactionType"); 

  const onchangeFilter = (data) => {
    const selectedType = data.target.value;
    setOrdersFilter(orders.filter((val) => val.status === parseInt(selectedType)));
  };

  const fetchTransactions = async () => {
    const filters = [
      {
        field: "customer.email",
        value: emailFilter,
        operand: 0,
      },
      {
        field: "status",
        value: "3,4",
        operand: 0,
        isList: true,
      },
    ];

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
        let res = response.data.list;
        res = res.sort((orderA, orderB) => {
          const dateA: any = new Date(orderA.createDate);
          const dateB: any = new Date(orderB.createDate);

          return dateB - dateA;
        });
        setOrders(res);
        
        setOrdersFilter(
          res.filter((val) => val.status === parseInt(transactionType))
        );
        const payment = res.filter((val) => val.status === 4); 
        const notYetpayment = res.filter((val) => val.status === 3); 
        const total = notYetpayment
          .map((val) => val.subTotal)
          .reduce((pre, next) => pre + next, 0); 
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
  }, [emailFilter]); 

  
  
  
  
  
  

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