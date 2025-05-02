import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { alertService } from "../../_services/alert.service";
import config from "../../config";
import { fetchWrapper } from "../../_helpers/fetch-wrapper";
import { Role } from "../../models/Role";
import { fileService } from "../../_services/file.service";

export default function AddUser(props) {
  const user = JSON.parse(localStorage.getItem("userInfo"));
  const Roles = [Role.Store, Role.Manager, Role.GiftStore];

  const { register, handleSubmit, setValue, watch } = useForm();
  const [errForm, setErrForm] = useState<any>();
  const params = useParams();
  const userId = props.userId ?? params.id;

  const [data, setData] = useState<any>();
  const navigate = useNavigate();

  const [selectedFile, setSelectedFile] = useState<any>();
  const [preview, setPreview] = useState();

  // Define status options with new values
  const status = [
    { key: 1, value: "Đang hoạt động" }, // Status 1: Active (can login)
    { key: 2, value: "Khóa tài khoản" }, // Status 2: Locked (cannot login)
  ];

  // Watch the status field to detect changes
  const currentStatus = watch("status");

  // Call API to update status when the status changes
  const changeStatus = () => {
    // if (!params.id || !currentStatus || props.userId === userId) return; // Skip if not in update mode, no status, or editing current user

    // // Call API to update status immediately when status changes
    // fetchWrapper
    //   .put(config.apiUrl + "Auth/" + params.id + "/Status", {
    //     status: Number(currentStatus),
    //   })
    //   .then((statusRes) => {
    //     if (!statusRes.success) {
    //       alertService.alert({
    //         content: "Cập nhật trạng thái thất bại: " + statusRes.message,
    //       });
    //       // Revert to previous status if update fails (optional)
    //       setValue("status", data.status);
    //     } else {
    //       // Update local data to reflect the new status
    //       setData((prev) => ({ ...prev, status: currentStatus }));
    //       alertService.alert({
    //         content: "Cập nhật trạng thái thành công",
    //       });
    //     }
    //   });
  }

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
      // Set the initial status value
      setValue("status", val.status);

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
      status: Number(val.status)
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

    // dataPost.status = undefined;
    // If creating a new user, set default status to 1 (Active)
    if (!params.id) {
      dataPost.status = "1"; // Default status for new user: Active
    }

    // Update user information (excluding status update since it's handled on change)
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
        // Update local storage if the updated user is the current user
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
          content: res.message,
        });
      }
    });
  };

  return (
    <div className="container">
      <form
        onSubmit={handleSubmit(savedata)}
        className="grid grid-cols-2 gap-4 jumbotron"
      >
        <div className="flex flex-column items-center gap-2">
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
        </div>

        <div className="grid grid-cols-2 gap-4">
          <label htmlFor="nm">
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
          <label htmlFor="fullName">
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
          {userId ? (
            <label htmlFor="anm">
              <b>Mật khẩu mới: </b>
              <input
                id="anm"
                type="password"
                className="form-control"
                placeholder=""
                {...register("password")}
              />
            </label>
          ) : (
            <></>
          )}

          <label htmlFor="avb">
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
          <label htmlFor="phone">
            <b>Điện thoại: </b>
            <input
              id="phone"
              type="text"
              className="form-control"
              placeholder=""
              {...register("phone")}
            />
          </label>
          <label htmlFor="addr">
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
            <label htmlFor="role">
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
          {userId &&
          user.user.role === Role.Admin &&
          props.userId !== userId ? (
            <label htmlFor="status">
              <b>Trạng thái: </b>
              <select
                {...register("status")}
                id="status"
                className="form-control"
                onChange={changeStatus}
              >
                {status.map((v) => (
                  <option key={v.key} value={v.key}>
                    {v.value}
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
