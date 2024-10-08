import React, { useEffect, useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { alertService } from "../../_services/alert.service";
import config from "../../config";
import { fetchWrapper } from "../../_helpers/fetch-wrapper";
import { fileService } from "../../_services/file.service";
import { AREA } from "../../_helpers/const/const";
// import { alertService, onAlert } from '../_services';

export default function HandleAreaPage() {
  const navigate = useNavigate();
  const { register, handleSubmit, setValue } = useForm();
  const [errForm, setErrForm] = useState<any>();
  const params = useParams();
  const [data, setData] = useState<any>();
  const [streets, setStreets] = useState([]);

  const [selectedFile, setSelectedFile] = useState<any>();
  const [preview, setPreview] = useState();

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
    const streets = await fetchWrapper.Post2GetByPaginate(
      config.apiUrl + "Street",
      -1, {}, -1
    );
    setStreets(streets.list);
    setValue("streetId", streets.list[0].streetId);

    if (!params.id) return;
    const result = fetchWrapper.get(config.apiUrl + "Area/" + params.id);
    result.then((val) => {
      setValue("areaName", val.areaName);
      setValue("streetId", val.streetId);
      setData(val);
      setPreview(val.urlImage);
    });
  }

  useEffect(() => {
    fetAllData();
  }, []);

  const savedata = async (val) => {
    setErrForm([]);
    const dataPost = {
      ...data,
      ...val,
      // streetName: streets.find(stressDetail => stressDetail.streetId == val.streetId).streetName,
      urlImage: "",
    };

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
    const connectApi = params.id
      ? fetchWrapper.put(config.apiUrl + AREA + "/" + params.id, dataPost)
      : fetchWrapper.post(config.apiUrl + AREA, dataPost);

    connectApi.then((res) => {
      if (res.errors) {
        let listErr = {};
        for (const key in res.errors) {
          const element = res.errors[key];
          listErr = {
            ...listErr,
            [key]: element[0],
          };
        }
        setErrForm(listErr);

        return;
      }
      alertService.alert({
        content: params.id ? "Thay đổi thành công" : "Tạo mới thành công",
      });
      navigate("/area", { replace: true });
    });
  };

  return (
    <div className="container">
      <form
        onSubmit={handleSubmit(savedata)}
        className="grid grid-cols-2 gap-4 jumbotron"
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

        <div className="flex flex-column gap-4">
          <label className="" htmlFor="nm">
            <b>Tên khu vực: </b>
            <input
              id="nm"
              type="text"
              className="form-control"
              placeholder="Tên khu vực"
              {...register("areaName", {
                required: {
                  message: "required",
                  value: true,
                },
              })}
            />
          </label>
          <label className="" htmlFor="street">
            <b>Đường sách </b>
            <select
              {...register("streetId")}
              id="street"
              className="form-control"
            >
              {streets.map((v) => (
                <option key={v.streetId} value={v.streetId}>
                  {v.streetName}
                </option>
              ))}
            </select>
          </label>
          <div>
            <input type="submit" className="btn btn-dark mt-2" value="Lưu" />
          </div>
        </div>
      </form>
    </div>
  );
}
