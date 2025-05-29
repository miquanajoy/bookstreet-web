import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Box,
} from "@mui/material";
import { fetchWrapper } from "../../../_helpers/fetch-wrapper";
import { alertService } from "../../../_services";
import config from "../../../config";

interface Participant {
  id: number;
  participantName: string;
  email: string;
  phone?: string;
  eventparticipationsId: number;
  attended?: boolean;
  participationCode: string;
}

interface EventParticipantsProps {
  open: boolean;
  onClose: () => void;
  eventId: number;
}

interface OTPDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (otp: string) => void;
  participantName: string;
}

function OTPDialog({
  open,
  onClose,
  onConfirm,
  participantName,
}: OTPDialogProps) {
  const [otp, setOtp] = useState("");

  const handleConfirm = () => {
    onConfirm(otp);
    setOtp("");
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <div className="p-6">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-2xl font-semibold"
          aria-label="Đóng"
        >
          ×
        </button>

        {/* <h2 className="text-center text-xl font-light text-gray-700 mb-4 tracking-wider">
          Nhập mã OTP check-in cho {participantName}
        </h2> */}

        <input
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="Nhập mã OTP tại đây"
          className="w-64 mx-auto d-block px-4 py-2 border border-gray-400 rounded-md mb-3 text-center text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
        />

        <div className="w-full d-flex justify-center gap-4">
          <button
            disabled={!otp}
            
            className={`
            w-64 block mx-auto px-8 py-2
            rounded-md border
            focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50
            transition duration-150 ease-in-out
            cursor-pointer
            ${
              !otp
                ? "bg-gray-300 border-gray-400 text-gray-500 cursor-not-allowed"
                : "bg-gray-500 border-gray-600 text-white hover:bg-gray-600"
            }
          `}
          >
            Xác nhận check-in
          </button>
        </div>
      </div>
    </Dialog>
  );
}

export default function EventParticipants({
  open,
  onClose,
  eventId,
}: EventParticipantsProps) {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedParticipant, setSelectedParticipant] =
    useState<Participant | null>(null);

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
      }
    } catch (error) {
      console.error("Error fetching participants:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open && eventId) {
      fetchParticipants();
    }
  }, [open, eventId]);

  const handleCheckIn = (participant: Participant) => {
    setSelectedParticipant(participant);
  };

  const handleOTPConfirm = async (id: number) => {
    try {
      const response = await fetchWrapper.post(
        `${config.apiUrl}Event/MarkAsParticipated`,
        {
          id: id,
        }
      );

      alertService.alert({
        content:
          response.message ||
          (response.success
            ? "Cập nhật thành công"
            : "Cập nhật không thành công"),
      });

      if (response.success) {
        // After successful check-in, refresh the list
        await fetchParticipants();
      }
      // Close the OTP dialog regardless of success/failure
      setSelectedParticipant(null);
    } catch (error) {
      console.error("Error marking participant as attended:", error);
      alertService.alert({
        content: "Có lỗi xảy ra khi check-in",
      });
      // Also close the dialog on error
      setSelectedParticipant(null);
    }
  };

  const filteredParticipants = participants
    .filter((participant) => !participant.attended)
    .filter(
      (participant) =>
        participant.participantName
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        participant.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>Danh sách người tham gia chưa check-in</DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 2, mt: 1 }}>
            <TextField
              fullWidth
              label="Tìm kiếm theo tên hoặc email"
              variant="outlined"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Box>

          {loading ? (
            <div className="text-center py-4">Đang tải...</div>
          ) : filteredParticipants.length > 0 ? (
            <div className="grid grid-cols-1 gap-2">
              {filteredParticipants.map((participant, index) => (
                <div
                  key={index}
                  className="p-3 border rounded-lg hover:bg-gray-50 flex justify-between items-center"
                >
                  <div>
                    <div className="font-medium">
                      Mã check-in: {participant.participationCode}
                    </div>
                    <div>
                      Tên người tham gia: {participant.participantName}
                    </div>

                    <div className="text-gray-600">
                      Email: {participant.email}
                    </div>
                  </div>
                  <button
                    onClick={() => handleOTPConfirm(participant.id)}
                    className="bg-gray-800 hover:bg-gray-900 text-white font-bold py-2 px-4 rounded"
                  >
                    Check-in
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-gray-500">
              {searchTerm ? "Không tìm thấy kết quả" : "Chưa có người tham gia"}
            </div>
          )}
        </DialogContent>
      </Dialog>

     
    </>
  );
}
