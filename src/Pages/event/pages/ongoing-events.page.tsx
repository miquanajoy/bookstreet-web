import React, { useState } from 'react';
import { Link } from "react-router-dom";
import { AVATARDEFAULT } from "../../../_helpers/const/const";
import listStyle from "../../../styles/listStyle.module.scss";
import { Pagination } from "@mui/material";
import dayjs from "dayjs";
import EventManagerViewmodel from "./event-manager.viewmodel";
import EventParticipants from '../components/EventParticipants';

export default function OngoingEventsPage() {
  const {
    data,
    fetAllData,
    eventStatus,
    setEventStatus,
  } = EventManagerViewmodel();

  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
  const [showParticipants, setShowParticipants] = useState(false);

  React.useEffect(() => {
    // Set status to "Đang diễn ra" (1) and fetch data
    setEventStatus("1");
    fetAllData(1, undefined, "1");
  }, []);

  const handleEventClick = (eventId: number) => {
    setSelectedEventId(eventId);
    setShowParticipants(true);
  };

  const handleCloseParticipants = () => {
    setShowParticipants(false);
    setSelectedEventId(null);
  };

  return (
    <>
      <div className="flex items-center justify-between mb-2 bg-slate-200 pb-3">
        <div className="d-flex justify-end gap-2 w-full bg-white px-6 py-3">
          <Link to="/event-management">
            <button className="bg-info text-white rounded-lg px-3 py-0.5">
              Quay lại
            </button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 px-6">
        {data.list.map((val) => (
          <div
            key={val.id}
            className={`${listStyle["book-detail"]} position-relative cursor-pointer`}
            onClick={() => handleEventClick(val.id)}
          >
            <div>
              <div
                className="h-40 bg-cover bg-no-repeat bg-center"
                style={{
                  backgroundImage: `url(${val.urlImage || AVATARDEFAULT})`,
                }}
              ></div>
            </div>

            <div className="mt-1 text-dark">
              <h6 className="mb-2 line-clamp-2 h-10">{val.title}</h6>
              <div className="mb-2">Tại: {val.locationName}</div>
              <div className="h-5">
                Bắt đầu: <span className="ml-1"></span>
                {dayjs(new Date(val.starDate)).format("HH:mm - YYYY/MM/DD")}
              </div>
              <div className="mb-2 h-5">
                Kết thúc: <span className="ml-[0.5px]"></span>
                {dayjs(new Date(val.endDate)).format("HH:mm - YYYY/MM/DD")}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-2 p-2">
        {data.totalPage > 0 && (
          <div className="flex justify-center">
            <span>
              <Pagination
                count={data.totalPage}
                onChange={(_, pageNumber) => fetAllData(pageNumber, undefined, "1")}
              />
            </span>
          </div>
        )}
      </div>

      <EventParticipants
        open={showParticipants}
        onClose={handleCloseParticipants}
        eventId={selectedEventId}
      />
    </>
  );
} 