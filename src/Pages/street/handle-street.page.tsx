import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";

import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { fetchWrapper } from "../../_helpers/fetch-wrapper";
import config from "../../config";
import { STREET, ROUTER } from "../../_helpers/const/const";
import { fileService } from "../../_services/file.service";
import { alertService } from "../../_services";
import { SearchModel, searchService } from "../../_services/search.service";

export default function HandleStreetPage() {
  const navigate = useNavigate();

  const params = useParams();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: async () => {
      return await fetAllData();
    },
  });
  const [data, setData] = useState<any>({
    streetName: "",
    publicDay: dayjs(new Date()).format("YYYY-MM-DD"),
    address: "",
    description: "",
    openingHours: "08:00",
    closingHours: "17:00",
    urlImage: "",
  });
  const openingHoursNow = watch("openingHours", "");
  const closeHoursNow = watch("closingHours", "");

  const [preview, setPreview] = useState();
  const [selectedFile, setSelectedFile] = useState<any>();

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
    if (!params.id) return data;
    const result = await fetchWrapper.get(
      config.apiUrl + STREET + "/" + params.id
    );
    setData(result);
    setPreview(result.urlImage);
    return {
      ...result,
      publicDay: dayjs(result?.publicDay).format("YYYY-MM-DD"),
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

    if (val.closingHours.split(":").length < 3) {
      val.closingHours = val.closingHours + ":00";
    }
    if (val.openingHours.split(":").length < 3) {
      val.openingHours = val.openingHours + ":00";
    }

    let process;
    if (params.id) {
      process = fetchWrapper.put(
        config.apiUrl + STREET + "/" + params.id,
        dataPost
      );
    } else {
      delete dataPost.streetId;
      process = fetchWrapper.postUpgrade(config.apiUrl + STREET, dataPost);
    }

    process
      .then((val) => {
        alertService.alert({
          content: params.id ?  "Thay đổi thành công" : "Tạo mới thành công",
        });
        navigate(ROUTER.street.url, {
          replace: true,
        });
      })
      .catch((e) => {});
  };

  return (
    <div className="container">
      <h1 className="title">Quản lý Đường sách</h1>
      <form
        onSubmit={handleSubmit(savedata)}
        className="grid grid-cols-3 gap-2 jumbotron mt-4"
      >
        <div className="row-span-2 flex flex-column items-center gap-2">
          <label
            htmlFor="imageUpload"
            className="block h-52 w-52 bg-slate-50 bg-contain bg-no-repeat bg-center"
            style={{ backgroundImage: "url(" + preview + ")" }}
          ></label>
          <input
            type="file"
            onChange={onSelectFile}
            id="imageUpload"
            accept="image/png, image/jpeg"
            className="hidden"
          />
          <label
            htmlFor="imageUpload"
            className="block border px-2 py-1 bg-slate-50 rounded"
          >
            Chọn hình ảnh
          </label>
        </div>
        <div className="d-flex flex-col gap-2">
          <div>
            <label htmlFor="streetName">
              <b>Tên cửa hàng: </b>
            </label>
            <input
              id="streetName"
              type="text"
              className="form-control"
              placeholder="Street name"
              {...register("streetName")}
            />
          </div>

          <div>
            <label htmlFor="openH">
              <b>Giờ mở cửa: </b>
            </label>
            <input
              type="time"
              {...register("openingHours")}
              id="openH"
              className="form-control"
              max={closeHoursNow}
            />
          </div>
        </div>
        <div className="d-flex flex-col gap-2">
          <div>
            <label htmlFor="pub">
              <b>Ngày xuất bản: </b>
            </label>
            <input
              id="pub"
              type="date"
              className="form-control"
              {...register("publicDay", { valueAsDate: true })}
            />
          </div>
          <div>
            <label htmlFor="closH">
              <b>Giờ đóng cửa: </b>
            </label>
            <input
              type="time"
              {...register("closingHours")}
              id="closH"
              className="form-control"
              min={openingHoursNow}
            />
          </div>
        </div>

        <div className="col-start-2 col-span-2">
          <div>
            <label className="w-100 " htmlFor="addr">
              <b>Địa chỉ: </b>
              <input
                id="addr"
                type="text"
                className="form-control"
                {...register("address")}
              />
            </label>
          </div>

          <label htmlFor="avb">
            <b>Mô tả: </b>
          </label>
          <textarea
            className="form-control min-h-30 max-h-50"
            {...register("description")}
          ></textarea>
          <input type="submit" className="btn btn-success mt-12" value="Lưu" />
        </div>
      </form>
    </div>
  );
}
