import { Box, Modal } from "@mui/material";
import { ModelStyle } from "../../_helpers/const/model.const";
import HandleStoreViewmodel from "./hande-store.viewmodel";

export default function HandleStore(props) {
  const {
    handleSubmit,
    savedata,
    register,
    closeHoursNow,
    openingHoursNow,
    preview,
    qrPreview,
    users,
    showLocation,
    onSelectFile,
    onSelectQrFile,
    open,
    handleClose,
    imageCanvas,
    locations,
  } = HandleStoreViewmodel(props);

  return (
    <div className="container">
      <form
        onSubmit={handleSubmit(savedata)}
        className="grid grid-cols-3 gap-2 jumbotron mt-4"
      >
        <div className="row-span-1 flex flex-column items-center gap-2">
          {/* <div>Avatar</div> */}
          <label
            htmlFor="imageUpload"
            className="block h-52 w-52 bg-slate-200 bg-contain bg-no-repeat bg-center"
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
            className="block w-32 border px-2 py-1 bg-slate-200 text-center rounded"
          >
            Chọn hình ảnh
          </label>
        </div>
        <div className="row-span-1 flex flex-column items-center gap-2">
          {/* <div>Qr ngân hàng</div> */}
          <label
            htmlFor="imageUploadQr"
            className="block h-52 w-52 bg-slate-200 bg-contain bg-no-repeat bg-center"
            style={{ backgroundImage: "url(" + qrPreview + ")" }}
          ></label>
          <input
            type="file"
            onChange={onSelectQrFile}
            id="imageUploadQr"
            accept="image/png, image/jpeg"
            className="hidden"
          />
          <label
            htmlFor="imageUploadQr"
            className="block w-32 border px-2 py-1 bg-slate-200 text-center rounded"
          >
            Chọn Qr
          </label>
        </div>
        <div className="d-flex flex-col gap-2">
          <div>
            <label htmlFor="storeName">
              <b>Tên cửa hàng: </b>
            </label>
            <input
              id="storeName"
              type="text"
              className="form-control"
              placeholder="Store name"
              {...register("storeName")}
            />
          </div>

          {!props.storeId ? (
            <div>
              <div className="d-flex w-full justify-between">
                <div className="w-4/6">
                  <label htmlFor="location">
                    <b>Vị trí: </b>
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
                <div className="h-16 d-flex items-end	pb-2">
                  <div
                    className="cursor-pointer bg-info text-white  rounded-lg px-3 py-0.5"
                    onClick={showLocation}
                  >
                    <b>Bản đồ</b>
                  </div>
                </div>
              </div>
              <div className="d-flex flex-col gap-2">
                <div>
                  <label htmlFor="User">
                    <b>Chủ cửa hàng: </b>
                  </label>
                  <select
                    {...register("userId")}
                    id="User"
                    className="form-control"
                  >
                    {users.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.fullName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          ) : (
            <></>
          )}
          <div className="row">
            <div className="col-6">
              <label htmlFor="openH">
                <b>Giờ mở cửa </b>
              </label>
              <input
                type="time"
                {...register("openingHours")}
                id="openH"
                className="form-control"
                max={closeHoursNow}
              />
            </div>
            <div className="col-6">
              <label htmlFor="closH">
                <b>Giờ đóng cửa: </b>
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
        </div>
        <div className="col-start-0 col-span-2 pl-6">
          <label htmlFor="avb">
            <b>Mô tả: </b>
          </label>
          <textarea
            className="form-control min-h-30 max-h-50"
            {...register("description")}
            rows={5}
          ></textarea>
        </div>
        <div className="d-flex flex-col  gap-2 col-span-1">
          <div>
            <label htmlFor="bankName">
              <b>Tên ngân hàng: </b>
            </label>
            <input
              id="bankName"
              type="text"
              className="form-control"
              placeholder="Bank Name"
              {...register("bankName")}
            />
          </div>
          <div>
            <label htmlFor="bankAccountNumberid">
              <b>Số tài khoản ngân hàng: </b>
            </label>
            <input
              id="bankAccountNumberid"
              type="text"
              className="form-control"
              placeholder="0904521699"
              {...register("bankAccountNumber")}
            />
          </div>
        </div>
        <div className="col-start-0 col-span-3 pl-6">
          <input
            type="submit"
            className="btn btn-success mt-4 mb-4 float-right"
            value="Lưu"
          />
        </div>
      </form>
      <Modal
        sx={{ paddingBottm: "0px" }}
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div className="p-6">
          <Box sx={{ ...ModelStyle, width: "80%" }}>
            <div className="overflow-auto w-100 h-70-screen">
              <canvas ref={imageCanvas}></canvas>
            </div>
            <div className="mt-2 p-2">
              <button
                onClick={handleClose}
                className="bg-info text-white  rounded-lg px-3 py-0.5"
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
