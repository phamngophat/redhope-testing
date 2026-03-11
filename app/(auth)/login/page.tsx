"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Loader2, Mail, Lock, Eye, EyeOff, AlertCircle, ChevronLeft, CheckCircle2 } from "lucide-react";

import { useAuth } from "@/context/AuthContext";

// Shadcn UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const { refreshUser } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);


  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) throw signInError;

      if (data.user) {
        interface HospitalProfile {
          role: string;
          hospital_address?: string;
          phone?: string;
        }

        const { data: profile, error: profileError } = await supabase
          .from('users')
          .select('role, hospital_address, phone')
          .eq('id', data.user.id)
          .maybeSingle() as { data: HospitalProfile | null, error: any };

        const role = profile?.role || data.user.user_metadata?.role || 'donor';

        // SECURITY: No more client-side cookie setting
        // Supabase SSR handles session cookies automatically
        // Middleware verifies auth via Supabase JWT server-side

        // Cập nhật trạng thái auth global trước khi chuyển trang
        await refreshUser();

        // Logic redirection based on actual DB role
        switch (role) {
          case 'admin':
            router.push('/admin-dashboard');
            break;
          case 'hospital':
            {
              const isComplete = profile?.hospital_address && profile?.phone;
              if (isComplete) {
                router.push('/hospital-dashboard');
              } else {
                router.push('/complete-hospital-profile');
              }
            }
            break;
          default:
            router.push('/requests');
        }
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      const msg = errorMessage === 'Invalid login credentials' ? 'Email hoặc mật khẩu không đúng.' : 'Đăng nhập thất bại. Vui lòng kiểm tra lại.';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/api/auth/callback`,
        },
      });
      if (oauthError) throw oauthError;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Đăng nhập bằng Google thất bại.";
      setError(errorMessage);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen h-full flex flex-col bg-white font-sans relative">
      {/* Back to Home Button - Top Left of the whole page */}
      <Link
        href="/"
        className="absolute top-4 left-4 lg:top-6 lg:left-6 z-50"
      >
        <Button variant="ghost" className="gap-2 text-sm font-bold text-slate-600 lg:text-white/80 hover:text-slate-900 lg:hover:text-white bg-white/20 lg:bg-white/10 lg:hover:bg-white/20 backdrop-blur-md border border-slate-200 lg:border-white/20 group transition-all rounded-full h-10 lg:h-11 px-4 lg:px-5">
          ←
          <span className="hidden sm:inline">Quay về trang chủ</span>
        </Button>
      </Link>

      <main className="flex-grow flex items-stretch overflow-hidden">
        {/* Left Side: Visual/Mission (Hidden on mobile/tablet) */}
        <div className="hidden md:flex md:w-1/2 relative bg-[#700000] items-center justify-center p-12 lg:p-20 overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <svg width="100%" height="100%">
              <pattern id="pattern-circles" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1" fill="#fff" />
              </pattern>
              <rect x="0" y="0" width="100%" height="100%" fill="url(#pattern-circles)" />
            </svg>
          </div>

          <div className="relative z-10 text-white max-w-lg">
            <span className="inline-block px-4 py-1 rounded-full bg-white/10 backdrop-blur-md text-[10px] font-extrabold uppercase tracking-[0.2em] mb-6 border border-white/20">
              Mạng lưới Hiến máu Thông minh
            </span>
            <h1 className="text-4xl xl:text-5xl font-extrabold mb-6 leading-[1.15] tracking-tight">
              Mỗi giọt máu trao đi, <br /> một cuộc đời ở lại.
            </h1>
            <p className="text-lg text-white/70 leading-relaxed mb-10 font-medium max-w-md">
              Kết nối với bệnh viện, quản lý kho máu hoặc trở thành người hùng ngay hôm nay.
              <span className="font-bold text-white"> REDHOPE</span> là nền tảng thống nhất cho một hệ sinh thái hiến máu an toàn.
            </p>

            <div className="space-y-5 font-semibold text-white/90">
              {[
                "Nhận thông báo máu khẩn cấp tại khu vực",
                "Tích lũy điểm uy tín và đổi quà tặng",
                "Quản lý lịch sử hiến máu minh bạch",
                "Tiếp cận báo cáo tồn kho máu thời gian thực"
              ].map((text, i) => (
                <div key={i} className="flex items-center gap-4 group">
                  <div className="flex items-center justify-center size-8 rounded-full bg-white/20 group-hover:bg-white/30 transition-colors">
                    <CheckCircle2 className="size-5 text-white" />
                  </div>
                  <span className="text-sm">{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Decorative Blobs */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[600px] h-[600px] bg-red-400/20 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[500px] h-[500px] bg-indigo-500/30 rounded-full blur-[100px]"></div>
        </div>

        {/* Right Side: Auth Form */}
        <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-6 lg:p-12 overflow-y-auto bg-gray-50/50 relative">
          <Card className="w-full max-w-md bg-white rounded-[32px] shadow-2xl shadow-blue-100/50 border border-gray-100 relative z-10 overflow-hidden">
            <CardHeader className="pt-8 lg:pt-10 px-8 lg:px-10 text-center">
              <CardTitle className="text-2xl font-extrabold text-gray-900 tracking-tight">Chào mừng trở lại</CardTitle>
              <CardDescription className="text-sm text-gray-500 mt-2 font-medium">Đăng nhập để vào hệ thống điều hành</CardDescription>
            </CardHeader>

            <CardContent className="px-6 lg:px-10 pb-8 lg:pb-10 space-y-6 lg:space-y-8">
              {/* Error Message */}
              {error && (
                <Alert variant="destructive" className="rounded-2xl border-red-100 bg-red-50 text-red-600 animate-in fade-in slide-in-from-top-2">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="font-medium text-red-600">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              {/* Form */}
              <form onSubmit={handleLogin} className="space-y-6">
                {/* Email Field */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-bold text-[#374151] ml-1">Địa chỉ Email</Label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#0065FF] transition-colors z-10">
                      <Mail className="h-5 w-5" />
                    </div>
                    <Input
                      id="email"
                      type="email"
                      className="pl-12 py-6 rounded-2xl bg-gray-50/50 border-gray-200 focus:ring-4 focus:ring-[#0065FF]/10 focus:border-[#0065FF] transition-all font-medium text-base"

                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center ml-1">
                    <Label htmlFor="password" className="text-sm font-bold text-gray-700">Mật khẩu</Label>
                    <Link href="/forgot-password" title="Quên mật khẩu?" className="text-xs font-bold text-[#0065FF] hover:underline">
                      Quên mật khẩu?
                    </Link>
                  </div>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#0065FF] transition-colors z-10">
                      <Lock className="h-5 w-5" />
                    </div>
                    <Input
                      id="password"
                      className="pl-12 pr-12 py-6 rounded-2xl bg-gray-50/50 border-gray-200 focus:ring-4 focus:ring-[#0065FF]/10 focus:border-[#0065FF] transition-all font-medium text-sm"
                      placeholder="••••••••"
                      required
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <div className="absolute inset-y-0 right-0 pr-2 flex items-center z-20">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-gray-400 hover:text-[#0065FF] hover:bg-transparent transition-colors rounded-full"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </Button>
                    </div>
                  </div>
                </div>



                {/* Submit Button */}
                <Button
                  className="w-full py-7 text-base font-extrabold rounded-2xl bg-[#0065FF] hover:bg-[#0052cc] text-white shadow-xl shadow-blue-100 transition-all transform active:scale-[0.98] disabled:opacity-50"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? "Đang xử lý..." : "Đăng nhập ngay"}
                </Button>
              </form>

              {/* Divider */}
              <div className="relative">
                <div aria-hidden="true" className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-100"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase font-extrabold text-gray-400">
                  <span className="px-4 bg-white">Hoặc tiếp tục với</span>
                </div>
              </div>

              {/* Social Auth */}
              <Button
                variant="outline"
                onClick={handleGoogleLogin}
                className="w-full py-6 gap-3 border-gray-200 rounded-2xl bg-white text-gray-700 font-bold hover:bg-gray-50 transition-all shadow-sm"
                disabled={loading}
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Tài khoản Google
              </Button>

              {/* Footer */}
              <p className="text-center text-sm font-medium text-gray-500">
                Chưa có tài khoản?{' '}
                <Link href="/register" title="Tham gia ngay" className="font-bold text-[#0065FF] hover:underline">
                  Tham gia ngay
                </Link>
              </p>
            </CardContent>
          </Card>

          {/* Footer Small Print */}
          <footer className="mt-10 lg:mt-16 text-center text-xs text-gray-400 space-x-6 font-medium">
            <Link href="#" className="hover:text-[#0065FF] transition-colors">Chính sách bảo mật</Link>
            <Link href="#" className="hover:text-[#0065FF] transition-colors">Điều khoản dịch vụ</Link>
            <span className="opacity-50">© 2026 REDHOPE Global</span>
          </footer>
        </div>
      </main>
    </div>
  );
}
