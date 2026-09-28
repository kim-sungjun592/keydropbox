// ===== PreBooking.js =====
// 역할: 사전예약 고객의 예약번호 입력 화면
// 기능:
// - 번호패드로 예약번호 입력
// - 입력한 예약번호 검증 (data.js의 preBookings 데이터와 비교)
// - 잘못된 번호 시 에러 메시지 표시
// - 올바른 번호 입력 시 해당 방의 상세정보로 이동
// Props:
// - onSuccess: 성공 시 호출 (room 정보 전달)
// - onBackToMain: 메인화면으로 돌아가기

import React, { useState } from "react";
import { preBookings, roomsData } from "../data";

function PreBooking({ onSuccess, onBackToMain }) {
  // ===== 상태 정의 =====
  // inputValue: 사용자가 입력한 예약번호
  const [inputValue, setInputValue] = useState("");

  // error: 에러 메시지 표시 여부
  const [error, setError] = useState("");

  // isLoading: 검증 중 상태 (나중에 API 호출 시 사용)
  const [isLoading, setIsLoading] = useState(false);

  // ===== 번호패드 버튼 클릭 처리 =====
  const handleNumberClick = (num) => {
    if (inputValue.length < 10) {
      // 예약번호 최대 길이 제한
      setInputValue(inputValue + num);
      setError(""); // 새로 입력하면 에러 메시지 제거
    }
  };

  // ===== Clear 버튼: 입력값 초기화 =====
  const handleClear = () => {
    setInputValue("");
    setError("");
  };

  // ===== Enter 버튼: 예약번호 검증 및 처리 =====
  const handleSubmit = () => {
    // 입력값 검증
    if (!inputValue.trim()) {
      setError("예약번호를 입력해주세요");
      return;
    }

    setIsLoading(true);

    // 실제로는 여기서 백엔드 API 호출
    // 지금은 로컬 데이터에서 조회
    setTimeout(() => {
      // preBookings에서 입력한 예약번호 조회
      const roomId = preBookings[inputValue.toUpperCase()];

      if (roomId) {
        // 예약번호가 존재하면 해당 방 정보 찾기
        const room = roomsData.find((r) => r.id === roomId);
        if (room) {
          setIsLoading(false);
          // 성공 시 선택된 방 정보와 함께 다음 단계로 진행
          onSuccess(room);
        }
      } else {
        // 예약번호가 없으면 에러 메시지 표시
        setError("예약번호를 다시 입력하세요");
        setInputValue("");
        setIsLoading(false);
      }
    }, 500); // API 호출 시뮬레이션 딜레이
  };

  // ===== Enter 키 입력 처리 =====
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  return (
    <div className="screen prebooking-screen">
      <div className="prebooking-content">
        {/* 헤더 */}
        <div className="prebooking-header">
          <h2>예약번호 입력</h2>
          <p className="back-btn" onClick={onBackToMain}>
            ← 돌아가기
          </p>
        </div>

        {/* 입력 영역 */}
        <div className="input-section">
          <input
            type="text"
            className="booking-input"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value.toUpperCase())}
            onKeyPress={handleKeyPress}
            placeholder="예약번호 입력"
            disabled={isLoading}
          />
          {error && <div className="error-message">{error}</div>}
        </div>

        {/* 숫자패드 */}
        <div className="number-pad">
          <div className="pad-row">
            <button className="pad-btn" onClick={() => handleNumberClick("1")}>
              1
            </button>
            <button className="pad-btn" onClick={() => handleNumberClick("2")}>
              2
            </button>
            <button className="pad-btn" onClick={() => handleNumberClick("3")}>
              3
            </button>
          </div>
          <div className="pad-row">
            <button className="pad-btn" onClick={() => handleNumberClick("4")}>
              4
            </button>
            <button className="pad-btn" onClick={() => handleNumberClick("5")}>
              5
            </button>
            <button className="pad-btn" onClick={() => handleNumberClick("6")}>
              6
            </button>
          </div>
          <div className="pad-row">
            <button className="pad-btn" onClick={() => handleNumberClick("7")}>
              7
            </button>
            <button className="pad-btn" onClick={() => handleNumberClick("8")}>
              8
            </button>
            <button className="pad-btn" onClick={() => handleNumberClick("9")}>
              9
            </button>
          </div>
          <div className="pad-row">
            <button className="pad-btn clear" onClick={handleClear}>
              Clear
            </button>
            <button className="pad-btn" onClick={() => handleNumberClick("0")}>
              0
            </button>
            <button
              className="pad-btn enter"
              onClick={handleSubmit}
              disabled={!inputValue.trim() || isLoading}
            >
              {isLoading ? "확인중..." : "Enter"}
            </button>
          </div>
        </div>

        {/* 문자 입력 가능 안내 */}
        <div className="info-text">
          <p>예약번호는 영문자와 숫자를 포함합니다 (예: PB001)</p>
        </div>
      </div>
    </div>
  );
}

export default PreBooking;
