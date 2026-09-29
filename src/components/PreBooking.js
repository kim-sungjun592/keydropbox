// ===== src/components/PreBooking.js =====
import React, { useState } from "react";
import { roomsData } from "../data";

function PreBooking({ onSuccess, onBackToMain }) {
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleNumberClick = (num) => {
    if (inputValue.length < 10) {
      setInputValue(inputValue + num);
      setError("");
    }
  };

  const handleClear = () => {
    setInputValue("");
    setError("");
  };

  // 백엔드 API에 6자리 PIN 번호 검증 요청 (5001번 포트)
  const handleSubmit = async () => {
    if (!inputValue.trim()) {
      setError("예약번호를 입력해주세요");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(
        `http://localhost:5001/api/reservation/${inputValue.trim()}`,
      );
      const data = await response.json();

      if (data.success && data.reservation) {
        const roomId = data.reservation.roomId;

        const matchedRoom = roomsData.find((r) => r.id === roomId) || {
          id: roomId,
          price: 80000,
          available: false,
          description: "사전 예약 객실",
        };

        setIsLoading(false);
        onSuccess(matchedRoom);
      } else {
        setError(data.message || "올바르지 않은 예약번호입니다.");
        setInputValue("");
        setIsLoading(false);
      }
    } catch (err) {
      console.error("예약 조회 에러:", err);
      setError("서버 통신에 실패했습니다. (node server.js 확인 필요)");
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  const handleBack = (e) => {
    e.preventDefault();
    if (typeof onBackToMain === "function") {
      onBackToMain();
    } else {
      console.warn("onBackToMain prop이 없습니다.");
    }
  };

  return (
    <div className="screen prebooking-screen">
      <div className="prebooking-content">
        <div className="prebooking-header">
          <h2>예약번호 (PIN) 입력</h2>
          <p
            className="back-btn"
            onClick={handleBack}
            style={{ cursor: "pointer" }}
          >
            ← 돌아가기
          </p>
        </div>

        <div className="input-section">
          <input
            type="text"
            className="booking-input"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value.toUpperCase())}
            onKeyPress={handleKeyPress}
            placeholder="6자리 PIN 번호 입력"
            disabled={isLoading}
          />
          {error && <div className="error-message">{error}</div>}
        </div>

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

        <div className="info-text">
          <p>발급받으신 6자리 PIN (예약번호)를 입력해 주세요.</p>
        </div>
      </div>
    </div>
  );
}

export default PreBooking;
