import listStyle from "../../styles/listStyle.module.scss";
import { AVATARDEFAULT, EVENT } from "../../_helpers/const/const";
import dayjs from "dayjs";
import EventFilter from "./event-filter.page";
import { Link } from "react-router-dom";
import { Trash } from "../../assets/icon/trash";
import { Pagination } from "@mui/material";
import DialogDetailCalenderComponent from "./dialog-detail.component";
import { EditIcon } from "../../assets/icon/edit";
import EventManagerViewmodel from "./event-manager.viewmodel";
import { eventTypeDropdown } from "../../models/event.model";
export default function EventManagerPage() {
  const { data, handleClickOpenDetail, deleteItem, fetAllData } =
    EventManagerViewmodel();

  return (
    <>
      <div className="flex items-center justify-between mb-2 bg-slate-200 pb-3">
        <div className="d-flex justify-end gap-2 w-full bg-white px-6 py-3">
          <Link to="create">
            <button className="bg-info text-white rounded-lg px-3 py-0.5">
              Tạo sự kiện
            </button>
          </Link>
        </div>
      </div>
      <div className="grid grid-cols-4 p-2">
        <EventFilter className="col-span-1" fetAllData={fetAllData}/>
        <div className="col-span-3">
          <div className="grid grid-cols-3 gap-4 px-6">
            {data.list.map((val, i) => (
              <div
                key={i}
                className={`${listStyle["book-detail"]} position-relative`}
              >
                <div
                  onClick={() => {
                    handleClickOpenDetail(val);
                  }}
                >
                  <div
                    className="h-40 bg-cover bg-no-repeat bg-center"
                    style={{
                      backgroundImage: `url(${val.urlImage || AVATARDEFAULT})`,
                    }}
                  ></div>
                </div>
                <Link
                  to={"update/" + val.id}
                  className={`${listStyle["trash-box"]} position-absolute top-0 left-0 bg-slate-400 rounded px-2 py-2 opacity-50 hover:!opacity-100`}
                >
                  <EditIcon />
                </Link>
                <div
                  onClick={(event: any) => {
                    deleteItem(val.id);
                  }}
                  className={`${listStyle["trash-box"]} position-absolute top-0 right-0 bg-slate-400 rounded px-2 py-1 opacity-50 hover:!opacity-100`}
                >
                  <Trash />
                </div>
                <div
                  onClick={() => {
                    handleClickOpenDetail(val);
                  }}
                >
                  <div className="mt-1 text-dark">
                    <h6 className="mb-2 line-clamp-2">{val.title}</h6>
                    <div className="mb-2">Tại: {val.locationName}</div>
                    <div>
                      Bắt đầu: <span className="ml-1"></span>
                      {dayjs(new Date(val.starDate)).format(
                        "HH:mm - YYYY/MM/DD"
                      )}
                    </div>
                    <div>
                      Kết thúc:
                      {dayjs(new Date(val.endDate)).format(
                        "HH:mm - YYYY/MM/DD"
                      )}
                    </div>
                    <div className="mt-2">Trạng thái: </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-2 p-2">
            {data.totalPage ? (
              <div className="flex justify-center">
                <span>
                  <Pagination
                    count={data.totalPage}
                    onChange={(_, pageNumber) => fetAllData(pageNumber)}
                  />
                </span>
              </div>
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
      <DialogDetailCalenderComponent deleteFun={deleteItem} />
    </>
  );
}
