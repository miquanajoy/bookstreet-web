import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import { fetchWrapper } from "../../../_helpers/fetch-wrapper";
import config from "../../../config";
import dayjs from "dayjs";

interface Participant {
  id: number;
  eventId: number;
  userId: number | null;
  participantName: string;
  email: string;
  phone: string | null;
  attended: boolean;
  participationCode: string;
  createdAt: string;
}

interface EventParticipantInfoProps {
  eventId: number;
  show: boolean;
}

export default function EventParticipantInfo({
  eventId,
  show
}: EventParticipantInfoProps) {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalParticipants, setTotalParticipants] = useState(0);

  const fetchParticipants = async () => {
    try {
      setLoading(true);
      const response = await fetchWrapper.post(
        `${config.apiUrl}Event/Participants/${eventId}`,
        {
          page: -1,
          limit: -1,
        }
      );
      if (response.success) {
        setParticipants(response.data.list || []);
        setTotalParticipants(response.data.recordsTotal || 0);
      }
    } catch (error) {
      console.error("Error fetching participants:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (show && eventId) {
      fetchParticipants();
    }
  }, [show, eventId]);

  if (!show) return null;

  return (
    <div className="mt-8 bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Thông tin người tham gia sự kiện</h2>
        <div className="text-sm text-gray-600">
          Tổng số người tham gia: {totalParticipants}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-4">Đang tải...</div>
      ) : participants.length > 0 ? (
        <div className="overflow-x-auto">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Tên</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Số điện thoại</TableCell>
                <TableCell>Trạng thái</TableCell>
                <TableCell>Thời gian đăng ký</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {participants.map((participant) => (
                <TableRow key={participant.id}>
                  <TableCell>{participant.participantName}</TableCell>
                  <TableCell>{participant.email}</TableCell>
                  <TableCell>{participant.phone || "-"}</TableCell>
                  <TableCell>
                    {participant.attended ? "Đã check-in" : "Chưa check-in"}
                  </TableCell>
                  <TableCell>
                    {dayjs(participant.createdAt).format("DD/MM/YYYY HH:mm")}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="text-center py-4 text-gray-500">
          Chưa có người tham gia
        </div>
      )}
    </div>
  );
} 