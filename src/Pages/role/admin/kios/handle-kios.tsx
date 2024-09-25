import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import {
  KIOS,
  LOCATION,
  ROUTER,
  STORE,
  STREET,
} from "../../../../_helpers/const/const";
import { Role } from "../../../../models/Role";
import config from "../../../../config";
import { fetchWrapper } from "../../../../_helpers/fetch-wrapper";
import { fileService } from "../../../../_services/file.service";
import { alertService } from "../../../../_services";
import { Box, Modal } from "@mui/material";
import { ModelStyle } from "../../../../_helpers/const/model.const";
import { loadingService } from "../../../../_services/loading.service";

export default function HandleKios() {
  const { register, handleSubmit, watch, getValues } = useForm({
    defaultValues: async () => {
      return await fetAllData();
    },
  });

  const [data, setData] = useState<any>({
    kiosId: 0,
    kiosName: "",
    locationId: 0,
  });

  const navigate = useNavigate();
  const params = useParams();

  const [locations, setLocations] = useState<any>([]);

  async function fetAllData() {
    let locationsPromise: any = getOption(LOCATION);
    const fetall = await fetchWrapper.AxiosAll([locationsPromise]);

    locationsPromise = fetall[0].list.filter(
      (location) =>
        (!location.kiosId || location.kiosId == params.id) && !location.storeId
    );
    setLocations(locationsPromise);
    if (!params.id)
      return {
        ...data,
        locationId: locationsPromise.locationId,
      };

    const result = await fetchWrapper.get(
      config.apiUrl + KIOS + "/" + params.id
    );

    setData(result);

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
    val.locationName = locations.find(
      (location) => val.locationId == location.locationId
    ).locationName;

    let process;
    if (params.id) {
      val.kiosId = params.id;
      process = fetchWrapper.put(config.apiUrl + KIOS + "/" + params.id, val);
    } else {
      delete val.kiosId;
      process = fetchWrapper.post(config.apiUrl + KIOS, val);
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
          content: params.id ? "Thay đổi thành công" : "Tạo mới thành công",
        });
      } else {
        alertService.alert({
          content: res.message,
        });
      }
      navigate(ROUTER.kios.url, { replace: true });
    });
  };

  // Model choose location in map
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const imageCanvas = useRef(null);

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
    img.src = locations.find(
      (location) => location.locationId == getValues().locationId
    )?.locationImage;
    img.onload = () => {
      imageCanvas.current.width = img.width;
      imageCanvas.current.height = img.height;

      canv.drawImage(img, 0, 0);
      drawLocation();
      loadingService.hiddenLoading();
    };
    img.onerror = () => {
      loadingService.hiddenLoading();
      alertService.alert({
        content: "Không thể tải được hình ảnh",
      });
    };
  }

  function drawLocation() {
    const locationDeltail = locations.find(
      (location) => location.locationId == getValues().locationId
    );
    const pin = {
      x: locationDeltail.xLocation,
      y: locationDeltail.yLocation,
      name: locationDeltail.locationName,
    };
    const x = pin.x * imageCanvas.current.width;
    const y = pin.y * imageCanvas.current.height;
    const ctx = imageCanvas.current.getContext("2d");
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, 2 * Math.PI);
    ctx.fillStyle = "red";
    ctx.fill();
    ctx.closePath();
    ctx.font = "20px Arial";
    ctx.fillText(pin.name, x, y);
  }
  // End Model

  return (
    <div className="col-10 mx-auto mt-4">
      <h1>
        {params.id
          ? `Thay đổi thông tin ` + ROUTER.kios.url
          : `Tạo mới ` + ROUTER.kios.url}
      </h1>
      <form
        onSubmit={handleSubmit(savedata)}
        className="grid grid-cols-3 gap-2 jumbotron mt-4"
      >
        <div className="d-flex flex-col gap-2">
          <div>
            <label htmlFor="kiosName">
              <b>Tên {ROUTER.kios.name.toLowerCase()}: </b>
            </label>
            <input
              id="kiosName"
              type="text"
              className="form-control"
              placeholder="Kios name"
              {...register("kiosName")}
            />
          </div>

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
          <div className="d-flex items-end pb-2 mt-1">
            <div
              className="cursor-pointer bg-info text-white  rounded-lg px-3 py-0.5"
              onClick={showLocation}
            >
              <b>Xem bản đồ</b>
            </div>
          </div>
          <input type="submit" className="btn btn-success mt-4" value="Lưu" />
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
          </Box>
        </div>
      </Modal>
    </div>
  );
}
