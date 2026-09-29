// ===== server.js =====
const express = require("express");
const cors = require("cors");
const app = express();
const PORT = 5001;

app.use(cors());
app.use(express.json());

// 6개 객실 초기 데이터 (6룸 모텔)
let rooms = [
  {
    id: "101",
    name: "101호 (디럭스)",
    price: 80000,
    available: true,
    description: "기본 더블룸",
  },
  {
    id: "102",
    name: "102호 (디럭스)",
    price: 80000,
    available: true,
    description: "기본 더블룸",
  },
  {
    id: "201",
    name: "201호 (스위트)",
    price: 100000,
    available: true,
    description: "최고급 스위트룸",
  },
  {
    id: "202",
    name: "202호 (트윈)",
    price: 85000,
    available: true,
    description: "트윈베드 객실",
  },
  {
    id: "301",
    name: "301호 (VIP)",
    price: 120000,
    available: true,
    description: "VIP 전용 객실",
  },
  {
    id: "302",
    name: "302호 (디럭스)",
    price: 80000,
    available: true,
    description: "기본 더블룸",
  },
];

let reservations = [];

// 1. 실시간 전체 객실 상태 목록 조회 API
app.get("/api/rooms", (req, res) => {
  res.json({ success: true, rooms });
});

// 2. 현장 결제 완료 처리 API (결제 시 이용중으로 상태 변경)
app.post("/api/pay-success", (req, res) => {
  const { roomId, customerName } = req.body;
  const room = rooms.find((r) => r.id === roomId);

  if (!room) {
    return res
      .status(404)
      .json({ success: false, message: "존재하지 않는 객실입니다." });
  }
  if (!room.available) {
    return res
      .status(400)
      .json({ success: false, message: "이미 사용 중인 객실입니다." });
  }

  // 핵심: 객실 상태를 '이용중(false)'으로 즉시 전환
  room.available = false;

  const reservationNumber = Math.floor(
    100000 + Math.random() * 900000,
  ).toString();
  reservations.push({
    reservationNumber,
    roomId,
    customerName: customerName || "현장 결제 고객",
    date: new Date(),
  });

  res.json({
    success: true,
    message: "결제 및 객실 구매가 완료되었습니다.",
    reservationNumber,
    room,
  });
});

// 3. 사전 예약 생성 API (테스트용)
app.post("/api/book", (req, res) => {
  const { roomId, customerName } = req.body;
  const room = rooms.find((r) => r.id === roomId);

  if (!room || !room.available) {
    return res
      .status(400)
      .json({ success: false, message: "예약할 수 없는 방입니다." });
  }

  const reservationNumber = Math.floor(
    100000 + Math.random() * 900000,
  ).toString();
  room.available = false;
  reservations.push({
    reservationNumber,
    roomId,
    customerName,
    date: new Date(),
  });

  res.json({
    success: true,
    reservationNumber,
    message: "예약이 완료되었습니다.",
  });
});

// 4. PIN 번호로 예약 조회 API
app.get("/api/reservation/:number", (req, res) => {
  const { number } = req.params;
  const reservation = reservations.find((r) => r.reservationNumber === number);

  if (!reservation) {
    return res
      .status(404)
      .json({ success: false, message: "일치하는 예약 번호가 없습니다." });
  }

  res.json({ success: true, reservation });
});

app.listen(PORT, () => {
  console.log(`✅ 백엔드 서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});
