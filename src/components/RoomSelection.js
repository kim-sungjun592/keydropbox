// ===== src/components/RoomSelection.js =====
import React from "react";

function RoomSelection({ rooms, onSelectRoom, onBackToMain }) {
  const handleBack = (e) => {
    e.preventDefault();
    if (typeof onBackToMain === "function") {
      onBackToMain();
    }
  };

  return (
    <div className="screen room-selection-screen">
      <div className="room-selection-content">
        <div className="room-selection-header">
          <h2>객실 선택</h2>
          <p
            className="back-btn"
            onClick={handleBack}
            style={{ cursor: "pointer" }}
          >
            ← 돌아가기
          </p>
        </div>

        <div className="selection-info">
          <p>원하는 객실을 선택해주세요</p>
        </div>

        <div className="rooms-grid-container">
          <div className="rooms-grid">
            {rooms.map((room) => (
              <div
                key={room.id}
                className={`room-card ${room.available ? "" : "unavailable"}`}
                onClick={() => room.available && onSelectRoom(room)}
              >
                <div className="room-number">{room.id}</div>
                <div className="room-layout-image">
                  <img
                    src={room.thumbnailLayout}
                    alt={`${room.id}호 평면도`}
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.nextElementSibling.style.display = "block";
                    }}
                  />
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
                <div className="room-price">₩{room.price.toLocaleString()}</div>
                {room.available ? (
                  <div className="availability available">이용 가능</div>
                ) : (
                  <div className="availability unavailable">이용중</div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="selection-footer">
          <p>객실을 클릭하면 상세정보와 평면도를 확인할 수 있습니다</p>
        </div>
      </div>
    </div>
  );
}

export default RoomSelection;
