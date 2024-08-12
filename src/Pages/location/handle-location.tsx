import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { alertService } from "../../_services/alert.service";
import config from "../../config";
import { fetchWrapper } from "../../_helpers/fetch-wrapper";
import { fileService } from "../../_services/file.service";
import { LOCATION } from "../../_helpers/const/const";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { ModelStyle } from "../../_helpers/const/model.const";
import imgMapLocal from "./map-location.jpg";

export default function HandleLocation() {
  const [data, setData] = useState<any>({
    locationName: "",
    areaId: null,
    urlImage: "",

    xLocation: 0,
    yLocation: 0,
    locationImage: "",
  });
  const navigate = useNavigate();
  const { register, handleSubmit, getValues } = useForm({
    defaultValues: async () => {
      return await fetAllData();
    },
  });
  const [errForm, setErrForm] = useState<any>();
  const params = useParams();
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

  async function fetAllData() {
    const areas = await fetchWrapper.get(config.apiUrl + "Area");
    setAreas(areas);

    if (!params.id) {
      return {
        locationName: "",
        areaId: areas[0].areaId,
      };
    }

    const result = await fetchWrapper.get(
      config.apiUrl + "Location/" + params.id
    );
    setData(result);
    setPreview(result.urlImage);
    if (result.xLocation) {
      const newLocation = {
        x: result.xLocation,
        y: result.yLocation,
        name: result.locationName,
      };
      setLocationPin([newLocation]);
    }

    return result;
  }

  const savedata = async (val) => {
    setErrForm([]);
    if (locationPin.length) {
      val.xLocation = locationPin[0].x;
      val.yLocation = locationPin[0].y;
    } else {
      val.xLocation = 0;
      val.yLocation = 0;
    }

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
      process = fetchWrapper.put(
        config.apiUrl + LOCATION + "/" + params.id,
        val
      );
    } else {
      process = fetchWrapper.post(config.apiUrl + LOCATION, val);
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

  // Model choose location in map
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

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
      locationPin[0].name = getValues().locationName;
    }
  }, [getValues().locationName]);

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
      name: getValues().locationName ?? "",
    };
    setLocationPin([newLocation]);
    drawLocation(newLocation);
    // }
  }

  function completeChoosePoint() {
    handleClose();
  }
  // End Model

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
            New Image
          </label>
        </div>

        <div className="flex flex-column gap-2">
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

          <div className="d-flex items-end	pb-2">
            <div
              className="cursor-pointer bg-info text-white uppercase rounded-lg px-3 py-0.5"
              onClick={showLocation}
            >
              <b>Choose map </b>
            </div>
          </div>
          <label className="uppercase" htmlFor="area">
            <b>Area: </b>
            <select {...register("areaId")} id="area" className="form-control">
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
            <div className="mt-2">
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
