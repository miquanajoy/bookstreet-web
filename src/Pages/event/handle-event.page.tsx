import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { alertService } from "../../_services/alert.service";
import { fileService } from "../../_services/file.service";
import { fetchWrapper } from "../../_helpers/fetch-wrapper";
import config from "../../config";
import { EVENT, LOCATION, ROUTER } from "../../_helpers/const/const";

import dayjs from "dayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers-pro/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers-pro/AdapterDayjs";
import { DateTimeRangePicker } from "@mui/x-date-pickers-pro/DateTimeRangePicker";
import { eventTypeDropdown } from "../../models/event.model";
import ShowMapComponent from "../../Components/map/show-map/showMap.component";
import { Role } from "../../models/Role";
import convertDate from "../../_helpers/converts/convertDate";
import HandleEventViewmodel from "./handle-event.viewmodel";

export default function HandleCalenderPage() {
  const userValue = JSON.parse(localStorage.getItem("userInfo"));
  const [mapValue, setMapValue] = useState({});
  const [value, setValueInint] = useState([null, null]);
  const [locations, setLocation] = useState([]);
  const [isReadOnly, setIsReadOnly] = useState(false);

  const { getLocation } = HandleEventViewmodel();
  const isDisableLocation = () => {
    const isDisable = locations.some(
      (locationDetail) => locationDetail.storeId === userValue.user.storeId
    );
    return isDisable;
  };

  const [data, setData] = useState<any>({
    locationId: 0,
    title: "",
    description: "",
    urlImage: "",
    purpose: "",
    hostName: "",
    eventType: 0,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    getValues,
    setValue,
  } = useForm({
    defaultValues: async () => {
      return await fetAllData();
    },
  });

  const navigate = useNavigate();
  const params = useParams();

  const [selectedFile, setSelectedFile] = useState<any>();
  const [preview, setPreview] = useState();

  const checkEventStatus = (startDate: string, endDate: string) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (now >= start && now <= end) {
      return 'ongoing'; // Đang diễn ra
    } else if (now > end) {
      return 'ended'; // Đã kết thúc
    }
    return 'upcoming'; // Sắp diễn ra
  };

  async function fetAllData() {
    const locations = await getLocation();

    setLocation(locations);
    const locationOfStore =
      userValue.role === Role.Store
        ? locations.find(
            (location) => location.storeId === userValue.user.storeId
          ).locationId
        : undefined;
    const eventType = userValue.role === Role.Store ? 4 : undefined;
    const hostName = userValue.role === Role.Store ? userValue.user.storeName : undefined;

    if (!params.id) return { ...data, locationId: locationOfStore, eventType, hostName };
    
    const result = await fetchWrapper.get(
      config.apiUrl + EVENT + "/" + params.id
    );

    // Check event status and set readonly
    const eventStatus = checkEventStatus(result.starDate, result.endDate);
    setIsReadOnly(eventStatus === 'ongoing' || eventStatus === 'ended');

    const locationsFound = locations.find(
      (locationDetail) => locationDetail.locationId === result.locationId
    );
    const xLocation = locationsFound?.xLocation;
    const yLocation = locationsFound?.yLocation;
    setMapValue({
      xLocation,
      yLocation,
      mapImage: locationsFound.locationImage,
    });

    setData({
      ...result,
      xLocation,
      yLocation,
      mapImage: locationsFound.locationImage,
      locationId: locationOfStore,
      eventType,
      hostName: userValue.role === Role.Store ? userValue.user.storeName : result.hostName,
    });
    setPreview(result.urlImage);

    setValueInint([
      dayjs(result.starDate).format("YYYY-MM-DD HH:mm"),
      dayjs(result.endDate).format("YYYY-MM-DD HH:mm"),
    ]);
    if (userValue.user.role == Role.Store) {
      result.eventType = eventTypeDropdown.at(-1).eventType;
      result.hostName = userValue.user.storeName; // Set hostName for Role.Store in edit mode
    }
    return result;
  }

  useEffect(() => {
    if (!watch("locationId")) return;
    const locationsFound = locations.find(
      (locationDetail) => locationDetail.locationId == getValues().locationId
    );
    const xLocation = locationsFound?.xLocation;
    const yLocation = locationsFound?.yLocation;
    setMapValue({
      xLocation,
      yLocation,
      mapImage: locationsFound?.locationImage,
    });
  }, [watch("locationId")]);

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

    setSelectedFile(e.target.files[0]);
  };

  const savedata = async (val) => {
    if (!value[0] || !value[1]) {
      alertService.alert({
        content: "Vui lòng chọn thời gian bắt đầu và kết thúc",
      });
      return;
    }

    let dataPost = val;
    dataPost.storeId = userValue.user.storeId;
    dataPost.starDate = convertDate(new Date(value[0]));
    dataPost.endDate = convertDate(new Date(value[1]));
    // Set hostName to storeName if user role is Role.Store
    if (userValue.user.role === Role.Store) {
      dataPost.hostName = userValue.user.storeName;
    }
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
    let process;
    if (params.id) {
      process = fetchWrapper.put(
        config.apiUrl + EVENT + "/" + params.id,
        dataPost
      );
    } else {
      process = fetchWrapper.postUpgrade(config.apiUrl + EVENT, dataPost);
    }

    process
      .then((val) => {
        if (val.success) {
          alertService.alert({
            content: params.id ? "Thay đổi thành công" : "Tạo mới thành công",
          });
          navigate(ROUTER.event.url, { replace: true });
        } else {
          alertService.alert({
            content: val.message,
          });
        }
      })
      .catch((e) => {});
  };

  const locationName = () => {
    const selectedLocationId = getValues("locationId");
    const selectedLocation = locations.find(
      (location) => location.locationId == selectedLocationId
    );
    return selectedLocation ? selectedLocation.locationName : "Chưa chọn vị trí";
  };

  return (
    <div className="container">
      <form
        onSubmit={handleSubmit(savedata)}
        className="grid grid-cols-3 gap-4 jumbotron p-4"
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
            disabled={isReadOnly}
          />
          {errors.urlImage && (
            <span className="text-red-500">Vui lòng chọn hình ảnh</span>
          )}
          <label
            htmlFor="imageUpload"
            className={`block border px-2 py-1 bg-slate-200 rounded ${isReadOnly ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            Chọn hình ảnh
          </label>
        </div>

        <div>
          <label className="block mb-1" htmlFor="nm">
            <b>Tên sự kiện: </b>
          </label>
          <input
            id="nm"
            type="text"
            className="form-control mb-2"
            {...register("title", { required: "Tên sự kiện là bắt buộc" })}
            disabled={isReadOnly}
          />
          {errors.title && (
            <span className="text-red-500">
              {errors.title.message as string}
            </span>
          )}

          <label className="block mb-1" htmlFor="loca">
            <b>Vị trí: </b>
          </label>
          <div className="flex items-center gap-4 mb-2">
            <select
              disabled={isDisableLocation() || isReadOnly}
              {...register("locationId", {
                required: "Vị trí là bắt buộc",
                min: { value: 1, message: "Vui lòng chọn một vị trí" },
              })}
              id="loca"
              className="form-control"
            >
              <option value="0">Chọn vị trí</option>
              {locations.map((v) => (
                <option key={v.locationId} value={v.locationId}>
                  {v.locationName}
                </option>
              ))}
            </select>
            <ShowMapComponent
              data={{ ...mapValue, locationImg: preview, text: locationName() }}
            />
          </div>
          {errors.locationId && (
            <span className="text-red-500">
              {errors.locationId.message as string}
            </span>
          )}

          <label className="block mb-1" htmlFor="anm">
            <b>Mục đích: </b>
          </label>
          <input
            id="anm"
            type="text"
            className="form-control mb-2"
            {...register("purpose", { required: "Mục đích là bắt buộc" })}
            disabled={isReadOnly}
          />
          {errors.purpose && (
            <span className="text-red-500">
              {errors.purpose.message as string}
            </span>
          )}

          <label className="block mb-1" htmlFor="avb">
            <b>Ban Tổ Chức: </b>
          </label>
          <input
            id="avb"
            type="text"
            className="form-control"
            disabled={userValue.user.role === Role.Store || isReadOnly}
            value={userValue.user.role === Role.Store ? userValue.user.storeName : undefined}
            {...register("hostName", { required: "Ban tổ chức là bắt buộc" })}
          />
          {errors.hostName && (
            <span className="text-red-500">
              {errors.hostName.message as string}
            </span>
          )}

          <div>
            <label className="block mb-1 mt-2" htmlFor="link_vid">
              <b>Link video: </b>
            </label>
            <input
              id="link_vid"
              type="text"
              className="form-control"
              {...register("urlVideo")}
              disabled={isReadOnly}
            />
          </div>
        </div>

        <div className="relative">
          <div>
            <label className="block mb-1" htmlFor="eventTpe">
              <b>Dạng sự kiện: </b>
            </label>
            <select
              disabled={userValue.user.role == Role.Store || isReadOnly}
              {...register("eventType", {
                required: "Loại sự kiện là bắt buộc",
                min: { value: 0, message: "Vui lòng chọn loại sự kiện" },
              })}
              id="eventTpe"
              className="form-control mb-2"
            >
              <option value="-1">Chọn loại sự kiện</option>
              {eventTypeDropdown.map((v) => (
                <option key={v.eventType} value={v.eventType}>
                  {v.eventName}
                </option>
              ))}
            </select>
            {errors.eventType && (
              <span className="text-red-500">
                {errors.eventType.message as string}
              </span>
            )}
          </div>

          <div className="row">
            <div className="col-6">
              <b>Ngày bắt đầu:</b>
              <div>{value[0]}</div>
            </div>
            <div className="col-6">
              <b>Ngày kết thúc:</b>
              <div>{value[1]}</div>
            </div>
          </div>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={["DateTimeRangePicker"]}>
              <DateTimeRangePicker
                localeText={{ start: "Check-in", end: "Check-out" }}
                onChange={(newValue) => {
                  setValueInint([
                    dayjs(newValue[0]).format("YYYY-MM-DD HH:mm"),
                    dayjs(newValue[1]).format("YYYY-MM-DD HH:mm"),
                  ]);
                }}
                disabled={isReadOnly}
              />
            </DemoContainer>
          </LocalizationProvider>

          <div>
            <label className="block mb-1 mt-2" htmlFor="des">
              <b>Mô tả: </b>
            </label>
            <textarea
              className="form-control min-h-30 max-h-50 mb-2"
              {...register("description")}
              disabled={isReadOnly}
            ></textarea>
          </div>

          {!isReadOnly && (
            <input
              type="submit"
              className="btn btn-dark absolute bottom-0"
              value="Lưu"
            />
          )}
        </div>
      </form>
    </div>
  );
}