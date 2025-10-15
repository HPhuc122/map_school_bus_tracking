import React, { useState } from 'react';
import { Bus, User, Lock, Eye, EyeOff } from 'lucide-react';

interface LoginProps {
  onLogin: (username: string, password: string) => Promise<boolean>;
}

const Login = ({ onLogin }: LoginProps) => {
  const [userType, setUserType] = useState<'admin' | 'parent' | 'driver'>('parent');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate input
    if (!username.trim() || !password.trim()) {
      alert('Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu!');
      return;
    }

    setIsLoading(true);

    try {
      const success = await onLogin(username, password);
      if (!success) {
        alert('Sai tên đăng nhập hoặc mật khẩu!');
      }
    } catch (error) {
      alert('Đã xảy ra lỗi khi đăng nhập!');
    } finally {
      setIsLoading(false);
    }
  };

  const userTypeOptions = [
    { value: 'parent', label: 'Phụ huynh', icon: '👨‍👩‍👧‍👦', color: 'bg-green-500' },
    { value: 'driver', label: 'Tài xế', icon: '🚌', color: 'bg-blue-500' },
    { value: 'admin', label: 'Quản trị viên', icon: '⚙️', color: 'bg-purple-500' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
            <Bus className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Smart School Bus</h1>
          <p className="text-gray-600">Đăng nhập vào hệ thống</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* User Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Loại tài khoản
              </label>
              <div className="grid grid-cols-3 gap-2">
                {userTypeOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setUserType(option.value as any)}
                    className={`p-3 rounded-lg border-2 transition-all ${userType === option.value
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300 text-gray-600'
                      }`}
                  >
                    <div className="text-2xl mb-1">{option.icon}</div>
                    <div className="text-xs font-medium">{option.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tên đăng nhập
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nhập tên đăng nhập"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mật khẩu
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nhập mật khẩu"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Đang đăng nhập...
                </div>
              ) : (
                'Đăng nhập'
              )}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Tài khoản demo:</h3>
            <div className="grid grid-cols-1 gap-2">
              <button
                type="button"
                onClick={() => {
                  setUsername('parent');
                  setPassword('parent123');
                  setUserType('parent');
                }}
                className="text-left p-2 text-xs text-gray-600 hover:bg-gray-100 rounded transition-colors"
              >
                <strong>Phụ huynh:</strong> parent / parent123
              </button>
              <button
                type="button"
                onClick={() => {
                  setUsername('driver');
                  setPassword('driver123');
                  setUserType('driver');
                }}
                className="text-left p-2 text-xs text-gray-600 hover:bg-gray-100 rounded transition-colors"
              >
                <strong>Tài xế:</strong> driver / driver123
              </button>
              <button
                type="button"
                onClick={() => {
                  setUsername('admin');
                  setPassword('admin123');
                  setUserType('admin');
                }}
                className="text-left p-2 text-xs text-gray-600 hover:bg-gray-100 rounded transition-colors"
              >
                <strong>Admin:</strong> admin / admin123
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2 italic">
              💡 Nhấp vào tài khoản để tự động điền thông tin
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;