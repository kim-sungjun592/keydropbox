// ===== src/App.js =====
import React, { useState, useEffect } from "react";
import "./App.css";
import MainScreen from "./components/MainScreen";
import PreBooking from "./components/PreBooking";
import RoomSelection from "./components/RoomSelection";
import RoomDetail from "./components/RoomDetail";
import RoomStructureEdit from "./components/RoomStructureEdit";
import { roomsData } from "./data";

function App() {
  const [currentScreen, setCurrentScreen] = useState("main");
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [initialPaidSuccess, setInitialPaidSuccess] = useState(false);
  const [isAdmin, setIsAdmin] = useState(true);

  // 💾 1. localStorage에서 객실 데이터 불러오기
  const [rooms, setRooms] = useState(() => {
    const savedRooms = localStorage.getItem("roomsData");
    if (savedRooms) {
      try {
        return JSON.parse(savedRooms);
      } catch (e) {
        console.error("저장된 객실 데이터를 불러오는데 실패했습니다.", e);
      }
    }
    return roomsData;
  });

  // 💾 2. 용량 초과 에러 방지 저장 함수
  const updateAndSaveRooms = (newRooms) => {
    setRooms(newRooms);
    try {
      localStorage.setItem("roomsData", JSON.stringify(newRooms));
    } catch (e) {
      console.error("Storage quota exceeded!", e);
      alert(
        "브라우저 저장 용량이 초과되었습니다. 이미지를 추가하기 어렵다면 기존 이미지를 삭제해 주세요.",
      );
    }
  };

  // 🔄 3. 저장된 객실 정보 및 이용중 상태 복원
  useEffect(() => {
    const savedOccupied = JSON.parse(
      localStorage.getItem("occupiedRooms") || "[]",
    );

    const query = new URLSearchParams(window.location.search);
    const isPaySuccess = query.get("paySuccess");
    const roomId = query.get("roomId");

    let currentOccupied = [...savedOccupied];

    if (isPaySuccess && roomId) {
      if (!currentOccupied.includes(String(roomId))) {
        currentOccupied.push(String(roomId));
        localStorage.setItem("occupiedRooms", JSON.stringify(currentOccupied));
      }
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    const savedRoomsStr = localStorage.getItem("roomsData");
    const initialOrSaved = savedRoomsStr
      ? JSON.parse(savedRoomsStr)
      : roomsData;

    const updatedRooms = initialOrSaved.map((r) => {
      const isOccupied = currentOccupied.includes(String(r.id));
      const status = r.status || (isOccupied ? "occupied" : "available");
      return {
        ...r,
        status: status,
        available: status === "available",
      };
    });

    updateAndSaveRooms(updatedRooms);

    if (isPaySuccess && roomId) {
      const targetRoom = updatedRooms.find(
        (r) => String(r.id) === String(roomId),
      );
      if (targetRoom) {
        setSelectedRoom({
          ...targetRoom,
          available: false,
          status: "occupied",
        });
        setCurrentScreen("roomDetail");
        setInitialPaidSuccess(true);
      }
    }
  }, []);

  // 대표 사진 업데이트 & 저장
  const handleUpdateRoomImage = (roomId, imageUrl) => {
    const updatedRooms = rooms.map((r) =>
      String(r.id) === String(roomId) ? { ...r, image: imageUrl } : r,
    );
    updateAndSaveRooms(updatedRooms);
  };

  // 🛠️ 객실 상태 변경 (관리자용)
  const handleUpdateRoomStatus = (roomId, newStatus) => {
    const updatedRooms = rooms.map((r) => {
      if (String(r.id) === String(roomId)) {
        return {
          ...r,
          status: newStatus,
          available: newStatus === "available",
        };
      }
      return r;
    });

    const isAvailable = newStatus === "available";
    const savedOccupied = JSON.parse(
      localStorage.getItem("occupiedRooms") || "[]",
    );
    let updatedOccupied = [...savedOccupied];

    if (!isAvailable) {
      if (!updatedOccupied.includes(String(roomId))) {
        updatedOccupied.push(String(roomId));
      }
    } else {
      updatedOccupied = updatedOccupied.filter((id) => id !== String(roomId));
    }
    localStorage.setItem("occupiedRooms", JSON.stringify(updatedOccupied));

    updateAndSaveRooms(updatedRooms);
  };

  // 객실 세부 공간 구조 업데이트 & 저장
  const handleSaveStructure = (roomId, newStructures) => {
    const updatedRooms = rooms.map((r) =>
      String(r.id) === String(roomId) ? { ...r, structures: newStructures } : r,
    );
    updateAndSaveRooms(updatedRooms);
  };

  const handlePaymentSuccess = (roomId) => {
    const savedOccupied = JSON.parse(
      localStorage.getItem("occupiedRooms") || "[]",
    );
    const updated = Array.from(new Set([...savedOccupied, String(roomId)]));
    localStorage.setItem("occupiedRooms", JSON.stringify(updated));

    const updatedRooms = rooms.map((r) =>
      String(r.id) === String(roomId)
        ? { ...r, available: false, status: "occupied" }
        : r,
    );
    updateAndSaveRooms(updatedRooms);
  };

  const handleOnSitePurchase = () => {
    setCurrentScreen("roomSelection");
  };

  const handlePreBooking = () => {
    setCurrentScreen("preBooking");
  };

  const handleBackToMain = () => {
    setCurrentScreen("main");
    setSelectedRoom(null);
    setInitialPaidSuccess(false);
  };

  const handleSelectRoom = (room) => {
    setSelectedRoom(room);
    setCurrentScreen("roomDetail");
    setInitialPaidSuccess(false);
  };

  const handleBackToRoomSelection = () => {
    setCurrentScreen("roomSelection");
    setSelectedRoom(null);
    setInitialPaidSuccess(false);
  };

  const handlePreBookingSuccess = (room) => {
    setSelectedRoom(room);
    setCurrentScreen("roomDetail");
    setInitialPaidSuccess(false);
  };

  return (
    <div
      className="app"
      style={{
        position: "relative",
        minHeight: "100vh",
        width: "100%",
        overflowY: "auto", // 🟢 상단/하단 부드러운 스크롤 허용
        overflowX: "hidden",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* 🔑 중앙 상단 관리자 토글 바 (스크롤 내려도 상단에 붙어있도록 sticky 적용) */}
      <div
        style={{
          position: "sticky",
          top: "15px",
          marginTop: "15px",
          marginBottom: "15px",
          padding: "8px 20px",
          backgroundColor: "#ffffff",
          borderRadius: "30px",
          boxShadow: "0 4px 15px rgba(0, 0, 0, 0.12)",
          border: "1px solid #e0e0e0",
          display: "inline-flex",
          alignItems: "center",
          gap: "12px",
          zIndex: 1000,
        }}
      >
        <span style={{ fontSize: "14px", color: "#333" }}>
          현재 상태:{" "}
          <strong style={{ color: isAdmin ? "#d32f2f" : "#2b5c6b" }}>
            {isAdmin ? "🔑 관리자 모드" : "👤 일반 사용자 모드"}
          </strong>
        </span>
        <button
          onClick={() => setIsAdmin(!isAdmin)}
          style={{
            padding: "6px 14px",
            backgroundColor: isAdmin ? "#d32f2f" : "#2b5c6b",
            color: "#fff",
            border: "none",
            borderRadius: "20px",
            fontSize: "12px",
            fontWeight: "bold",
            cursor: "pointer",
            boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
          }}
        >
          {isAdmin ? "일반 사용자 모드로 변경" : "관리자 모드로 변경"}
        </button>
      </div>

      {currentScreen === "main" && (
        <MainScreen
          onOnSitePurchase={handleOnSitePurchase}
          onPreBooking={handlePreBooking}
        />
      )}

      {currentScreen === "preBooking" && (
        <PreBooking
          onSuccess={handlePreBookingSuccess}
          onBackToMain={handleBackToMain}
        />
      )}

      {currentScreen === "roomSelection" && (
        <RoomSelection
          rooms={rooms}
          onSelectRoom={handleSelectRoom}
          onBackToMain={handleBackToMain}
          isAdmin={isAdmin}
        />
      )}

      {currentScreen === "roomDetail" && selectedRoom && (
        <RoomDetail
          room={
            rooms.find((r) => String(r.id) === String(selectedRoom.id)) ||
            selectedRoom
          }
          onBack={handleBackToRoomSelection}
          onPaymentSuccess={handlePaymentSuccess}
          initialPaidSuccess={initialPaidSuccess}
          isAdmin={isAdmin}
          onUpdateRoomImage={handleUpdateRoomImage}
          onUpdateRoomStatus={handleUpdateRoomStatus}
          onNavigateToStructure={() => setCurrentScreen("roomStructureEdit")}
        />
      )}

      {currentScreen === "roomStructureEdit" && selectedRoom && (
        <RoomStructureEdit
          room={
            rooms.find((r) => String(r.id) === String(selectedRoom.id)) ||
            selectedRoom
          }
          onBack={() => setCurrentScreen("roomDetail")}
          isAdmin={isAdmin}
          onSaveStructure={handleSaveStructure}
        />
      )}
    </div>
  );
}

export default App;
