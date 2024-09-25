import React, { useEffect, useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { alertService } from "../../_services/alert.service";
import config from "../../config";
import { fetchWrapper } from "../../_helpers/fetch-wrapper";
import { Role, Roles } from "../../models/Role";
import { fileService } from "../../_services/file.service";
// import { alertService, onAlert } from '../_services';

export default function AddUser(props) {
  const user = JSON.parse(localStorage.getItem("userInfo"));

  const { register, handleSubmit, setValue } = useForm();
  const [errForm, setErrForm] = useState<any>();
  const params = useParams();
  const userId = props.userId ?? params.id;

  const [data, setData] = useState<any>();
  const navigate = useNavigate();

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

  function fetAllData() {
    if (!params.id) return;
    const result = fetchWrapper.get(config.apiUrl + "Auth/" + params.id);
    result.then((val) => {
      setValue("username", val.username);
      setValue("fullName", val.fullName);
      setValue("password", "");
      setValue("email", val.email);
      setValue("phone", val.phone);
      setValue("address", val.address);
      setPreview(val.avatar);
      setValue("role", val.role);

      setData(val);
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
      avatar: val.urlImage,
    };

    const formData = new FormData();
    if (selectedFile) {
      formData.append(
        "files",
        new Blob([selectedFile], { type: "image/png" }),
        selectedFile.name
      );
      dataPost.avatar = await fileService.postFile(formData);
    } else {
      dataPost.avatar = preview;
    }

    const connectApi = params.id
      ? fetchWrapper.put(config.apiUrl + "Auth/" + params.id, dataPost)
      : fetchWrapper.post(config.apiUrl + "Auth", dataPost);
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
      if (res.success == true) {
        console.log(
          "res.data.userId ,user.userId :>> ",
          res.data.id,
          user.userId
        );
        if (res.data.id == user.userId) {
          const currentUser = JSON.parse(localStorage.getItem("userInfo"));
          localStorage.removeItem("userInfo");
          localStorage.setItem(
            "userInfo",
            JSON.stringify({
              ...currentUser,
              user: {
                ...res.data,
              },
            })
          );
        }

        alertService.alert({
          content: params.id ? "Thay đổi thành công" : "Tạo mới thành công",
        });
        navigate(props.userId ? "" : "/user-management", { replace: true });
      } else {
        alertService.alert({
          content: res.title,
        });
      }
    });
  };

  return (
    <div className="container">
      {!props.userId ? <h1 className="title">Quản lý tài khoản</h1> : <></>}
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
            type="file"
            accept="image/png, image/jpeg"
            onChange={onSelectFile}
            id="imageUpload"
            className="hidden"
          />
          <label
            htmlFor="imageUpload"
            className="block border px-2 py-1 bg-slate-50 rounded"
          >
            Chọn hình ảnh
          </label>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <label className="" htmlFor="nm">
            <b>Tên Tài khoản: </b>
            <input
              id="nm"
              type="text"
              className="form-control"
              placeholder=""
              {...register("username")}
            />
            <p className="text-danger">{errForm?.Username}</p>
          </label>
          <label className="" htmlFor="fullName">
            <b>Tên đầy đủ: </b>
            <input
              id="fullName"
              type="text"
              className="form-control"
              placeholder=""
              {...register("fullName", {
                required: {
                  message: "required",
                  value: true,
                },
              })}
            />
            <p className="text-danger">{errForm?.FullName}</p>
          </label>
          <label className="" htmlFor="anm">
            <b>Mật khẩu mới: </b>
            <input
              id="anm"
              type="password"
              className="form-control"
              placeholder=""
              {...register("password")}
            />
          </label>

          <label className="" htmlFor="avb">
            <b>Email: </b>
            <input
              id="avb"
              type="text"
              className="form-control"
              placeholder=""
              {...register("email", {
                required: {
                  message: "required",
                  value: true,
                },
              })}
            />
            <p className="text-danger">{errForm?.Email}</p>
          </label>
          <label className="" htmlFor="phone">
            <b>Điện thoại: </b>
            <input
              id="phone"
              type="text"
              className="form-control"
              placeholder=""
              {...register("phone")}
            />
          </label>
          <label className="" htmlFor="addr">
            <b>Địa chỉ: </b>
            <input
              id="addr"
              type="text"
              className="form-control"
              placeholder=""
              {...register("address")}
            />
          </label>
          {!props.userId ? (
            <label className="" htmlFor="role">
              <b>Vai trò: </b>
              <select {...register("role")} id="role" className="form-control">
                {Roles.map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </select>
            </label>
          ) : (
            <></>
          )}

          <input type="submit" className="btn btn-dark mt-2" value="Lưu" />
        </div>
      </form>
    </div>
  );
}
