// ===== MainScreen.js =====
// 역할: 키오스크 첫 화면 - 현장/사전예약 고객 선택
// Props:
// - onOnSitePurchase: 현장구매 선택 시 실행할 함수
// - onPreBooking: 사전예약 선택 시 실행할 함수

import React from "react";

function MainScreen({ onOnSitePurchase, onPreBooking }) {
  return (
    <div className="screen main-screen">
      <div className="main-content">
        {/* 헤더: 호텔 이름 또는 로고 */}
        <div className="header">
          <h1>M-TEL</h1>
          <p className="subtitle">무인모텔 예약 시스템</p>
        </div>

        {/* 선택 버튼 영역 */}
        <div className="choice-buttons">
          {/* 현장구매 버튼 */}
          <button className="choice-btn on-site" onClick={onOnSitePurchase}>
            <div className="btn-icon">🏨</div>
            <div className="btn-title">현장 구매 고객</div>
            <div className="btn-subtitle">On-site Purchase</div>
          </button>

          {/* 사전예약 버튼 */}
          <button className="choice-btn pre-booking" onClick={onPreBooking}>
            <div className="btn-icon">📅</div>
            <div className="btn-title">사전 예약 고객</div>
            <div className="btn-subtitle">Pre-booked Guest</div>
          </button>
        </div>

        {/* 하단 설명 */}
        <div className="info-text">
          <p>고객 유형을 선택해주세요</p>
          <p className="small">
            현장에서 방을 선택하거나 예약번호로 진행하세요
          </p>
        </div>
      </div>
    </div>
  );
}

export default MainScreen;
