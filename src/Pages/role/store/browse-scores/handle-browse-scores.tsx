import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";

import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { fetchWrapper } from "../../../../_helpers/fetch-wrapper";
import { CUSTOMER, ROUTER, STORE } from "../../../../_helpers/const/const";
import config from "../../../../config";
import { fileService } from "../../../../_services/file.service";
import { alertService } from "../../../../_services";

export default function HandleCustomer() {
  const navigate = useNavigate();

  const params = useParams();
  const [data, setData] = useState<any>({
    customerName: "",
    phone: "",
    point: 0,
    storeName: "",
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: async () => {
      return await fetAllData();
    },
  });
  const [preview, setPreview] = useState();
  const [selectedFile, setSelectedFile] = useState<any>();

  const [stores, setStores] = useState<any>([]);

  useEffect(() => {
    if (!selectedFile) {
      setPreview(undefined);
      return;
    }

    const objectUrl: any = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

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

  async function fetAllData() {
    const stores = await fetchWrapper.Post2GetByPaginate(
      config.apiUrl + STORE,
      -1
    );
    setStores(stores.list);
    if (!params.id) return data;
    const result = await fetchWrapper.get(
      config.apiUrl + CUSTOMER + "/" + params.id
    );
    setData(result);
    setPreview(result.urlImage);
    return {
      ...result,
      dateOfBirth: dayjs(new Date(result.dateOfBirth)).format("YYYY-MM-DD"),
    };
  }

  const savedata = async (val) => {
    let dataPost = val;
    const formData = new FormData();
    if (selectedFile) {
      formData.append(
        "files",
        new Blob([selectedFile], { type: "image/png" }),
        selectedFile.name
      );
      dataPost.urlImage = await fileService.postFile(formData);
    } else {
      dataPost.urlImage = preview ?? "";
    }
    let process;
    if (params.id) {
      process = fetchWrapper.put(
        config.apiUrl + CUSTOMER + "/" + params.id,
        dataPost
      );
    } else {
      delete dataPost.customerId;
      process = fetchWrapper.postUpgrade(config.apiUrl + CUSTOMER, dataPost);
    }

    process
      .then((val) => {
        if (val.success) {
          alertService.alert({
            content: params.id ? "Thay đổi thành công" : "Tạo mới thành công",
          });
          return;
        }
        alertService.alert({
          content: params.id ? "Thay đổi thành công" : "Tạo mới thành công",
        });
        navigate(ROUTER.roleStore.customerPoint.url, {
          replace: true,
        });
      })
      .catch((e) => {
        console.log('e :>> ', e);
      });
  };

  return (
    <div className="container">
      <form onSubmit={handleSubmit(savedata)} className="col-6">
        <div className="d-flex flex-column gap-2">
          <div className="grid grid-cols-2 gap-2">
            <label className="" htmlFor="nm">
              <b>Tên khách hàng: </b>
              <input
                id="nm"
                type="text"
                className="form-control"
                {...register("customerName")}
              />
            </label>
            <label className="" htmlFor="anm">
              <b>Số điện thoại: </b>
              <input
                id="anm"
                type="text"
                className="form-control"
                placeholder="000-00"
                {...register("phone")}
              />
            </label>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {/* <div>
              <label className=" d-block" htmlFor="biography">
                <b>Điểm: </b>
                <input
                  id="biography"
                  type="number"
                  className="form-control"
                  min={0}
                  {...register("point")}
                />
              </label>
            </div> */}
            {/* <div>
              <label className=" d-block" htmlFor="store">
                <b>Cửa hàng: </b>
                <select
                  id="store"
                  className="form-control"
                  {...register("storeId")}
                >
                  {stores.map((val) => (
                    <option key={val.storeId} value={val.storeId}>
                      {val.storeName}
                    </option>
                  ))}
                </select>
              </label>
            </div> */}
          </div>
          <div className="col-start-2 col-span-2">
            <input
              type="submit"
              className="btn btn-success mt-12"
              value="Lưu"
            />
          </div>
        </div>
      </form>
    </div>
  );
}
