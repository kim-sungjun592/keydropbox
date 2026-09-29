// ===== server.js =====
const express = require("express");
const cors = require("cors");
const app = express();
const PORT = 5001;

app.use(cors());
app.use(express.json());

// 객실 상태 데이터
let rooms = [
  { id: "101", price: 80000, available: true, description: "기본 더블룸" },
  { id: "102", price: 80000, available: true, description: "기본 더블룸" },
  { id: "201", price: 100000, available: true, description: "최고급 스위트룸" },
  { id: "202", price: 85000, available: true, description: "트윈베드 객실" },
  { id: "301", price: 120000, available: true, description: "VIP 전용 객실" },
  { id: "302", price: 80000, available: true, description: "기본 더블룸" },
];

let reservations = [];

// 1. 객실 목록 조회 API
app.get("/api/rooms", (req, res) => {
  console.log("👉 [GET] /api/rooms 요청 들어옴");
  res.json({ success: true, rooms });
});

// 2. 결제 완료 API
app.post("/api/pay-success", (req, res) => {
  console.log("👉 [POST] /api/pay-success 요청 들어옴:", req.body);
  const { roomId, customerName } = req.body;
  const room = rooms.find((r) => r.id === roomId);

  if (!room) {
    return res
      .status(404)
      .json({ success: false, message: "존재하지 않는 객실입니다." });
  }

  room.available = false; // 이용중으로 변경

  const reservationNumber = Math.floor(
    100000 + Math.random() * 900000,
  ).toString();
  reservations.push({
    reservationNumber,
    roomId,
    customerName: customerName || "현장 결제 고객",
    date: new Date(),
  });

  res.json({ success: true, message: "결제 완료", room });
});

app.listen(PORT, () => {
  console.log(
    `✅ 백엔드 서버가 http://localhost:${PORT} 에서 정상 실행 중입니다.`,
  );
});
