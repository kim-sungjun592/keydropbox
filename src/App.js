// ===== App.js =====
// 역할: 전체 애플리케이션의 최상위 컴포넌트
// - 현재 화면 상태 관리 (MainScreen → PreBooking/RoomSelection → RoomDetail)
// - 각 컴포넌트 간의 데이터 전달
// - 사용자 플로우 제어

import React, { useState } from "react";
import "./App.css";
import MainScreen from "./components/MainScreen";
import PreBooking from "./components/PreBooking";
import RoomSelection from "./components/RoomSelection";
import RoomDetail from "./components/RoomDetail";

function App() {
  // ===== 상태 정의 =====
  // currentScreen: 현재 보여주는 화면 상태
  // - 'main': 현장/사전예약 선택 화면
  // - 'preBooking': 예약번호 입력 화면
  // - 'roomSelection': 방 선택 화면
  // - 'roomDetail': 방 상세정보 화면
  const [currentScreen, setCurrentScreen] = useState("main");

  // selectedRoom: 선택된 방의 정보를 저장
  const [selectedRoom, setSelectedRoom] = useState(null);

  // ===== 화면 전환 함수들 =====

  // 현장구매 선택 시 → 방 선택 화면으로 이동
  const handleOnSitePurchase = () => {
    setCurrentScreen("roomSelection");
  };

  // 사전예약 선택 시 → 예약번호 입력 화면으로 이동
  const handlePreBooking = () => {
    setCurrentScreen("preBooking");
  };

  // 메인 화면으로 돌아가기
  const handleBackToMain = () => {
    setCurrentScreen("main");
    setSelectedRoom(null);
  };

  // 방 선택 시 → 방 상세정보 화면으로 이동
  const handleSelectRoom = (room) => {
    setSelectedRoom(room);
    setCurrentScreen("roomDetail");
  };

  // 방 선택 화면으로 돌아가기 (상세정보에서)
  const handleBackToRoomSelection = () => {
    setCurrentScreen("roomSelection");
    setSelectedRoom(null);
  };

  // 예약번호 입력 후 성공 시 → 방 상세정보 화면으로 이동
  const handlePreBookingSuccess = (room) => {
    setSelectedRoom(room);
    setCurrentScreen("roomDetail");
  };

  // ===== 현재 상태에 따라 다른 컴포넌트 렌더링 =====
  return (
    <div className="app">
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
          onSelectRoom={handleSelectRoom}
          onBackToMain={handleBackToMain}
        />
      )}

      {currentScreen === "roomDetail" && selectedRoom && (
        <RoomDetail room={selectedRoom} onBack={handleBackToRoomSelection} />
      )}
    </div>
  );
}

export default App;
