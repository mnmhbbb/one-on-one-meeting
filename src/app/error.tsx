"use client";

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white px-4">
      {/* 에러 아이콘 */}
      <div className="mb-6 text-center">
        <div
          className="bg-opacity-10 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full"
          style={{ backgroundColor: "rgba(107, 85, 69, 0.1)" }}
        >
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ color: "#6b5545" }}
          >
            <path
              d="M12 8V12M12 16H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      {/* 에러 메시지 */}
      <h1 className="mb-2 text-2xl font-bold text-gray-800">에러가 발생했습니다</h1>
      <p className="mb-8 max-w-md text-center text-gray-600">
        {error.message || "일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요."}
      </p>

      {/* 재시도 버튼 */}
      <button
        onClick={reset}
        className="focus:ring-opacity-50 rounded-lg px-6 py-3 font-medium text-white transition-all duration-200 hover:opacity-90 focus:ring-2 focus:outline-none"
        style={{
          backgroundColor: "#6b5545",
          boxShadow: "0 2px 4px rgba(107, 85, 69, 0.2)",
        }}
      >
        다시 시도하기
      </button>
    </div>
  );
}
