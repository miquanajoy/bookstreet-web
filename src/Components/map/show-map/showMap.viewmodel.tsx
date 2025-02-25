import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { loadingService } from "../../../_services/loading.service";
import { alertService } from "../../../_services/alert.service";

export default function ShowMapViewModel(props) {
  console.log("prop :>> ", props);

  const { mapImage, xLocation, yLocation } = props.data;
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
    img.src = mapImage;

    img.onload = () => {
      loadingService.hiddenLoading();

      imageCanvas.current.width = img.width;
      imageCanvas.current.height = img.height;
      canv.drawImage(img, 0, 0);
      if (xLocation && yLocation) {
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
    const x = xLocation * imageCanvas.current.width;
    console.log('x :>> ', x);
    const y = yLocation * imageCanvas.current.height;
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
    img.src = mapImage;
  }

  function completeChoosePoint() {
    handleClose();
  }
  // End Model

  return {
    open,
    imageCanvas,
    handleOpen,
    handleClose,
    showLocation,
    completeChoosePoint,
  };
}
