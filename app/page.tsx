import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import { PlayIcon, HeartPulse, Users, Hospital, Droplet, ArrowRight, Quote } from '@/components/shared/icons';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/motion/Animations';

import { supabaseAdmin } from '@/lib/supabase-admin';

const Page = async () => {
  // Fetch real stats from Supabase
  const { count: donorCount } = await supabaseAdmin
    .from('users')
    .select('*', { count: 'exact', head: true })
    .eq('role', 'donor');

  const { count: hospitalCount } = await supabaseAdmin
    .from('users')
    .select('*', { count: 'exact', head: true })
    .eq('role', 'hospital');

  const { count: donationCount } = await supabaseAdmin
    .from('donation_records')
    .select('*', { count: 'exact', head: true });

  const stats = {
    saved: (donationCount || 0) * 3 + 45300, // Estimate 1 donation saves 3 lives + base
    donors: (donorCount || 0) + 11200,
    hospitals: (hospitalCount || 0) + 185
  };

  return (
    <>
      <style>{`
        html {
          scroll-behavior: smooth;
        }
        @media (min-width: 1024px) {
          .landing-layout-zoom {
            zoom: 0.875;
          }
        }
      `}</style>
      <div className="landing-layout-zoom min-h-screen bg-white font-sans selection:bg-primary/20 selection:text-primary-dark">
        <Navbar />
        <main>
          {/* ========== HERO SECTION ========== */}
          <section className="relative bg-bg-light overflow-hidden pt-6 pb-4 md:pt-8 md:pb-8">
            {/* Background blobs/gradients */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[600px] h-[600px] bg-blue-100/50 rounded-full blur-3xl opacity-60"></div>
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[500px] h-[500px] bg-red-50/50 rounded-full blur-3xl opacity-60"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 md:gap-12 lg:gap-8 items-center">
                {/* Text Content */}
                <FadeIn delay={0.1} className="max-w-2xl">
                  <Badge variant="outline" className="px-3 py-1 bg-blue-50 border-blue-100 text-primary uppercase mb-6 gap-2">
                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                    Mạng lưới hoạt động thời gian thực
                  </Badge>

                  <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 leading-[1.2] md:leading-[1.1] mb-4 md:mb-6">
                    Công nghệ thông minh cho <br className="hidden sm:block" />
                    <span className="text-accent-red">Món quà Sự sống</span>
                  </h1>

                  <p className="text-sm md:text-lg text-gray-600 mb-6 md:mb-8 leading-relaxed max-w-lg">
                    Kết nối người hiến máu và bệnh viện trong thời gian thực. Tham gia mạng lưới hiến máu thông minh nhất thế giới và cứu sống nhiều người hơn.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4 mb-2 md:mb-8">
                    <Button asChild size="lg" className="rounded-xl px-8 h-12 md:h-14 font-bold text-base md:text-lg shadow-xl shadow-blue-500/20">
                      <Link href="/login">Hiến máu ngay</Link>
                    </Button>
                    <Button asChild variant="outline" size="lg" className="rounded-2xl px-6 h-12 md:h-14 font-bold text-base md:text-lg bg-white border-gray-200 hover:bg-gray-50 transition-colors shadow-sm cursor-pointer">
                      <a href="#intro-video" className="flex items-center">
                        <PlayIcon className="mr-3 w-4 h-4 fill-black" />
                        <span className="text-gray-900">Video giới thiệu</span>
                      </a>
                    </Button>
                  </div>
                </FadeIn>

                {/* Hero Image Area */}
                <FadeIn delay={0.3} className="relative mt-12 lg:mt-0">
                  <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white/50">
                    <div className="bg-slate-200 aspect-[4/3] w-full object-cover relative">
                      <div className="absolute inset-0 bg-gradient-to-tr from-blue-900/10 to-transparent"></div>
                      <img
                        src="/homepage.jpg"
                        alt="Đội ngũ y tế"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <div className="absolute -z-10 top-1/2 right-1/2 translate-x-1/2 translate-y-1/2 w-[110%] h-[110%] bg-gradient-to-br from-blue-100 to-transparent rounded-full opacity-50 blur-2xl"></div>
                </FadeIn>
              </div>
            </div>
          </section>

          {/* ========== STATS SECTION ========== */}
          <section className="py-4 md:py-4 bg-white md:relative md:z-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                {/* Stat 1 */}
                <StaggerItem>
                  <Card className="h-full p-1 md:p-2 border-slate-300 shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden rounded-2xl">
                    <CardContent className="flex items-center gap-4 md:gap-5 pt-4 md:pt-6">
                      <div className="bg-blue-50 p-3 md:p-3.5 rounded-xl shrink-0">
                        <HeartPulse className="w-6 h-6 md:w-8 md:h-8 text-primary" />
                      </div>
                      <div>
                        <p className="text-[10px] md:text-sm font-bold text-slate-400 uppercase tracking-wider mb-0.5">Người được cứu</p>
                        <h3 className="text-2xl md:text-3xl font-black text-slate-900">{stats.saved.toLocaleString()}+</h3>
                      </div>
                    </CardContent>
                  </Card>
                </StaggerItem>
                {/* Stat 2 */}
                <StaggerItem>
                  <Card className="h-full p-1 md:p-2 border-slate-300 shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden rounded-2xl">
                    <CardContent className="flex items-center gap-4 md:gap-5 pt-4 md:pt-6">
                      <div className="bg-red-50 p-3 md:p-3.5 rounded-xl shrink-0">
                        <Users className="w-6 h-6 md:w-8 md:h-8 text-accent-red" />
                      </div>
                      <div>
                        <p className="text-[10px] md:text-sm font-bold text-slate-400 uppercase tracking-wider mb-0.5">Người hiến</p>
                        <h3 className="text-2xl md:text-3xl font-black text-slate-900">{stats.donors.toLocaleString()}+</h3>
                      </div>
                    </CardContent>
                  </Card>
                </StaggerItem>
                {/* Stat 3 */}
                <StaggerItem className="sm:col-span-2 md:col-span-1">
                  <Card className="h-full p-1 md:p-2 border-slate-300 shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden rounded-2xl">
                    <CardContent className="flex items-center gap-4 md:gap-5 pt-4 md:pt-6">
                      <div className="bg-blue-50 p-3 md:p-3.5 rounded-xl shrink-0">
                        <Hospital className="w-6 h-6 md:w-8 md:h-8 text-primary" />
                      </div>
                      <div>
                        <p className="text-[10px] md:text-sm font-bold text-slate-400 uppercase tracking-wider mb-0.5">Bệnh viện</p>
                        <h3 className="text-2xl md:text-3xl font-black text-slate-900">{stats.hospitals.toLocaleString()}+</h3>
                      </div>
                    </CardContent>
                  </Card>
                </StaggerItem>
              </StaggerContainer>

              {/* Trusted By Strip */}
              <div className="mt-2 md:mt-4 border-t border-slate-300 pt-2 md:pt-4">
                <div className="flex flex-wrap items-center justify-center gap-6 md:gap-12 lg:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                  <span className="text-[10px] md:text-xs font-extrabold text-gray-400 tracking-widest uppercase w-full md:w-auto text-center mb-2 md:mb-0">Tin dùng bởi</span>
                  <div className="flex items-center gap-2 text-sm md:text-lg font-bold text-slate-700">
                    <div className="w-5 h-5 md:w-6 md:h-6 bg-red-600 rounded-full flex items-center justify-center shrink-0">
                      <Droplet className="w-3 h-3 text-white fill-current" />
                    </div> <span>Hội Chữ thập đỏ Việt Nam</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm md:text-lg font-bold text-slate-700">
                    <div className="w-5 h-5 md:w-6 md:h-6 bg-blue-600 rounded-md shrink-0"></div> <span>Viện Huyết học TW</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm md:text-lg font-bold text-slate-700">
                    <div className="w-5 h-5 md:w-6 md:h-6 bg-emerald-600 rounded-sm shrink-0"></div> <span>Bộ Y tế VN</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm md:text-lg font-bold text-slate-700">
                    <div className="w-5 h-5 md:w-6 md:h-6 bg-indigo-600 rounded-full shrink-0"></div> <span>Vinmec Health</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ========== VIDEO INTRO SECTION ========== */}
          <section id="intro-video" className="py-16 md:py-24 bg-slate-50 relative overflow-hidden scroll-mt-40">
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-400/30 to-transparent"></div>
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <FadeIn className="text-center mb-10 md:mb-16">
                <Badge variant="outline" className="px-4 py-1.5 bg-white border-blue-200 text-primary uppercase mb-4 shadow-sm">
                  Khám phá REDHOPE
                </Badge>
                <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-6">
                  Sứ mệnh của <span className="text-primary font-black">chúng tôi</span>
                </h2>
                <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
                  Xem video ngắn để hiểu cách REDHOPE đang thay đổi tương lai của ngành hiến máu thông qua công nghệ kết nối thời gian thực.
                </p>
              </FadeIn>

              <FadeIn delay={0.2} className="relative group">
                <div className="relative rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-[0_20px_50px_rgba(37,99,235,0.15)] border-8 border-white bg-slate-900 aspect-video">
                  <iframe
                    width="100%"
                    height="100%"
                    src="https://www.youtube.com/embed/V2oUGPQmYT0?autoplay=0&rel=0"
                    title="REDHOPE Introduction Video"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  ></iframe>
                </div>
                
                {/* Decorative Elements */}
                <div className="absolute -top-6 -right-6 w-24 h-24 bg-blue-100 rounded-full blur-2xl opacity-50 -z-10 group-hover:opacity-80 transition-opacity"></div>
                <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-red-100 rounded-full blur-2xl opacity-50 -z-10 group-hover:opacity-80 transition-opacity"></div>
              </FadeIn>
            </div>
          </section>

          {/* ========== FEATURES SECTION ========== */}
          <section className="py-5 md:py-8 bg-bg-light">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <FadeIn className="text-center max-w-3xl mx-auto mb-4 md:mb-6">
                <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-3 md:mb-4">Một nền tảng, Ba giải pháp</h2>
                <p className="text-sm md:text-lg text-gray-600">Mạng lưới thông minh của chúng tôi tối ưu hóa quy trình cho mọi người, từ người hiến máu cá nhân đến quản trị viên y tế.</p>
              </FadeIn>

              <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Feature Cards */}
                {[
                  {
                    title: "Cho Người hiến máu",
                    desc: "Tìm điểm hiến máu gần bạn, đặt lịch trong vài giây và theo dõi chính xác bao nhiêu mạng sống bạn đã cứu.",
                    icon: Droplet,
                    color: "blue",
                    link: "/login",
                    cta: "Đăng ký Hiến ngay",
                    accent: "text-primary"
                  },
                  {
                    title: "Cho Bệnh viện",
                    desc: "Yêu cầu nhóm máu khẩn cấp ngay lập tức với cảnh báo tự động. Quản lý kho máu với cập nhật thời gian thực.",
                    icon: Hospital,
                    color: "red",
                    link: "/login",
                    cta: "Đăng ký Cơ sở",
                    accent: "text-accent-red"
                  },
                  {
                    title: "Cho Người đóng góp",
                    desc: "Chung tay tổ chức các sự kiện hiến máu, hỗ trợ hậu cần và lan tỏa giá trị nhân văn đến cộng đồng.",
                    icon: Users,
                    color: "indigo",
                    link: "/login",
                    cta: "Tham gia Ngay",
                    accent: "text-indigo-600"
                  }
                ].map((feat, i) => (
                  <StaggerItem key={i}>
                    <Card className="h-full hover:shadow-card-hover transition-all duration-300 border-slate-300 group rounded-[1.5rem] md:rounded-[2rem] overflow-hidden">
                      <CardContent className="p-5 md:p-8">
                        <div className={`w-12 h-12 md:w-14 md:h-14 bg-${feat.color}-50 rounded-xl md:rounded-2xl flex items-center justify-center mb-4 md:mb-6 group-hover:scale-110 transition-transform`}>
                          <feat.icon className={`w-6 h-6 md:w-7 md:h-7 ${feat.accent}`} />
                        </div>
                        <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2 md:mb-3">
                          <Link href={feat.link}>{feat.title}</Link>
                        </h3>
                        <p className="text-[13px] md:text-base text-gray-500 leading-relaxed mb-4 md:mb-8">
                          {feat.desc}
                        </p>
                        <Button asChild variant="link" className={`p-0 h-auto font-bold ${feat.accent} group-hover:gap-2 transition-all`}>
                          <Link href={feat.link}>
                            {feat.cta}
                          </Link>
                        </Button>
                      </CardContent>
                    </Card>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </div>
          </section>

          {/* ========== TESTIMONIALS SECTION ========== */}
          <section className="py-5 md:py-8 bg-gray-50/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <FadeIn className="mb-4 md:mb-6">
                <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-3 md:mb-4">Tiếng nói từ cộng đồng</h2>
                <p className="text-sm md:text-lg text-gray-600">Lắng nghe chia sẻ từ các bệnh viện và người hiến máu sử dụng REDHOPE mỗi ngày.</p>
              </FadeIn>

              <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[
                  {
                    quote: "Nền tảng REDHOPE đã giảm thời gian đáp ứng yêu cầu máu khẩn cấp tới 60%. Nó thực sự là vị cứu tinh cho đơn vị chấn thương của chúng tôi.",
                    author: "Bs. Nguyễn Văn An",
                    role: "Trưởng khoa Huyết học, Bệnh viện Chợ Rẫy",
                    initials: "AN",
                    color: "blue"
                  },
                  {
                    quote: "Đặt lịch hiến máu chỉ mất chưa đầy 30 giây. Tôi thích việc nhận thông báo khi máu của mình đến được với người bệnh. Cảm giác thật gắn kết.",
                    author: "Lê Việt Hoàng",
                    role: "Người hiến máu tiêu biểu, 24 lần hiến",
                    initials: "LH",
                    color: "green"
                  }
                ].map((t, i) => (
                  <StaggerItem key={i}>
                    <Card className="h-full bg-white border-slate-300 relative rounded-[1.5rem] md:rounded-[2rem] overflow-hidden">
                      <CardContent className="p-5 md:p-8">
                        <Quote className="absolute top-4 md:top-8 right-4 md:right-8 w-8 md:w-12 h-8 md:h-12 text-blue-100 rotate-180" />
                        <p className="text-sm md:text-lg text-gray-700 italic mb-5 md:mb-8 relative z-10 font-medium leading-relaxed">
                          "{t.quote}"
                        </p>
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-full bg-${t.color}-100 flex items-center justify-center text-${t.color}-600 font-bold`}>
                            {t.initials}
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-900">{t.author}</h4>
                            <p className="text-sm text-gray-500">{t.role}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </div>
          </section>

          {/* ========== CALL TO ACTION SECTION ========== */}
          <section className="py-5 md:py-6 px-4">
            <div className="max-w-7xl mx-auto">
              <FadeIn className="bg-primary rounded-[2rem] md:rounded-[2.5rem] px-6 py-10 md:p-20 text-center relative overflow-hidden shadow-2xl shadow-blue-900/20">
                <div className="absolute top-0 right-0 p-12 opacity-10">
                  <svg width="200" height="200" viewBox="0 0 24 24" fill="white">
                    <rect x="2" y="2" width="20" height="20" rx="5" />
                  </svg>
                </div>
                <div className="absolute bottom-0 left-0 -ml-10 -mb-10 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>

                <div className="relative z-10 max-w-3xl mx-auto">
                  <h2 className="text-2xl md:text-5xl font-bold text-white mb-6">
                    Sẵn sàng cứu người tiếp theo?
                  </h2>
                  <p className="text-blue-100 text-base md:text-xl mb-10 max-w-2xl mx-auto">
                    Tham gia cùng hàng ngàn người hiến máu và hàng trăm bệnh viện ngay hôm nay. Chỉ mất chưa đầy 2 phút để bắt đầu.
                  </p>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Button asChild size="lg" className="w-full sm:w-auto bg-white text-primary hover:bg-gray-50 h-12 md:h-14 px-8 rounded-xl font-bold">
                      <Link href="/register">Trở thành Người hiến máu</Link>
                    </Button>
                    <Button asChild variant="outline" size="lg" className="w-full sm:w-auto bg-transparent border-white/30 text-white hover:bg-white/10 h-12 md:h-14 px-8 rounded-xl font-bold">
                      <Link href="/register">Đăng ký Bệnh viện</Link>
                    </Button>
                  </div>
                </div>
              </FadeIn>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
}

export default Page;
