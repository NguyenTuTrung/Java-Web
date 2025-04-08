import React, { useState } from "react";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: { email: string }) => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:8080/api/v1/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("user", JSON.stringify(data));
        onLoginSuccess({ email: data.username });
        console.log(email)
        onClose();
      } else {
        setError("Tài khoản hoặc mật khẩu không hợp lệ");
      }
    } catch (err) {
      setError('Đã xảy ra lỗi. Vui lòng thử lại');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      id="login-popup"
      tabIndex={-1}
      className="bg-black/50 overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 h-full items-center justify-center flex"
    >
      <div className="relative p-4 w-full max-w-md h-full md:h-auto">
        <div className="relative bg-white rounded-lg shadow">
          <button
            type="button"
            className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
            onClick={onClose}
          >
            <svg
              aria-hidden="true"
              className="w-5 h-5"
              fill="#c6c7c7"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
            <span className="sr-only">Close popup</span>
          </button>

          <div className="p-5">
            <div className="text-center">
              <p className="mb-3 text-2xl font-semibold leading-5 text-slate-900">
                Login to your account
              </p>
              <p className="mt-2 text-sm leading-4 text-slate-600">
                You must be logged in to perform this action.
              </p>
            </div>

            <div className="mt-7 flex flex-col gap-2">
              <div className="flex items-center justify-center gap-2 mt-2">
                <img
                  src="https://www.svgrepo.com/show/178887/smile.svg"
                  alt="Smile Icon"
                  className="h-[20px] w-[20px]"
                />
                <span className="text-sm text-slate-500">
                  Đừng lo, đăng ký rất dễ mà! 😊
                </span>
              </div>
            </div>

            <div className="flex w-full items-center gap-2 py-6 text-sm text-slate-600">
              <div className="h-px w-full bg-slate-200"></div>
              OR
              <div className="h-px w-full bg-slate-200"></div>
            </div>

            <form onSubmit={handleLogin} className="w-full">
              <label htmlFor="email" className="sr-only">
                Địa chỉ email
              </label>
              <input
                name="email"
                type="email"
                required
                className="block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm placeholder:text-gray-400 focus:ring-2 focus:ring-black"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <label htmlFor="password" className="sr-only">
                Mật khẩu
              </label>
              <input
                name="password"
                type="password"
                required
                className="mt-2 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm placeholder:text-gray-400 focus:ring-2 focus:ring-black"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <p className="mb-3 mt-2 text-sm text-gray-500">
                <a href="/forgot-password" className="text-blue-800 hover:text-blue-600">
                  Quên mật khẩu?
                </a>
              </p>
              <button
                type="submit"
                className="inline-flex w-full items-center justify-center rounded-lg bg-black p-2 py-3 text-sm font-medium text-white"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Continue"}
              </button>
            </form>

            {error && <p className="mt-2 text-red-500">{error}</p>}

            <div className="mt-6 text-center text-sm text-slate-600">
              Bạn chưa có tài khoản?{" "}
              <a href="/signup" className="font-medium text-[#4285f4]">
                Đăng ký
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
