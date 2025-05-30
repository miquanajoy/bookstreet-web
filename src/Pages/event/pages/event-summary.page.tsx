import { useEffect, useState } from "react";
import { fetchWrapper } from "../../../_helpers/fetch-wrapper";
import { EVENT } from "../../../_helpers/const/const";
import config from "../../../config";
import dayjs from "dayjs";
import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import convertDate from "../../../_helpers/converts/convertDate";

interface ParticipantStats {
  totalRegistered: number;
  totalAttended: number;
}

export default function EventSummaryPage() {
  const [completedEvents, setCompletedEvents] = useState<any[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [participantStats, setParticipantStats] = useState<ParticipantStats | null>(null);
  const [open, setOpen] = useState(false);

  const fetchCompletedEvents = async () => {
    const currentDate = convertDate(new Date());
    const result = await fetchWrapper.Post2GetByPaginate(config.apiUrl + EVENT, 1, {
      filters: [
        {
          field: "endDate",
          value: currentDate,
          operand: 4, // Less than current date (completed events)
        },
      ],
    });
    setCompletedEvents(result.list || []);
  };

  const fetchParticipantStats = async (eventId: string) => {
    try {
      const participants = await fetchWrapper.post(
        `${config.apiUrl}${EVENT}/Participants/${eventId}`,
        {
          page: -1,
          limit: -1,
        }
      );
      
      const stats = {
        totalRegistered: participants.data.list.length,
        totalAttended: participants.data.list.filter((p: any) => p.attended).length,
      };
      
      setParticipantStats(stats);
    } catch (error) {
      console.error("Error fetching participant stats:", error);
      setParticipantStats({ totalRegistered: 0, totalAttended: 0 });
    }
  };

  const handleEventClick = async (event: any) => {
    setSelectedEvent(event);
    await fetchParticipantStats(event.id);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedEvent(null);
    setParticipantStats(null);
  };

  useEffect(() => {
    fetchCompletedEvents();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Sự kiện đã kết thúc</h2>
      <div className="grid grid-cols-3 gap-4">
        {completedEvents.map((event) => (
          <div
            key={event.id}
            className="border rounded-lg p-4 cursor-pointer hover:bg-gray-50"
            onClick={() => handleEventClick(event)}
          >
            <h3 className="font-semibold mb-2">{event.title}</h3>
            <div className="text-sm text-gray-600">
              <p>Tại: {event.locationName}</p>
              <p>
                Bắt đầu:
                {dayjs(new Date(event.starDate)).format("HH:mm - YYYY/MM/DD")}
              </p>
              <p>
                Kết thúc:
                {dayjs(new Date(event.endDate)).format("HH:mm - YYYY/MM/DD")}
              </p>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          <div className="font-bold">{selectedEvent?.title}</div>
        </DialogTitle>
        <DialogContent>
          {participantStats && (
            <div className="py-4">
              <div className="mb-3">
                <span className="font-semibold">Tổng số người đăng ký tham gia sự kiện:</span>
                {participantStats.totalRegistered}
              </div>
              <div>
                <span className="font-semibold">Tổng số người tham gia sự kiện:</span>
                {participantStats.totalAttended}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
} 