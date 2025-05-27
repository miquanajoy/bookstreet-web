import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import { fetchWrapper } from "../../../_helpers/fetch-wrapper";
import { EVENT } from "../../../_helpers/const/const";
import config from "../../../config";

interface EventSummaryDialogProps {
  open: boolean;
  onClose: () => void;
  eventId: number | null;
}

interface ParticipantStats {
  totalRegistered: number;
  totalAttended: number;
}

export default function EventSummaryDialog({ open, onClose, eventId }: EventSummaryDialogProps) {
  const [eventDetails, setEventDetails] = useState<any>(null);
  const [participantStats, setParticipantStats] = useState<ParticipantStats | null>(null);

  useEffect(() => {
    if (open && eventId) {
      fetchEventDetails();
      fetchParticipantStats();
    }
  }, [open, eventId]);

  const fetchEventDetails = async () => {
    try {
      const result = await fetchWrapper.get(`${config.apiUrl}${EVENT}/${eventId}`);
      setEventDetails(result);
    } catch (error) {
      console.error("Error fetching event details:", error);
    }
  };

  const fetchParticipantStats = async () => {
    if (!eventId) return;
    
    try {
      const participants = await fetchWrapper.get(
        `${config.apiUrl}${EVENT}/Participants/${eventId}`
      );
      
      const stats = {
        totalRegistered: participants.length,
        totalAttended: participants.filter((p: any) => p.attended).length,
      };
      
      setParticipantStats(stats);
    } catch (error) {
      console.error("Error fetching participant stats:", error);
      setParticipantStats({ totalRegistered: 0, totalAttended: 0 });
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <div className="font-bold">{eventDetails?.title}</div>
      </DialogTitle>
      <DialogContent>
        {participantStats && (
          <div className="py-4">
            <div className="mb-3">
              <span className="font-semibold">Tổng số người đăng ký tham gia sự kiện:</span>{" "}
              {participantStats.totalRegistered}
            </div>
            <div>
              <span className="font-semibold">Tổng số người tham gia sự kiện:</span>{" "}
              {participantStats.totalAttended}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
} 