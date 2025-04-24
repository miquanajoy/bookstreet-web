import { BehaviorSubject, ReplaySubject, Subject } from "rxjs";
import { loadingService } from "../../_services/loading.service";
import { useEffect, useState } from "react";
import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import { AVATARDEFAULT, ROUTER } from "../../_helpers/const/const";
import { Roles } from "../../models/Role";
import { ModelStyle } from "../../_helpers/const/model.const";
import dayjs from "dayjs";

export class CalenderDetailService {
  $data = new BehaviorSubject(undefined);

  showDialog(content) {
    this.$data.next(content);
  }

  hiddenDialog() {
    this.$data.next(undefined);
  }
}

export const calenderDetailService = new CalenderDetailService();

export default function DialogDetailCalenderComponent(prop) {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const isBookScreen = pathname == ROUTER.book.url;

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const confirmDelete = () => {
    prop.deleteFun.deleteItem(prop.detail.id)
  }

  useEffect(() => {
    calenderDetailService.$data.subscribe({
      next: (v) => {
        if (v) {
          handleClickOpen();
        } else {
          handleClose();
        }
      },
    });
    return () => calenderDetailService.hiddenDialog()
  }, []);
  
  if (calenderDetailService.$data.value) {
    const value = calenderDetailService.$data.value;
    const detail = value;
    return (
      <React.Fragment>
        <Dialog
          maxWidth="md"
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogContent sx={{ width: "60vw", p: 2 }}>
            <div className="row w-full">
              <div className="col-5">
                <div
                  className="block h-full w-full bg-slate-200 bg-contain bg-no-repeat bg-center"
                  style={{
                    backgroundImage: `url(${detail.urlImage ? detail.urlImage : AVATARDEFAULT
                      })`,
                  }}
                ></div>
              </div>
              <div className="col-7">
                <div className="mt-1 text-dark">
                  <h4>{detail.title}</h4>

                  <div className=" mb-2">
                    Tại: {detail.locationName}
                  </div>
                  <div>Bắt đầu: <span className="ml-1"></span>
                    {dayjs(new Date(detail.starDate)).format("HH:mm - YYYY/MM/DD")}
                  </div>
                  <div>Kết thúc: {dayjs(new Date(detail.endDate)).format("HH:mm - YYYY/MM/DD")}</div>

                </div>
                <div>Mô tả:</div>
                <div className="max-h-20 overflow-auto">
                  {detail.description}
                </div>
              </div>
            </div>
          </DialogContent>
          <DialogActions>
                {/* <Button onClick={confirmDelete}>Đóng</Button> */}
              <Button onClick={handleClose}>Đóng</Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    );
  } else {
    return <></>;
  }
}
