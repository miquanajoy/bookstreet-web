import { Box, Modal } from "@mui/material";
import ShowMapViewModel from "./showMap.viewmodel";
import { ModelStyle } from "../../../_helpers/const/model.const";

export default function ShowMapComponent(prop) {
  console.log('6, prop :>> ', 6, prop);
  const {
    open,
    imageCanvas,
    handleOpen,
    handleClose,
    showLocation,
    completeChoosePoint,
  } = ShowMapViewModel(prop);
  return (
    <>
      <div className="h-8 text-nowrap px-6 font-bold cursor-pointer bg-info text-white rounded-lg py-0.5"
          onClick={showLocation}
        >
          Xem bản đồ
      </div>
      <Modal
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
                onClick={() => {
                  completeChoosePoint();
                }}
                className="bg-info text-white  rounded-lg px-3 py-0.5 ml-2"
              >
                Đóng
              </button>
            </div>
          </Box>
        </div>
      </Modal>
    </>
  );
}
