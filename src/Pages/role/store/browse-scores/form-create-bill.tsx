import { useEffect, useState } from "react";
import {
  Autocomplete,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  TextField,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import {
  CUSTOMER,
  POINT_HISTORY,
  STORE,
} from "../../../../_helpers/const/const";
import { fetchWrapper } from "../../../../_helpers/fetch-wrapper";
import config from "../../../../config";
import { alertService } from "../../../../_services";
import { billFormService } from "../../../../_services/bill-form.service";
export default function CreateBillForm(props) {
  const user = JSON.parse(localStorage.getItem("userInfo"));

  const { register, handleSubmit, getValues, setValue, watch, control } =
    useForm({
      defaultValues: async () => {
        return await fetAllData();
      },
    });
  const [openConfirm, setopenComfirm] = useState(false);

  const [customers, setCustomers] = useState<any>();
  const [stores, setStores] = useState<any>([]);
  const [data, setData] = useState<any>({
    invoiceCode: "",
    customerId: "",
    customerPhone: 0,
    amount: 0,
    pointAmount: 0,
    storeId: 0,
  });

  async function fetAllData() {
    const customer = await fetchWrapper.Post2GetByPaginate(
      config.apiUrl + CUSTOMER,
      -1,
      undefined,
      -1
    );
    setCustomers(customer.list);
    const stores = await fetchWrapper.Post2GetByPaginate(
      config.apiUrl + STORE,
      -1,
      undefined,
      -1
    );
    setStores(stores.list);
    return {
      ...data,
      customerPhone: "0",
      storeId: stores.list.find((store) => store.storeId == user.user.storeId)
        .storeId,
    };
  }

  const saveData = async () => {
    let val = getValues();
    val.customerId = val.customerId.toString();
    val.amount = billFormService.getTgthdBillForm();

    const connectApi = fetchWrapper.post(config.apiUrl + POINT_HISTORY, {
      ...val,
      status: 1,
    });

    connectApi.then((res) => {
      if (res.success) {
        alertService.alert({
          content: `cộng ${getValues().pointAmount} điểm cho nguời dùng ${
            val.customerPhone
          }`,
        });
        props.close(res.data);
      } else {
        alertService.alert({
          content: res.message,
        });
        props.close(res.data);
      }
    });
  };

  function closeFormBill() {
    setopenComfirm(false);
  }
  function openFormBill() {
    setopenComfirm(true);
  }

  function calculatorQuantity(e) {
    billFormService.setTgthdBillForm(e.target.value);
    setValue("pointAmount", Math.floor(e.target.value / 1000));
  }

  function FormBill() {
    return (
      <form onSubmit={handleSubmit(openFormBill)} className="">
        <div className="d-flex flex-column gap-2">
          <label className="" htmlFor="mhd">
            <div className="text-xs">Mã hoá đơn: </div>
            <input
              id="mhd"
              type="text"
              className="form-control"
              {...register("invoiceCode", {
                required: {
                  message: "required",
                  value: true,
                },
              })}
            />
          </label>
          <div className="row justify-between">
            <label
              className="col-6 "
              htmlFor="billFormService.getTgthdBillForm()"
            >
              <div className="text-xs">Tổng giá trị hoá đơn: </div>
              <input
                id="billFormService.getTgthdBillForm()"
                type="number"
                min={0}
                className="form-control"
                onChange={calculatorQuantity}
                defaultValue={billFormService.getTgthdBillForm()}
              />
            </label>

            <label className="col-6  d-block" htmlFor="biography">
              <div className="text-xs">Số điểm quy đổi: </div>
              <input
                disabled
                id="biography"
                type="number"
                className="form-control"
                min={0}
                {...register("pointAmount")}
              />
            </label>
          </div>
          <label className=" d-block" htmlFor="store">
            <div className="text-xs">Cửa hàng: </div>
            <select
              id="store"
              className="form-control"
              disabled
              {...register("storeId")}
            >
              {stores.map((val) => (
                <option key={val.storeId} value={val.storeId}>
                  {val.storeName}
                </option>
              ))}
            </select>
          </label>
          <label className="" htmlFor="nm">
            {/* <div className="text-xs">Tên khách hàng: </div> */}
            <Controller
              name="customerId"
              control={control}
              rules={{ required: "Vui lòng chọn khách hàng" }}
              render={({ field }) => (
                <Autocomplete
                  disablePortal
                  options={customers || []}
                  getOptionLabel={(option) => option.customerName || ""}
                  onChange={(event, newValue) => {
                    if (newValue) {
                      field.onChange(newValue.customerId); // Cập nhật customerId
                      setValue("customerPhone", newValue.customerName || ""); // Cập nhật customerPhone
                    } else {
                      field.onChange(null); // Reset customerId
                      setValue("customerPhone", ""); // Reset customerPhone
                    }
                  }}
                  value={
                    customers?.find(
                      (option) => option.customerId === field.value
                    ) || null
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Chọn khách hàng"
                      variant="outlined"
                    />
                  )}
                />
              )}
            />
          </label>
          <div className="col-start-2 col-span-1">
            <input
              type="submit"
              className="btn btn-success mt-2"
              value="Tạo đơn"
            />
          </div>
        </div>
      </form>
    );
  }

  function ConfirmDialog() {
    const sdt = getValues().customerPhone;
    return (
      <>
        Xác nhận hoá đơn cho khách hàng {sdt}?
      </>
    );
  }
  return (
    <div className="p-2">
      <FormBill />
      <Dialog
        open={openConfirm}
        onClose={closeFormBill}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <DialogTitle id="alert-dialog-title">
          <ConfirmDialog />
        </DialogTitle>
        <DialogActions>
          <Button onClick={closeFormBill}>Huỷ</Button>
          <Button onClick={saveData} autoFocus>
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
