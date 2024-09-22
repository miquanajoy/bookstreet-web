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
import { useLocation } from "react-router-dom";
import { ROUTER } from "../../_helpers/const/const";
import { Roles } from "../../models/Role";

export class DialogDetailService {
  $data = new BehaviorSubject(undefined);

  showDialog(content) {
    this.$data.next(content);
  }

  hiddenDialog() {
    this.$data.next(undefined);
  }
}

export const dialogDetailService = new DialogDetailService();

export default function DialogDetailComponent(prop) {
  const user = JSON.parse(localStorage.getItem("userInfo"));

  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const isBookScreen = pathname == ROUTER.book.url;

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    dialogDetailService.$data.subscribe({
      next: (v) => {
        if (v) {
          handleClickOpen();
        } else {
          handleClose();
        }
      },
    });
  }, []);
  if (dialogDetailService.$data.value) {
    const value = dialogDetailService.$data.value;
    const detail = {
      title: value.productName,
      image: value.urlImage,
      authors: isBookScreen ? value.AuthorName?.split(", ") : "",
      storeName: value.storeName,
      price: value.price,
      description: value.description,
    };
    return (
      <React.Fragment>
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{detail.title}</DialogTitle>
          <DialogContent>
            <div className="row">
              <div className="col-6">
                <div
                  className="block h-52 w-52 bg-slate-50 bg-contain bg-no-repeat bg-center"
                  style={{ backgroundImage: "url(" + detail.image + ")" }}
                ></div>
              </div>
              <div className="col-6">
                <div className="mt-1 text-dark">
                <div>{detail.price} vnd</div>

                  {isBookScreen ? (
                    <div>
                      {detail?.authors ? (
                        <div className="box-author">
                          Tác giả: {detail?.authors}
                        </div>
                      ) : (
                        <></>
                      )}
                      {user.role == Roles[0] ? (
                        <div>Được bán tại: {detail.storeName}</div>
                      ) : (
                        <></>
                      )}
                    </div>
                  ) : (
                    <></>
                  )}
                </div>
                <div className="">
                  <div>Mô tả</div>
                  <div>{detail.description}</div>
                </div>
              </div>
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Đóng</Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    );
  } else {
    return <></>;
  }
}
