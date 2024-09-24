import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import dayjs from "dayjs";
import axios from "axios";
import {
  CATEGORY,
  DISTRIBUTOR,
  GENRE,
  GIFT,
  PUBLISHER,
  ROUTER,
  STORE,
} from "../../../../_helpers/const/const";
import { fetchWrapper } from "../../../../_helpers/fetch-wrapper";
import config from "../../../../config";
import { alertService } from "../../../../_services";
import { fileService } from "../../../../_services/file.service";

export default function HandleGift() {
  const [data, setData] = useState<any>({
    giftName: "",
    description: "",
    startDate: dayjs(new Date()).format("YYYY-MM-DD"),
    endDate: dayjs(new Date()).format("YYYY-MM-DD"),
    urlImage: "",
    point: 0,
    quantity: 0,
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
  // Router
  const navigate = useNavigate();
  const params = useParams();
  const { pathname } = useLocation();
  const isBookScreen = pathname.includes(ROUTER.book.url);
  // End Router

  const [selectedFile, setSelectedFile] = useState<any>();
  const [preview, setPreview] = useState();

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
      config.apiUrl + GIFT + "/" + params.id
    );
    setData(result);
    setPreview(result.urlImage);

    return {
      ...result,
      ...result.book,
      endDate: dayjs(result.book?.publicDay).format("YYYY-MM-DD"),
      startDate: dayjs(result.book?.publicDay).format("YYYY-MM-DD"),
    };
  }

  const savedata = async (val) => {
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
    let process;
    if (params.id) {
      process = fetchWrapper.put(config.apiUrl + GIFT + "/" + params.id, val);
    } else {
      process = fetchWrapper.postUpgrade(config.apiUrl + GIFT, val);
    }

    process
      .then((res) => {
        console.log('res :>> ', res);
        if (res.success) {
          alertService.alert({
            content: params.id ? "Thay đổi thành công" : "Tạo mới thành công",
          });
        } else {
          alertService.alert({
            content: res.message,
          });
        }

        navigate(ROUTER.roleGiftStore.gift.url, {
          replace: true,
        });
      })
      .catch((e) => {
        console.log('e :>> ', e);
        alertService.alert({
          content: "Can't success, pls try again",
        });
      });
  };
  return (
    <div className="col-10">
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

        <div className="flex flex-column gap-2">
          <div>
            <label htmlFor="nm">
              <b>Tên quà tặng</b>
            </label>
            <input
              id="nm"
              type="text"
              className="form-control"
              {...register("giftName", { required: true })}
            />
            <div className="text-danger">
              {errors.giftName && <div>Trường này là bắt buộc</div>}
            </div>
          </div>

          <div>
            <label htmlFor="pub">
              <b>Ngày bắt đầu: </b>
            </label>
            <input
              id="pub"
              type="date"
              className="form-control"
              {...register("startDate", { valueAsDate: true })}
            />
          </div>
        </div>
        <div className="flex flex-column gap-2">
          <div className="d-flex gap-2">
            <div>
              <label htmlFor="anm">
                <b>Số lượng: </b>
              </label>
              <input
                id="anm"
                type="number"
                className="form-control"
                {...register("quantity")}
              />
            </div>

            <div>
              <label htmlFor="anm">
                <b>Điểm: </b>
              </label>
              <input
                id="anm"
                type="number"
                className="form-control"
                {...register("point")}
                min={0}
              />
            </div>
          </div>
          <div>
            <label htmlFor="pub">
              <b>Ngày kết thúc: </b>
            </label>
            <input
              id="pub"
              type="date"
              className="form-control"
              min={0}
              {...register("endDate", { valueAsDate: true })}
            />
          </div>
        </div>

        <div className="col-start-2 col-span-2">
          <label htmlFor="des">
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
