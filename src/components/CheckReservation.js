// src/components/CheckReservation.js
import React, { useState } from "react";

function CheckReservation({ onBack }) {
  const [resNumber, setResNumber] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleCheck = async () => {
    try {
      // 백엔드 서버에 예약번호 조회 요청
      const response = await fetch(
        `http://localhost:5000/api/reservation/${resNumber}`,
      );
      const data = await response.json();

      if (data.success) {
        setResult(data.reservation);
        setError("");
      } else {
        setError(data.message);
        setResult(null);
      }
    } catch (err) {
      console.error(err);
      setError("서버와 연결할 수 없습니다.");
    }
  };

  return (
    <div
      className="screen reservation-check-screen"
      style={{ textAlign: "center", padding: "50px" }}
    >
      <h2>예약 조회</h2>
      <p>부여받은 6자리 예약번호를 입력해주세요.</p>

      <div style={{ margin: "20px 0" }}>
        <input
          type="text"
          maxLength="6"
          value={resNumber}
          onChange={(e) => setResNumber(e.target.value)}
          placeholder="예약번호 입력 (예: 123456)"
          style={{
            padding: "10px",
            fontSize: "18px",
            width: "200px",
            textAlign: "center",
          }}
        />
      </div>

      <button
        onClick={handleCheck}
        style={{
          padding: "10px 20px",
          fontSize: "18px",
          cursor: "pointer",
          backgroundColor: "#2b5c6b",
          color: "white",
          border: "none",
          borderRadius: "5px",
        }}
      >
        조회하기
      </button>

      {error && <p style={{ color: "red", marginTop: "20px" }}>{error}</p>}

      {result && (
        <div
          style={{
            marginTop: "30px",
            padding: "20px",
            backgroundColor: "#f0f8ff",
            borderRadius: "8px",
          }}
        >
          <h3>환영합니다, {result.customerName || "고객"}님!</h3>
          <p>
            예약하신 객실은 <strong>{result.roomId}호</strong> 입니다.
          </p>
          <button
            style={{
              marginTop: "10px",
              padding: "10px",
              backgroundColor: "#e67e22",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            키 수령하기
          </button>
        </div>
      )}

      <div style={{ marginTop: "50px" }}>
        <button onClick={onBack} style={{ cursor: "pointer" }}>
          ← 처음으로 돌아가기
        </button>
      </div>
    </div>
  );
}

export default CheckReservation;
