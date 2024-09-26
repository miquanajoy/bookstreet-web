import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { alertService } from "../../_services/alert.service";
import config from "../../config";
import { fetchWrapper } from "../../_helpers/fetch-wrapper";
import { fileService } from "../../_services/file.service";
import { AREA, LOCATION, STREET } from "../../_helpers/const/const";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { ModelStyle } from "../../_helpers/const/model.const";
import { loadingService } from "../../_services/loading.service";

export default function HandleLocation() {
  const [data, setData] = useState<any>({
    locationName: "",
    areaId: 0,
    urlImage: "",

    xLocation: 0,
    yLocation: 0,
    locationImage: "",
    streetId: 0,
  });

  const navigate = useNavigate();
  const { register, handleSubmit, getValues,setValue, watch } = useForm({
    defaultValues: async () => {
      return await fetAllData();
    },
  });

  const [errForm, setErrForm] = useState<any>();
  const params = useParams();
  const [areas, setAreas] = useState({
    data: [],
    filterData: [],
  });
  const [streets, setStreets] = useState([]);
  const [locations, setLocations] = useState([]);

  const [selectedFile, setSelectedFile] = useState<any>();
  const [preview, setPreview] = useState();

  // Start Effect
  useEffect(() => {
    if (!getValues().streetId) return;

    const areasFilter = areas.data.filter(
      (area) => area.streetId == getValues().streetId
    );
    
    setAreas((prevAreas) => ({
      ...prevAreas,
      filterData: areasFilter,
    }));
    setValue("areaId", areasFilter[0].areaId)
    drawLocation()

    // console.log("locationPin :>> ", locationPin);
    // let locationPinCurrent = locationPin.filter((val) => val.locationId);

    // const locationPintDetail = locationPin.find(
    //   (val) => val.locationId == params.id && params.id
    // );
    // const newLocation = {
    //   xLocation: 0,
    //   yLocation: 0,
    //   locationName: getValues().locationName ?? "",
    //   areaId: getValues().areaId
    // };

    // if (locationPintDetail) {
    //   locationPintDetail.xLocation = newLocation.xLocation;
    //   locationPintDetail.yLocation = newLocation.yLocation;
    //   locationPintDetail.locationName = newLocation.locationName;
    //   setLocationPin([...locationPinCurrent]);
    // } else {
    //   setLocationPin([...locationPinCurrent]);
    // }
  }, [watch("streetId")]);

  // useEffect(() => {
  //   let locationPinCurrent = locationPin.filter((val) => val.locationId);

  //   const locationPintDetail = locationPinCurrent.find(
  //     (val) => val.locationId == params.id && params.id
  //   );
  //   const newLocation = {
  //     xLocation,
  //     yLocation,
  //     locationName: getValues().locationName ?? "",
  //     areaId: getValues().areaId,
  //   };
  //   console.log("getValues().areaId :>> ", getValues().areaId);
  //   if (locationPintDetail) {
  //     locationPintDetail.xLocation = newLocation.xLocation;
  //     locationPintDetail.yLocation = newLocation.yLocation;
  //     locationPintDetail.locationName = newLocation.locationName;
  //     locationPintDetail.areaId = newLocation.areaId;
  //     setLocationPin([...locationPinCurrent]);
  //   } else {
  //     setLocationPin([...locationPinCurrent, newLocation]);
  //   }
  // }, [watch("areaId")]);

  // End Effect

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
    let locationsPromise: any = getOption(LOCATION);

    let areas = getOption(AREA);
    let streets: any = getOption(STREET);
    const allApiResult = await fetchWrapper.AxiosAll([
      areas,
      streets,
      locationsPromise,
    ]);
    // .then((v) => {
    const areasFilter = allApiResult[0].list.filter(
      (area) => area.streetId == allApiResult[0].list[0].streetId
    );

    setAreas({
      data: allApiResult[0].list,
      filterData: areasFilter,
    });

    setStreets(allApiResult[1].list);
    streets = allApiResult[1].list;
    areas = allApiResult[0].list;
    locationsPromise = allApiResult[2].list;

    setLocationPin(locationsPromise);
    setLocations(locationsPromise);
    if (!params.id) {
      return {
        ...data,
        streetId: streets[0].streetId,
        areaId: areas[0].areaId,
      };
    }

    const result = await fetchWrapper.get(
      config.apiUrl + LOCATION + "/" + params.id
    );
    setData(result);
    setPreview(result.urlImage);
    const streetId = result.locationImage
      ? streets.find((street) => street.urlImage == result.locationImage)
          .streetId
      : streets[0].streetId;
    return {
      ...result,
      streetId,
    };

    function getOption(url) {
      return fetchWrapper.Post2GetByPaginateWithoutCall(
        config.apiUrl + url,
        1,
        undefined,
        -1
      );
    }
  }

  const savedata = async (val) => {
    setErrForm([]);
    if (locationPin.length && params.id) {
      const locationPinDetail = locationPin.find(
        (val) => val.locationId == params.id
      );
      val.xLocation = locationPinDetail.xLocation;
      val.yLocation = locationPinDetail.yLocation;
    } else {
      val.xLocation = locationPin[locationPin.length - 1].xLocation;
      val.yLocation = locationPin[locationPin.length - 1].yLocation;
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

    val.locationImage = streets.find(
      (street) => street.streetId == val.streetId
    ).urlImage;
    let process;
    if (params.id) {
      process = fetchWrapper.put(config.apiUrl + LOCATION + "/" + params.id, {
        ...val,
        events: [],
      });
    } else {
      process = fetchWrapper.post(config.apiUrl + LOCATION, {
        ...val,
        events: [],
      });
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
        content: params.id ? "Thay đổi thành công" : "Tạo mới thành công",
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

  function showLocation() {
    handleOpen();
    loadingService.showLoading();

    setTimeout(() => {
      drwMap();
    }, 1000);
  }

  function drwMap() {
    const canv = imageCanvas.current.getContext("2d");
    const img = new Image();
    img.src = streets.find(
      (street) => street.streetId == getValues().streetId
    )?.urlImage;

    img.onload = () => {
      loadingService.hiddenLoading();

      imageCanvas.current.width = img.width;
      imageCanvas.current.height = img.height;
      canv.drawImage(img, 0, 0);
      if (locationPin.length) {
        drawLocation();
      }
    };
    img.onerror = () => {
      loadingService.hiddenLoading();
      alertService.alert({
        content: "Không thể tải được hình ảnh",
      });
    };
  }

  function drawLocation() {
    if (!imageCanvas.current) return;
    const locationPins = locationPin.map((pin) => {
      let streetId = areas.data.find(
        (area) => area.areaId == pin.areaId
      )?.streetId;
      if (params.id && pin.locationId == params.id) {
        streetId = areas.data.find(
          (area) => area.areaId == getValues().areaId
        )?.streetId;
      }
      return {
        ...pin,
        streetId,
      };
    });
    locationPins
      .filter((pin) => pin.streetId == getValues().streetId)
      .forEach((pin) => {
        const x = pin.xLocation * imageCanvas.current.width;
        const y = pin.yLocation * imageCanvas.current.height;
        const ctx = imageCanvas.current.getContext("2d");

        ctx.beginPath();
        ctx.arc(x, y, 5, 0, 2 * Math.PI);
        ctx.fillStyle = "red";
        ctx.fill();
        ctx.closePath();
        ctx.font = "20px Arial";
        ctx.fillText(pin.locationName, x, y);
      });
  }

  useEffect(drawLocation, [locationPin]);

  function clearAllLocations() {
    setLocationPin([]);
    const canv = imageCanvas.current.getContext("2d");
    const img = new Image();
    img.src = streets.find(
      (street) => street.streetId == getValues().streetId
    )?.urlImage;

    img.onload = () => {
      imageCanvas.current.width = img.width;
      imageCanvas.current.height = img.height;

      canv.drawImage(img, 0, 0);
    };
  }

  // useEffect(() => {
  //   if (locationPin.length) {
  //     const locatioinPintDetail = locationPin.find(
  //       (val) => val.locationId == params.id
  //     );
  //     if (locatioinPintDetail) {
  //       locatioinPintDetail.locationName = getValues().locationName;
  //     } else {

  //       locationPin[locationPin.length - 1].locationName
  //       .locationName =
  //       //   getValues().locationName;
  //     }
  //   }
  // }, [watch("locationName")]);

  function choosePoint(event) {
    let locationPinCurrent = locationPin.filter((val) => val.locationId);
    const canv = imageCanvas.current.getContext("2d");
    const img = new Image();
    img.src = streets.find(
      (street) => street.streetId == getValues().streetId
    )?.urlImage;
    loadingService.showLoading();
    img.onload = () => {
      loadingService.hiddenLoading();

      imageCanvas.current.width = img.width;
      imageCanvas.current.height = img.height;

      canv.drawImage(img, 0, 0);

      const rect = imageCanvas.current.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const xLocation = x / imageCanvas.current.width;
      const yLocation = y / imageCanvas.current.height;

      const locationPintDetail = locationPinCurrent.find(
        (val) => val.locationId == params.id && params.id
      );
      const newLocation = {
        xLocation,
        yLocation,
        locationName: getValues().locationName ?? "",
        areaId: getValues().areaId,
      };
      if (locationPintDetail) {
        locationPintDetail.xLocation = newLocation.xLocation;
        locationPintDetail.yLocation = newLocation.yLocation;
        locationPintDetail.locationName = newLocation.locationName;
        locationPintDetail.areaId = newLocation.areaId;
        setLocationPin([...locationPinCurrent]);
      } else {
        setLocationPin([...locationPinCurrent, newLocation]);
      }
    };
  }

  function completeChoosePoint() {
    handleClose();
  }
  // End Model

  return (
    <div className="container">
      <h1 className="title">Quản lý vị trí</h1>
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

        <div className="flex flex-column gap-2">
          <label className="" htmlFor="nm">
            <b>Tên vị trí: </b>
            <input
              id="nm"
              type="text"
              className="form-control"
              placeholder="Tên vị trí"
              {...register("locationName", {
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
          <label className="" htmlFor="area">
            <b>Khu vực: </b>
            <select {...register("areaId")} id="area" className="form-control">
              {areas.filterData.map((v) => (
                <option key={v.areaId} value={v.areaId}>
                  {v.areaName}
                </option>
              ))}
            </select>
          </label>

          <div className="d-flex items-end pb-2 mt-1">
            <div
              className="cursor-pointer bg-info text-white  rounded-lg px-3 py-0.5"
              onClick={showLocation}
            >
              <b>Xem bản đồ</b>
            </div>
          </div>
          <div>
            <input type="submit" className="btn btn-dark mt-2" value="Lưu" />
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
          <Box sx={{ ...ModelStyle, width: "80%" }}>
            <div className="overflow-auto w-100 h-70-screen">
              <canvas ref={imageCanvas} onClick={choosePoint}></canvas>
            </div>
            <div className="mt-2">
             
              <button
                onClick={() => {
                  completeChoosePoint();
                }}
                className="bg-info text-white  rounded-lg px-3 py-0.5 ml-2"
              >
                Hoàn tất
              </button>
              {/* </div> */}
            </div>
          </Box>
        </div>
      </Modal>
    </div>
  );
}
