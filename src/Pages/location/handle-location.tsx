import React, { useEffect, useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { alertService } from "../../_services/alert.service";
import config from "../../config";
import { fetchWrapper } from "../../_helpers/fetch-wrapper";
import { fileService } from "../../_services/file.service";
import { LOCATION } from "../../_helpers/const/const";
// import { alertService, onAlert } from '../_services';

export default function HandleLocation() {
  const navigate = useNavigate();
  const { register, handleSubmit, setValue } = useForm();
  const [errForm, setErrForm] = useState<any>();
  const params = useParams();
  const [data, setData] = useState<any>();
  const [areas, setAreas] = useState([]);

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

  function fetAllData() {
    const areas = fetchWrapper.get(config.apiUrl + "Area");
    areas.then((res) => {
      setAreas(res);
    });
    setValue("areaId", '');

    if (!params.id) return;
    const result = fetchWrapper.get(config.apiUrl + "Location/" + params.id);
    result.then((val) => {
      setValue("locationName", val.locationName);
      setValue("areaId", val.areaId);
      setData(val);
    });
  }

  useEffect(() => {
    fetAllData();
  }, []);

  const savedata = async (val) => {
    console.log('val :>> ', val);
    setErrForm([]);
    const dataPost = {
      ...data,
      ...val,
      areaName: areas.find(stressDetail => stressDetail.areaId == val.areaId).areaName,
      urlImage: preview,
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
      dataPost.urlImage = preview ?? '';
    }

    let process;
    if (params.id) {
      process = fetchWrapper.put(config.apiUrl + LOCATION + "/" + params.id, dataPost)
    } else {
      process = fetchWrapper.post(config.apiUrl + LOCATION, dataPost);
    }

    process.then((res) => {
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
        content: params.id ? "Update success" : "Create success",
      });
      navigate("/location", { replace: true });
    });
  };

  return (
    <div className="container">
      <h1 className="title">Location Management</h1>
      <form
        onSubmit={handleSubmit(savedata)}
        className="grid grid-cols-2 gap-4 jumbotron mt-4"
      >
        <div className="flex flex-column items-center gap-2">
          <label
            htmlFor="imageUpload"
            className="block h-52 w-52 bg-slate-50 bg-contain bg-no-repeat bg-center"
            style={{ backgroundImage: "url(" + preview + ")" }}
          ></label>
          <input
            type="file" accept="image/png, image/jpeg"
            onChange={onSelectFile}
            id="imageUpload"
            className="hidden"
          />
          <label
            htmlFor="imageUpload"
            className="block border px-2 py-1 bg-slate-50 rounded"
          >
            New Image
          </label>
        </div>

        <div className="flex flex-column gap-4">
          <label className="uppercase" htmlFor="nm">
            <b>Location name: </b>
            <input
              id="nm"
              type="text"
              className="form-control"
              placeholder=""
              {...register("locationName")}
            />
          </label>
          <label className="uppercase" htmlFor="area">
            <b>Area: </b>
            <select
              {...register("areaId")}
              id="area"
              className="form-control"
            >
              {areas.map((v) => (
                <option key={v.areaId} value={v.areaId}>
                  {v.areaName}
                </option>
              ))}
            </select>
          </label>
          <div>
            <input type="submit" className="btn btn-dark mt-2" value="Save" />
          </div>
        </div>
      </form>
    </div>
  );
}
