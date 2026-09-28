// ===== RoomDetail.js (수정된 버전) =====
// 역할: 선택된 객실의 상세정보 및 객실 사진 표시
// 기능:
// - 객실 사진을 좌측에 큰 화면으로 표시 (detailLayout 제거)
// - 방 번호, 가격, 설명 등 상세정보를 우측에 표시
// - 다음 단계로 진행 버튼
// Props:
// - room: 선택된 방의 정보 객체
// - onBack: 뒤로가기 (방 선택 화면으로)

import React, { useState } from "react";

function RoomDetail({ room, onBack }) {
  // ===== 상태 정의 =====
  // isConfirming: 선택 확정 중 상태
  const [isConfirming, setIsConfirming] = useState(false);

  // ===== 방 선택 확정 처리 =====
  const handleConfirmRoom = () => {
    setIsConfirming(true);

    // 나중에 여기서 백엔드에 방 선택 정보 전송
    // 지금은 시뮬레이션만 진행
    setTimeout(() => {
      alert(`${room.id}호실이 선택되었습니다!\n키를 수령하세요.`);
      setIsConfirming(false);
      // 나중에 결제 화면 또는 다음 단계로 이동
    }, 800);
  };

  return (
    <div className="screen room-detail-screen">
      <div className="room-detail-content">
        {/* 헤더 */}
        <div className="room-detail-header">
          <h2>객실 상세정보</h2>
          <p className="back-btn" onClick={onBack}>
            ← 돌아가기
          </p>
        </div>

        {/* 메인 컨테이너 */}
        <div className="detail-main">
          {/* 좌측: 객실 사진 */}
          <div className="detail-left">
            {/* 객실 사진 영역 */}
            {room.roomPhoto && (
              <div className="photo-container-main">
                <h3>객실 사진</h3>
                <div className="room-photo-main">
                  <img
                    src={room.roomPhoto}
                    alt={`${room.id}호 사진`}
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.parentElement.classList.add("photo-error");
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* 우측: 상세정보 */}
          <div className="detail-right">
            {/* 방 번호 및 상태 */}
            <div className="info-group large-info">
              <div className="room-header">
                <h3 className="room-number-large">{room.id}호</h3>
                <div
                  className={`status ${room.available ? "available" : "unavailable"}`}
                >
                  {room.available ? "이용 가능" : "예약됨"}
                </div>
              </div>
            </div>

            {/* 가격 정보 */}
            <div className="info-group">
              <label>가격</label>
              <div className="room-price-large">
                ₩{room.price.toLocaleString()}
                <span className="price-unit"> / Night</span>
              </div>
            </div>

            {/* 객실 설명 */}
            <div className="info-group">
              <label>객실정보</label>
              <p className="description">{room.description}</p>
            </div>

            {/* 객실 크기 정보 (나중에 data에 추가 가능) */}
            <div className="info-group">
              <label>규모</label>
              <p className="room-size">약 25m² (침실 + 욕실 + 거실)</p>
            </div>

            {/* 편의시설 */}
            <div className="info-group">
              <label>편의시설</label>
              <ul className="amenities">
                <li>✓ 에어컨/난방</li>
                <li>✓ 침구류 완비</li>
                <li>✓ 욕실용품</li>
                <li>✓ WiFi 무료</li>
                <li>✓ TV</li>
                <li>✓ 냉장고</li>
              </ul>
            </div>

            {/* 버튼 영역 */}
            <div className="detail-buttons">
              <button
                className="btn-continue"
                onClick={handleConfirmRoom}
                disabled={!room.available || isConfirming}
              >
                {isConfirming ? "처리중..." : "이 객실로 진행"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RoomDetail;
