// ===== RoomSelection.js =====
// 역할: 현장구매 고객이 방을 선택하는 화면
// 기능:
// - 모든 방을 그리드 형태로 표시
// - 각 방의 가격, 예약상태 표시
// - 방 클릭 시 상세정보로 이동
// Props:
// - onSelectRoom: 방 선택 시 호출 (room 정보 전달)
// - onBackToMain: 메인화면으로 돌아가기

import React from "react";
import { roomsData } from "../data";

function RoomSelection({ onSelectRoom, onBackToMain }) {
  return (
    <div className="screen room-selection-screen">
      <div className="room-selection-content">
        {/* 헤더 */}
        <div className="room-selection-header">
          <h2>객실 선택</h2>
          <p className="back-btn" onClick={onBackToMain}>
            ← 돌아가기
          </p>
        </div>

        {/* 안내 문구 */}
        <div className="selection-info">
          <p>원하는 객실을 선택해주세요</p>
        </div>

        {/* 모든 객실을 하나의 그리드에 표시 */}
        <div className="rooms-grid-container">
          <div className="rooms-grid">
            {roomsData.map((room) => (
              <div
                key={room.id}
                className={`room-card ${room.available ? "" : "unavailable"}`}
                onClick={() => room.available && onSelectRoom(room)}
              >
                {/* 방 번호 */}
                <div className="room-number">{room.id}</div>

                {/* 방 레이아웃 이미지 - thumbnailLayout 필드 사용 */}
                <div className="room-layout-image">
                  <img
                    src={room.thumbnailLayout}
                    alt={`${room.id}호 평면도`}
                    onError={(e) => {
                      // 이미지 로드 실패 시 기본 SVG 표시
                      e.target.style.display = "none";
                      e.target.nextElementSibling.style.display = "block";
                    }}
                  />
                  {/* 이미지 로드 실패 시 대체 SVG */}
                  <svg
                    viewBox="0 0 100 100"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{ display: "none" }}
                  >
                    <rect
                      x="10"
                      y="10"
                      width="80"
                      height="80"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                    <rect
                      x="20"
                      y="20"
                      width="30"
                      height="25"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                    <circle
                      cx="70"
                      cy="35"
                      r="8"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                  </svg>
                </div>

                {/* 가격 정보 */}
                <div className="room-price">₩{room.price.toLocaleString()}</div>

                {/* 상태 배지 */}
                {room.available ? (
                  <div className="availability available">이용 가능</div>
                ) : (
                  <div className="availability unavailable">예약됨</div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 추가 안내 */}
        <div className="selection-footer">
          <p>객실을 클릭하면 상세정보와 평면도를 확인할 수 있습니다</p>
        </div>
      </div>
    </div>
  );
}

export default RoomSelection;
