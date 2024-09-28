import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { fetchWrapper } from "../../_helpers/fetch-wrapper";
import config from "../../config";
import { Role } from "../../models/Role";
import { fileService } from "../../_services/file.service";
import { alertService } from "../../_services/alert.service";
import {
  AREA,
  LOCATION,
  ROUTER,
  STORE,
  STREET,
} from "../../_helpers/const/const";
import { Box, Modal } from "@mui/material";
import { ModelStyle } from "../../_helpers/const/model.const";
import { loadingService } from "../../_services/loading.service";

export default function HandleStore(props) {
  const { register, handleSubmit, watch, getValues } = useForm({
    defaultValues: async () => {
      return await fetAllData();
    },
  });
  const openingHoursNow = watch("openingHours", "");
  const closeHoursNow = watch("closingHours", "");

  const [data, setData] = useState<any>({
    storeId: 0,
    storeName: "",
    locationId: 0,
    locationName: "",
    description: "",
    openingHours: "08:00",
    closingHours: "17:00",
    userId: 0,
    userFullName: "",
    createdAt: new Date(),
    urlImage: "",
    xLocation: 0,
    yLocation: 0,
    locationImage: "",
  });

  const navigate = useNavigate();
  const params = useParams();

  const idStore = props.storeId ?? params.id;

  const [selectedFile, setSelectedFile] = useState<any>();
  const [preview, setPreview] = useState();
  const [areas, setAreas] = useState<any>([]);
  const [streets, setStreets] = useState<any>([]);
  const [locations, setLocations] = useState<any>([]);
  const [users, setUsers] = useState<any>([]);

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

  useEffect(() => {
    if (!selectedFile) {
      setPreview(undefined);
      return;
    }

    const objectUrl: any = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  useEffect(() => {
    if (!locations.length || !getValues().locationId) return;
    const locationPin = locations.find(
      (location) => location.locationId == getValues().locationId
    );
    const prevValue = locations.find((location) => location.storeId == idStore);
    if (prevValue) {
      prevValue.storeImage = "";
      prevValue.storeId = 0;
    }

    locationPin.storeImage = preview;
    locationPin.storeId = idStore;
  }, [watch("locationId")]);

  async function fetAllData() {
    let areaPromise = getOption(AREA);
    let locationsPromise: any = getOption(LOCATION);

    let usersPromise: any = getOption("Auth");
    let storePrm = getOption(STORE);
    let streetPrm = getOption(STREET);

    const fetall = await fetchWrapper.AxiosAll([
      areaPromise,
      locationsPromise,
      usersPromise,
      storePrm,
      streetPrm,
    ]);

    setAreas(fetall[0].list);
    setStreets(fetall[4].list);
    locationsPromise = fetall[1].list.filter(
      (location) => !location.storeId || location.storeId == idStore
    );
    setLocationPin(fetall[1].list);
    let listStoreHasUser: number[] = fetall[3].list.map((v) => v.userId);
    setLocations(locationsPromise);

    usersPromise = fetall[2].list.filter((val) => {
      return (
        (val.role == Role.Store || val.role == Role.GiftStore) &&
        (!idStore ? !listStoreHasUser.includes(val.id) : true)
      );
    });
    setUsers(usersPromise);
    if (!idStore)
      return {
        ...data,
        locationId: locationsPromise.locationId,
      };
    const result = await fetchWrapper.get(
      config.apiUrl + STORE + "/" + idStore
    );

    listStoreHasUser = listStoreHasUser.filter((v) => v && v != result.userId);
    setLocations(locationsPromise);
    usersPromise = usersPromise.filter((val) => {
      return !listStoreHasUser.includes(val.id);
    });
    setUsers(usersPromise);

    setData(result);
    setPreview(result.urlImage);

    return result;
  }

  function getOption(url) {
    return fetchWrapper.Post2GetByPaginateWithoutCall(
      config.apiUrl + url,
      1,
      undefined,
      -1
    );
  }

  const savedata = async (val) => {
    val.locationName = val.locationId
      ? locations.find((location) => val.locationId == location.locationId)
          .locationName
      : "";
    val.userFullName = val.userId
      ? users.find((user) => val.userId == user.id).fullName
      : "";
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

    if (val.closingHours.split(":").length < 3) {
      val.closingHours = val.closingHours + ":00";
    }
    if (val.openingHours.split(":").length < 3) {
      val.openingHours = val.openingHours + ":00";
    }

    let process;
    if (idStore) {
      val.storeId = Number(idStore);
      process = fetchWrapper.put(config.apiUrl + STORE + "/" + idStore, val);
    } else {
      delete val.storeId;
      process = fetchWrapper.post(config.apiUrl + STORE, val);
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
        return;
      }
      if (res.success) {
        alertService.alert({
          content: idStore ? "Thay đổi thành công" : "Tạo mới thành công",
        });

        navigate(props.storeId ? "" : ROUTER.store.url, { replace: true });
      } else {
        alertService.alert({
          content: res.message,
        });
      }
    });
  };

  // Model choose location in map
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const imageCanvas = useRef(null);
  const [locationPin, setLocationPin] = useState([]);
  function showLocation() {
    loadingService.showLoading();
    handleOpen();
    setTimeout(() => {
      drwMap();
    }, 1000);
  }

  function drwMap() {
    const canv = imageCanvas.current.getContext("2d");
    const img = new Image();
    const imgLocation = locations.find(
      (location) => location.locationId == getValues().locationId
    ).locationImage;
    img.src = imgLocation;
    console.log("imgLocation :>> ", imgLocation);
    if (!imgLocation) {
      alert("khu vực này chưa có ảnh");
      return;
    }

    img.onload = () => {
      imageCanvas.current.width = img.width;
      imageCanvas.current.height = img.height;

      canv.drawImage(img, 0, 0);
      if (locationPin.length) {
        drawLocation();
      }
      loadingService.hiddenLoading();
    };
    img.onerror = () => {
      alertService.alert({
        content: "Không thể tải được hình ảnh",
      });
      loadingService.hiddenLoading();
    };
  }

  function drawLocation() {
    const locationPins = locationPin.map((pin) => {
      return {
        ...pin,
        streetId: areas.find((area) => area.areaId == pin.areaId).streetId,
      };
    });
    const areaChoose = locationPins.find(
      (pin) => pin.locationId == getValues().locationId
    ).areaId;

    const streetChoose = areas.find(
      (area) => area.areaId == areaChoose
    ).streetId;
    locationPins
      .filter((pin) => pin.streetId == streetChoose)
      .forEach((pin) => {
        const x = pin.xLocation * imageCanvas.current.width;
        const y = pin.yLocation * imageCanvas.current.height;
        const ctx = imageCanvas.current.getContext("2d");

        const img = new Image(100, 100);
        img.onload = function () {
          ctx.save();
          ctx.beginPath();
          ctx.arc(x, y, 50, 0, Math.PI * 2, false);
          ctx.strokeStyle = "#2465D3";
          ctx.stroke();
          ctx.clip();
          ctx.drawImage(img, x - 50, y - 50, 100, 100);
          ctx.restore();
        };
        img.src =
          pin.storeId == params.id ? preview ?? pin.storeImage : pin.storeImage;
      });
  }

  return (
    <div className="container">
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
            <label htmlFor="storeName">
              <b>Tên cửa hàng: </b>
            </label>
            <input
              id="storeName"
              type="text"
              className="form-control"
              placeholder="Store name"
              {...register("storeName")}
            />
          </div>

          {!props.storeId ? (
            <div className="h-16">
              <label htmlFor="location">
                <b>Vị trí: </b>
              </label>
              <select
                {...register("locationId")}
                id="location"
                className="form-control"
              >
                {locations.map((v) => (
                  <option key={v.locationId} value={v.locationId}>
                    {v.locationName}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <></>
          )}
          <div className="row">
            <div className="col-6">
              <label htmlFor="openH">
                <b>Giờ mở cửa </b>
              </label>
              <input
                type="time"
                {...register("openingHours")}
                id="openH"
                className="form-control"
                max={closeHoursNow}
              />
            </div>
            <div className="col-6">
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
        </div>
        {!props.storeId ? (
          <div className="d-flex flex-col gap-2">
            <div>
              <label htmlFor="User">
                <b>Chủ cửa hàng: </b>
              </label>
              <select
                {...register("userId")}
                id="User"
                className="form-control"
              >
                {users.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.fullName}
                  </option>
                ))}
              </select>
            </div>
            <div className="h-16 d-flex items-end	pb-2">
              <div
                className="cursor-pointer bg-info text-white  rounded-lg px-3 py-0.5"
                onClick={showLocation}
              >
                <b>Bản đồ</b>
              </div>
            </div>
          </div>
        ) : (
          <></>
        )}

        <div className="col-start-2 col-span-2">
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
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div className="p-6">
          <Box sx={{ ...ModelStyle, width: "80%" }}>
            <div className="overflow-auto w-100 h-70-screen">
              <canvas ref={imageCanvas}></canvas>
            </div>
            <div className="mt-2">
              <button
                onClick={handleClose}
                className="bg-info text-white  rounded-lg px-3 py-0.5"
              >
                Close
              </button>
            </div>
          </Box>
        </div>
      </Modal>
    </div>
  );
}
