import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { EditorState, ContentState, convertFromHTML } from "draft-js";
import { fetchWrapper } from "../../_helpers/fetch-wrapper";
import config from "../../config";
import { Role } from "../../models/Role";
import { fileService } from "../../_services/file.service";
import { alertService } from "../../_services/alert.service";
import { ROUTER, STORE } from "../../_helpers/const/const";

import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { ModelStyle } from "../../_helpers/const/model.const";
import imgMapLocal from "./map-location.svg";

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
  const [streets, setStreets] = useState([]);
  const [locations, setLocations] = useState([]);
  const [users, setUsers] = useState([]);
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

  async function fetAllData() {
    const streets = await getOption("Street");
    setStreets(streets);

    const locations = await getOption("Location");
    setLocations(locations);

    let users = await getOption("Auth");
    users = users.filter((val) => val.role == Role.Store);
    setUsers(users);
    if (!params.id)
      return {
        ...data,
        locationId: locations[0].locationId,
        userId: users[0].id,
      };
    const result = await fetchWrapper.get(
      config.apiUrl + STORE + "/" + params.id
    );
    setData(result);
    setPreview(result.urlImage);
    if (result.xLocation) {
      const newLocation = {
        x: result.xLocation,
        y: result.yLocation,
        name: result.storeName,
      };
      setLocationPin([newLocation]);
    }

    // const blocksFromHTML = convertFromHTML(result.description ?? "");
    // const state = ContentState.createFromBlockArray(
    //   blocksFromHTML.contentBlocks,
    //   blocksFromHTML.entityMap
    // );
    // setEditorState(EditorState.createWithContent(state));
    return result;
  }

  function getOption(url) {
    return fetchWrapper.get(config.apiUrl + url);
  }

  const savedata = async (val) => {
    if (locationPin.length) {
      val.xLocation = locationPin[0].x;
      val.yLocation = locationPin[0].y;
    } else {
      val.xLocation = 0;
      val.yLocation = 0;
    }
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

  // Model
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  // End Model

  const imageCanvas = useRef(null);
  const [locationPin, setLocationPin] = useState([]);
  const [canvas, setCanvas] = useState<any>();
  const [imgMap, setImgMap] = useState<any>();

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
    ctx.arc(x, y, 5, 0, 2 * Math.PI);
    ctx.fillStyle = "red";
    ctx.fill();
    ctx.closePath();
    ctx.font = "20px Arial";
    ctx.fillText(pin.name, x, y);
  }

  function clearAllLocations() {
    setLocationPin([]);
    const canv = imageCanvas.current.getContext("2d");
    const img = new Image();
    img.src = imgMapLocal;

    img.onload = () => {
      imageCanvas.current.width = img.width;
      imageCanvas.current.height = img.height;

      canv.drawImage(img, 0, 0);
    };
  }

  useEffect(() => {
    if (locationPin.length) {
      locationPin[0].name = getValues().storeName;
    }
  }, [getValues().storeName]);

  function choosePoint(event) {
    if (locationPin.length) {
      const cf = window.confirm("delete previous location?");
      if (cf) {
        clearAllLocations();
        return;
      }
    }
    const rect = imageCanvas.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const relativeX = x / imageCanvas.current.width;
    const relativeY = y / imageCanvas.current.height;

    // const name = prompt("Nhập tên cho vị trí này:");
    // if (name) {
    const newLocation = {
      x: relativeX,
      y: relativeY,
      name: getValues().storeName ?? "",
    };
    setLocationPin([newLocation]);
    drawLocation(newLocation);
    // }
  }

  function completeChoosePoint() {
    handleClose();
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
              <b>Choose map </b>
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
              <canvas
                ref={imageCanvas}
                onClick={choosePoint}
                // style="image-rendering: auto"
              ></canvas>
            </div>
            <div>
              <button
                onClick={() => {
                  clearAllLocations();
                }}
                className="bg-info text-white uppercase rounded-lg px-3 py-0.5"
              >
                Clean all points
              </button>
              <button
                onClick={() => {
                  completeChoosePoint();
                }}
                className="bg-info text-white uppercase rounded-lg px-3 py-0.5 ml-2"
              >
                Complete
              </button>
              {/* </div> */}
            </div>
          </Box>
        </div>
      </Modal>
    </div>
  );
}
