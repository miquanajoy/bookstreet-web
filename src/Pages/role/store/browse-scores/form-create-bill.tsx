import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Modal,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import dayjs from "dayjs";
import { Role } from "../../../../models/Role";
import {
  HISTORY_BROWSE_SCORE,
  REJECT_BROWSE_SCORE,
} from "../../store/browse-scores/list-browse-scores";
import { ModelStyle } from "../../../../_helpers/const/model.const";
import { useForm } from "react-hook-form";
import { POINT_HISTORY, STORE } from "../../../../_helpers/const/const";
import { fetchWrapper } from "../../../../_helpers/fetch-wrapper";
import config from "../../../../config";
import { useEffect, useState } from "react";
import { fileService } from "../../../../_services/file.service";
import { alertService } from "../../../../_services";
import { billFormService } from "../../../../_services/bill-form.service";
export default function CreateBillForm(props) {
  const user = JSON.parse(localStorage.getItem("userInfo"));

  const { register, handleSubmit, getValues, setValue, watch } = useForm({
    defaultValues: async () => {
      return await fetAllData();
    },
  });
  const [openConfirm, setopenComfirm] = useState(false);

  const [preview, setPreview] = useState();
  const [selectedFile, setSelectedFile] = useState<any>();

  const [stores, setStores] = useState<any>([]);
  const [data, setData] = useState<any>({
    invoiceCode: "",
    customerName: "",
    customerPhone: 0,
    amount: 0,
    pointAmount: 0,
    storeId: 0,
  });

  async function fetAllData() {
    const stores = await fetchWrapper.Post2GetByPaginate(
      config.apiUrl + STORE,
      -1,
      undefined, -1
    );
    setStores(stores.list);
    return {
      ...data,
      customerPhone: 0,
      storeId: stores.list.find(store => store.storeId == user.user.storeId).storeId,
    };
  }

  const saveData = async () => {
    let val = getValues();
    val.amount = billFormService.getTgthdBillForm();
    const formData = new FormData();
    if (selectedFile) {
      formData.append(
        "files",
        new Blob([selectedFile], { type: "image/png" }),
        selectedFile.name
      );
      val.urlImage = await fileService.postFile(formData);
    } else {
      val.urlImage = preview ?? "";
    }
    // }
    const connectApi = fetchWrapper.post(config.apiUrl + POINT_HISTORY, {
      ...val, status: 1
    });

    connectApi.then((res) => {
      if (res.success) {
        alertService.alert({
          content: `cộng ${getValues().pointAmount} điểm cho nguời dùng ${val.customerPhone}`,
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

  const onSelectFile = (e) => {
    if (!e.target.files || e.target.files.length === 0) {
      setSelectedFile(undefined);
      return;
    }

    let reader = new FileReader();
    let base64String;

    reader.onload = function () {
      base64String = reader.result;
      setPreview(base64String);
    };
    reader.readAsDataURL(e.target.files[0]);
    setSelectedFile(e.target.files[0]);
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
      <form
        onSubmit={handleSubmit(openFormBill)}
        className=""
      >
        {/* <div className="flex flex-column items-center gap-2">
          <label
            htmlFor="imageUpload"
            className="block h-52 w-52 bg-slate-200 bg-contain bg-no-repeat bg-center"
            style={{ backgroundImage: "url(" + preview + ")" }}
          ></label>
          <input
            type="file"
            accept="image/png, image/jpeg"
            onChange={onSelectFile}
            id="imageUpload"
            className="hidden"
          />
          <label
            htmlFor="imageUpload"
            className="block border px-2 py-1 bg-slate-200 rounded"
          >
            Chọn hình ảnh
          </label>
        </div> */}
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
            <label className="col-6 " htmlFor="billFormService.getTgthdBillForm()">
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
          <label className="" htmlFor="anm">
            <div className="text-xs">Số điện thoại: </div>
            <input
              id="anm"
              type="number"
              min={0}
              className="form-control"
              placeholder="000"
              {...register("customerPhone", {
                required: {
                  message: "required",
                  value: true,
                },
              })}
            />
          </label>
          <label className="" htmlFor="nm">
            <div className="text-xs">Tên khách hàng: </div>
            <input
              id="nm"
              type="text"
              className="form-control"
              {...register("customerName", {
                required: {
                  message: "required",
                  value: true,
                },
              })}
            />
          </label>
          <div className="col-start-2 col-span-2">
            <input
              type="submit"
              className="btn btn-success mt-12"
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
        Xác nhận cộng {getValues().pointAmount} điểm cho nguời dùng {sdt}?
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
