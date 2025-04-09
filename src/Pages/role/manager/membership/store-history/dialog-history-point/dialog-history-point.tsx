import { BehaviorSubject, ReplaySubject, Subject } from "rxjs";
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
import dayjs from "dayjs";
import { AVATARDEFAULT, ROUTER } from "../../../../../../_helpers/const/const";

export default function HistoryStore({ prop }) {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  const detail = prop.openPointHistory;
  return (
    <React.Fragment>
      <Dialog
        maxWidth="md"
        open={detail.storeId}
        onClose={prop.handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent sx={{ width: "60vw", p: 2 }}>
          <div className="row w-full">
            <div className="col-5">
              <div
                className="block h-full w-full bg-slate-200 bg-contain bg-no-repeat bg-center"
                style={{
                  backgroundImage: `url(${
                    detail.urlImage ? detail.urlImage : AVATARDEFAULT
                  })`,
                }}
              ></div>
            </div>
            <div className="col-7">
              <div className="mt-1 text-dark">
                <h4>{detail.productName}</h4>

                <div className="text-danger mb-2">
                  Địa chỉ: {detail?.locationName}
                </div>

                <div className="d-flex d-flex border-b pb-2 mb-3 box-author">
                  <div className="col-3">Cửa hàng:</div>
                  <div className="col-9">{detail?.storeName}</div>
                </div>

                <div className="d-flex d-flex border-b pb-2 mb-3 box-author">
                  <div className="col-3">Chủ cửa hàng:</div>
                  <div className="col-9">{detail?.userFullName}</div>
                </div>
                <div className="d-flex d-flex border-b pb-2 mb-3 box-author">
                  <div className="col-3">Giờ mở cửa:</div>
                  <div className="col-9">
                    {detail?.openingHours}
                  </div>
                </div>
                <div className="d-flex d-flex border-b pb-2 mb-3 box-author">
                  <div className="col-3">Giờ đóng cửa:</div>
                  <div className="col-9">
                    {detail?.closingHours}
                  </div>
                </div>
                {detail?.book?.storeName ? (
                  <div className="d-flex border-b pb-2 mb-3">
                    <div className="col-3">Được bán tại:</div>
                    <div className="col-9">{detail?.book?.storeName}</div>
                  </div>
                ) : (
                  <></>
                )}
                {detail?.status ? (
                  <div className="d-flex border-b pb-2 mb-3">
                    <div className="col-3">Tình trạng:</div>
                    <div className="col-9">
                      {detail?.status == 1 ? "Còn hàng" : "Sắp về hàng"}
                    </div>
                  </div>
                ) : (
                  <></>
                )}

                {detail?.book?.editionNumber ? (
                  <div className="d-flex border-b pb-2 mb-3">
                    <div className="col-3">Tái bản lần thứ:</div>
                    <div className="col-9">{detail?.book?.editionNumber}</div>
                  </div>
                ) : (
                  <></>
                )}

                {detail?.book?.editionYear ? (
                  <div className="d-flex border-b pb-2 mb-3">
                    <div className="col-3">Năm tái bản:</div>
                    <div className="col-9">{detail?.book?.editionYear}</div>
                  </div>
                ) : (
                  <></>
                )}
                {detail?.book?.categoryName ? (
                  <div className="d-flex border-b pb-2 mb-3">
                    <div className="col-3">Danh mục: </div>
                    <div className="col-9">{detail?.book?.categoryName}</div>
                  </div>
                ) : (
                  <></>
                )}
                {detail?.book?.genreName ? (
                  <div className="d-flex border-b pb-2 mb-3">
                    <div className="col-3">Thể loại: </div>
                    <div className="col-9">{detail?.book?.genreName}</div>
                  </div>
                ) : (
                  <></>
                )}
                {detail?.book?.publisherName ? (
                  <div className="d-flex border-b pb-2 mb-3">
                    <div className="col-3">Nhà xuất bản: </div>
                    <div className="col-9">{detail?.book?.publisherName}</div>
                  </div>
                ) : (
                  <></>
                )}

                {detail?.book?.distributorName ? (
                  <div className="d-flex border-b pb-2 mb-3">
                    <div className="col-3">Nhà phân phối:</div>
                    <div className="col-9">{detail?.book?.distributorName}</div>
                  </div>
                ) : (
                  <></>
                )}
              </div>
              <div>Mô tả:</div>
              <div className="max-h-20 overflow-auto">{detail.description}</div>
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={prop.handleClose}>Đóng</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
