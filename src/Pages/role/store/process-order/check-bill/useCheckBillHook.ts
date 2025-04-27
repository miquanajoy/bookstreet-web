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
      transactionType: "4", // Chuỗi "4" để khớp với radio button
    },
  });

  const [totalOrder, setTotalOrder] = useState({
    total: 0,
    payment: 0,
    notYetpayment: 0,
    totalPrice: 0,
  });

  const transactionType = watch("transactionType"); // Theo dõi giá trị transactionType

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
        const res = response.data.list;
        setOrders(res);
        // Áp dụng bộ lọc dựa trên transactionType hiện tại
        setOrdersFilter(
          res.filter((val) => val.status === parseInt(transactionType))
        );
        const payment = res.filter((val) => val.status === 4); // Đã thanh toán
        const notYetpayment = res.filter((val) => val.status === 3); // Chưa thanh toán
        const total = res
          .map((val) => val.subTotal)
          .reduce((pre, next) => pre + next, 0); // Thêm giá trị mặc định 0
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
  }, [emailFilter]); // Chỉ phụ thuộc vào emailFilter

  // Cập nhật ordersFilter khi transactionType thay đổi
  // useEffect(() => {
  //   setOrdersFilter(
  //     orders.filter((val) => val.status === parseInt(transactionType))
  //   );
  // }, [transactionType, orders]);

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