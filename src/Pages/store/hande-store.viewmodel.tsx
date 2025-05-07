import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { fetchWrapper } from "../../_helpers/fetch-wrapper";
import config from "../../config";
import { Role } from "../../models/Role";
import { fileService } from "../../_services/file.service";
import { alertService } from "../../_services/alert.service";
import {
  AREA,
  AUTH,
  LOCATION,
  ROUTER,
  STORE,
  STREET,
} from "../../_helpers/const/const";
import { loadingService } from "../../_services/loading.service";

export default function HandleStoreViewmodel(props) {
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
  const [selectedFileQr, setSelectedFileQr] = useState<any>();
  const [preview, setPreview] = useState();
  const [qrPreview, setQrPreview] = useState();
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

  const onSelectQrFile = (e) => {
    if (!e.target.files || e.target.files.length === 0) {
      setSelectedFileQr(undefined);
      return;
    }

    let reader = new FileReader();
    let base64String;

    reader.onload = function () {
      base64String = reader.result;
      setQrPreview(base64String);
    };
    reader.readAsDataURL(e.target.files[0]);
    setSelectedFileQr(e.target.files[0]);
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
    if (!selectedFileQr) {
      setQrPreview(undefined);
      return;
    }

    const objectUrl: any = URL.createObjectURL(selectedFileQr);
    setQrPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFileQr]);

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
    let usersPromise: any = getOption("AUTH");
    // let usersPromise: any = getOption("Auth", {
    //   filters: [
    //     {
    //       field: "role",
    //       value: Role.Store,
    //       operand: 0,
    //     },
    //     // {
    //     //   field: "status",
    //     //   value: 1,
    //     //   operand: 0,
    //     // },
    //   ],
    // });
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
        (val.status === 1) &&
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
    setQrPreview(result.bankQrImage);

    return result;
  }

  function getOption(url, filter?) {
    return fetchWrapper.Post2GetByPaginateWithoutCall(
      config.apiUrl + url,
      -1,
      filter,
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
    const formDataQr = new FormData();
    console.log('selectedFileQr :>> ', selectedFileQr);
    if (selectedFileQr) {
      formDataQr.append(
        "files",
        new Blob([selectedFileQr], { type: "image/png" }),
        selectedFileQr.name
      );
      val.bankQrImage = await fileService.postFile(formDataQr);
    } else {
      val.bankQrImage = qrPreview ?? "";
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

    const ctx = imageCanvas.current.getContext("2d");

    locationPins
      .filter((pin) => pin.streetId == streetChoose)
      .forEach((pin) => {
        const x = pin.xLocation * imageCanvas.current.width;
        const y = pin.yLocation * imageCanvas.current.height;

        // Draw store image
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

          // Draw locationName below the image
          ctx.font = "20px Arial";
          ctx.fillStyle = "black";
          ctx.textAlign = "center"; // Center the text horizontally
          ctx.fillText(pin.locationName, x, y + 70); // Draw text below the image (50px radius + 20px offset)
        };
        img.src =
          pin.storeId == params.id ? preview ?? pin.storeImage : pin.storeImage;
      });
  }

  return {
    handleSubmit,
    savedata,
    register,
    closeHoursNow,
    openingHoursNow,
    preview,
    users,
    showLocation,
    onSelectFile,
    open,
    handleClose,
    imageCanvas,
    locations,
    selectedFileQr,
    qrPreview,
    onSelectQrFile,
  };
}