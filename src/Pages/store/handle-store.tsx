import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { EditorState, ContentState, convertFromHTML } from "draft-js";
import { fetchWrapper } from "../../_helpers/fetch-wrapper";
import config from "../../config";
import { Role } from "../../models/Role";
import { fileService } from "../../_services/file.service";
import { alertService } from "../../_services/alert.service";
import { ROUTER, STORE } from "../../_helpers/const/const";
import imgMapLocal from "../location/map-location.jpg";
import { Box, Modal } from "@mui/material";
import { ModelStyle } from "../../_helpers/const/model.const";

export default function HandleStore() {
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

  const [selectedFile, setSelectedFile] = useState<any>();
  const [preview, setPreview] = useState();
  const [streets, setStreets] = useState<any>([]);
  const [locations, setLocations] = useState<any>([]);
  const [users, setUsers] = useState<any>([]);
  const [editorState, setEditorState] = useState(() => {
    const content = ContentState.createFromText("");
    return EditorState.createWithContent(content);
  });

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
    if(!locations.length || !getValues().locationId) return
    const locationFound = locations.find(
      (location) => location.locationId == getValues().locationId
    );
    const newLocation = {
      x: locationFound.xLocation,
      y: locationFound.yLocation,
      name: getValues().storeName,
    };
    setLocationPin([newLocation])
  }, [watch("locationId"), watch("storeName")])


  async function fetAllData() {
    let streetsPromise = getOption("Street");
    let locationsPromise = getOption("Location");
    
    let usersPromise = getOption("Auth");
    const fetall = await axios.all([
      streetsPromise,
      locationsPromise,
      usersPromise,
    ]);

    setStreets(fetall[0].list);

    locationsPromise = fetall[1].list.filter(
      (location) => !location.storeId || location.storeId == params.id
    );
    setLocations(locationsPromise);

    usersPromise = fetall[2].list.filter((val) => val.role == Role.Store);
    setUsers(usersPromise);
    if (!params.id)
      return {
        ...data
      };
    const result = await fetchWrapper.get(
      config.apiUrl + STORE + "/" + params.id
    );
    setData(result);
    setPreview(result.urlImage);

    return result;
  }

  function getOption(url) {
    return fetchWrapper.Post2GetByPaginate(
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
    val.userFullName = users.find((user) => val.userId == user.id).fullName;
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
    if (params.id) {
      val.storeId = params.id;
      process = fetchWrapper.put(config.apiUrl + STORE + "/" + params.id, val);
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
      alertService.alert({
        content: params.id ? "Update success" : "Create success",
      });
      navigate(ROUTER.store.url, { replace: true });
    });
  };

  // Model choose location in map
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const imageCanvas = useRef(null);
  const [locationPin, setLocationPin] = useState([]);
  function showLocation() {
    handleOpen();
    setTimeout(() => {
      drwMap();
      setTimeout(() => {
        if (locationPin.length) {
          drawLocation(locationPin[0]);
        }
      }, 1000);
    }, 1000);
  }

  function drwMap() {
    const canv = imageCanvas.current.getContext("2d");
    const img = new Image();
    img.src = imgMapLocal;

    img.onload = () => {
      imageCanvas.current.width = img.width;
      imageCanvas.current.height = img.height;

      canv.drawImage(img, 0, 0);
    };
  }

  function drawLocation(pin) {
    const x = pin.x * imageCanvas.current.width;
    const y = pin.y * imageCanvas.current.height;
    const ctx = imageCanvas.current.getContext("2d");
    ctx.beginPath();
    ctx.closePath();
    ctx.font = "20px Arial";
    ctx.fillText(pin.name, x - 60, y + 65);
 
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
    img.src = preview;
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
            New Image
          </label>
        </div>
        <div className="d-flex flex-col gap-2">
          <div>
            <label htmlFor="storeName">
              <b>Store name: </b>
            </label>
            <input
              id="storeName"
              type="text"
              className="form-control"
              placeholder="Store name"
              {...register("storeName")}
            />
          </div>

          <div className="h-16">
            <label htmlFor="location">
              <b>Location: </b>
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
          <div>
            <label htmlFor="openH">
              <b>Open hour: </b>
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
            <label htmlFor="User">
              <b>User: </b>
            </label>
            <select {...register("userId")} id="User" className="form-control">
              {users.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.fullName}
                </option>
              ))}
            </select>
          </div>
          <div className="h-16 d-flex items-end	pb-2">
            <div
              className="cursor-pointer bg-info text-white uppercase rounded-lg px-3 py-0.5"
              onClick={showLocation}
            >
              <b>View map </b>
            </div>
          </div>
          <div>
            <label htmlFor="closH">
              <b>Close hour: </b>
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
          <label htmlFor="avb">
            <b>Description: </b>
          </label>
          <textarea
            className="form-control min-h-30 max-h-50"
            {...register("description")}
          ></textarea>
          <input type="submit" className="btn btn-success mt-12" value="Save" />
        </div>
      </form>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div className="p-6">
          <Box sx={ModelStyle}>
            <div className="overflow-auto w-100 h-70-screen">
              <canvas ref={imageCanvas}></canvas>
            </div>
            <div className="mt-2">
              <button
                onClick={handleClose}
                className="bg-info text-white uppercase rounded-lg px-3 py-0.5"
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
