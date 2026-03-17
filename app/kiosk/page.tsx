"use client";

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { QRCodeSVG } from 'qrcode.react';

import { campaignService } from '@/services';
import { format } from 'date-fns';
import { vi } from "date-fns/locale";

/* eslint-disable @typescript-eslint/no-explicit-any */

export default function KioskPage() {
    const searchParams = useSearchParams();
    const campaignId = searchParams.get('campaignId');

    const [campaign, setCampaign] = useState<any>(null);
    const [registrations, setRegistrations] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const toggleFullScreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(() => { });
        } else {
            document.exitFullscreen?.();
        }
    };

    const fetchData = React.useCallback(async () => {
        if (!campaignId) return;
        try {
            const camp = await campaignService.getById(campaignId);
            setCampaign(camp);
            const regs = await campaignService.getCampaignRegistrations(campaignId);
            setRegistrations(regs || []);
            setLoading(false);
        } catch (error) {
            console.error("Failed to load kiosk data", error);
            setLoading(false);
        }
    }, [campaignId]);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchData();
        const interval = setInterval(fetchData, 10000);
        return () => clearInterval(interval);
    }, [fetchData]);

    const siteUrl = 'https://redhope.io.vn';
    const checkinUrl = campaignId ? `${siteUrl}/checkin?campaignId=${campaignId}` : '';

    const waitingList = registrations
        .filter(r => ['booked', 'checked-in'].includes(r.status?.toLowerCase()))
        .sort((a, b) => {
            const aCI = a.status?.toLowerCase() === 'checked-in';
            const bCI = b.status?.toLowerCase() === 'checked-in';
            if (aCI && !bCI) return -1;
            if (!aCI && bCI) return 1;
            if (aCI && bCI) return (a.queue_number || 0) - (b.queue_number || 0);
            return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        })
        .slice(0, 10);

    const checkedInCount = registrations.filter(r => r.status?.toLowerCase() === 'checked-in').length;
    const completedCount = registrations.filter(r => r.status?.toLowerCase() === 'completed').length;

    if (loading) return (
        <div className="min-h-screen bg-white flex items-center justify-center">
            <div className="flex flex-col items-center gap-5">
                <div className="w-16 h-16 border-4 border-red-100 border-t-red-600 rounded-full animate-spin"></div>
                <p className="text-base font-semibold text-slate-500">Đang khởi động...</p>
            </div>
        </div>
    );

    if (!campaign) return (
        <div className="min-h-screen bg-white flex items-center justify-center">
            <div className="text-center">
                <span className="material-symbols-outlined text-6xl text-red-200 mb-4 block">error_outline</span>
                <h2 className="text-xl font-bold text-slate-700 mb-2">Không tìm thấy chiến dịch</h2>
                <p className="text-sm text-slate-400">Vui lòng kiểm tra lại hoặc liên hệ nhân viên y tế.</p>
            </div>
        </div>
    );

    return (
        <div onDoubleClick={toggleFullScreen} className="min-h-screen bg-[#F5F5F5] flex flex-col select-none" style={{ fontFamily: "'Inter', sans-serif" }}>
            <style jsx global>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
                @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=optional');

                .ticker-wrap { overflow: hidden; }
                .ticker-content {
                    display: inline-block; white-space: nowrap;
                    animation: ticker-scroll 45s linear infinite;
                }
                @keyframes ticker-scroll {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
            `}</style>

            {/* ═══ HEADER ═══ */}
            <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center">
                        <span className="material-symbols-outlined text-white text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
                    </div>
                    <div>
                        <h1 className="text-lg font-extrabold text-slate-800 leading-tight">RED<span className="text-red-600">HOPE</span></h1>
                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-[0.2em]">Kiosk Check-in</p>
                    </div>
                </div>

                <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
                    <span className="material-symbols-outlined text-red-400 text-base" style={{ fontVariationSettings: "'FILL' 1" }}>campaign</span>
                    {campaign?.name}
                    {campaign?.location_name && (
                        <span className="text-slate-300 text-xs ml-1 flex items-center gap-1">
                            <span className="material-symbols-outlined text-[13px]">location_on</span>
                            {campaign.location_name}
                        </span>
                    )}
                </div>

                <div className="flex items-center gap-5">
                    <div className="text-right">
                        <p className="text-[10px] text-slate-400 capitalize">{format(currentTime, 'EEEE, dd/MM', { locale: vi })}</p>
                        <p className="text-lg font-bold text-slate-800 tabular-nums leading-tight">
                            {format(currentTime, 'HH:mm')}
                            <span className="text-xs text-slate-300">:{format(currentTime, 'ss')}</span>
                        </p>
                    </div>
                    <div className="flex items-center gap-1.5 bg-slate-100 px-3 py-1.5 rounded-full">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-[10px] font-bold text-slate-500">ONLINE</span>
                    </div>
                </div>
            </header>

            {/* ═══ MAIN ═══ */}
            <main className="flex-1 flex p-5 gap-5 overflow-hidden">

                {/* ─── LEFT: QR ─── */}
                <section className="flex-1 bg-white rounded-2xl border border-slate-200 p-8 flex flex-col items-center justify-center relative">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-red-600 rounded-t-2xl"></div>



                    <div className="text-center mb-5 mt-4">
                        <h2 className="text-3xl lg:text-4xl font-black text-slate-800 tracking-tight mb-2">
                            Quét mã <span className="text-red-600">Check-in</span>
                        </h2>
                        <p className="text-sm text-slate-400">Dùng camera điện thoại quét mã QR bên dưới</p>
                    </div>

                    {/* QR */}
                    <div className="bg-white p-4 rounded-xl border-2 border-red-100 shadow-sm" style={{ colorScheme: 'light', forcedColorAdjust: 'none' }}>
                        {checkinUrl ? (
                            <QRCodeSVG value={checkinUrl} size={220} level="H" includeMargin={false} bgColor="#ffffff" fgColor="#1e293b" />
                        ) : (
                            <div className="w-[220px] h-[220px] flex items-center justify-center">
                                <span className="material-symbols-outlined text-5xl text-slate-200">qr_code_2</span>
                            </div>
                        )}
                    </div>

                    {/* Steps */}
                    <div className="mt-6 flex items-center gap-2 text-xs text-slate-500">
                        <span className="flex items-center gap-1 bg-slate-50 px-3 py-2 rounded-lg border border-slate-100">
                            <span className="material-symbols-outlined text-red-500 text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>phone_iphone</span>
                            Quét QR
                        </span>
                        <span className="material-symbols-outlined text-slate-300 text-xs">arrow_forward</span>
                        <span className="flex items-center gap-1 bg-slate-50 px-3 py-2 rounded-lg border border-slate-100">
                            <span className="material-symbols-outlined text-red-500 text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>badge</span>
                            Nhập SĐT
                        </span>
                        <span className="material-symbols-outlined text-slate-300 text-xs">arrow_forward</span>
                        <span className="flex items-center gap-1 bg-slate-50 px-3 py-2 rounded-lg border border-slate-100">
                            <span className="material-symbols-outlined text-red-500 text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>confirmation_number</span>
                            Nhận STT
                        </span>
                    </div>

                </section>

                {/* ─── RIGHT: Queue ─── */}
                <section className="flex-1 bg-white rounded-2xl border border-slate-200 flex flex-col overflow-hidden relative">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-red-600 rounded-t-2xl"></div>

                    {/* Mã QR ở góc dưới bên phải */}
                    <div className="absolute bottom-6 right-6 w-24 flex flex-col items-center gap-1.5 z-10">
                        <div className="w-full bg-white p-2 rounded-xl shadow-sm border border-slate-100 hover:scale-105 transition-transform cursor-pointer drop-shadow-md flex items-center justify-center">
                            <QRCodeSVG 
                                value="https://redhope.io.vn" 
                                size={80} 
                                level="H" 
                                includeMargin={false} 
                                bgColor="#ffffff" 
                                fgColor="#dc2626" 
                            />
                        </div>
                        <p className="text-[10px] font-bold text-slate-500 tracking-wide mt-0.5">redhope.io.vn</p>
                    </div>

                    <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                            <span className="material-symbols-outlined text-red-500 text-xl">format_list_numbered</span>
                            <h3 className="text-sm font-extrabold text-slate-700">Danh sách chờ</h3>
                            <span className="text-[10px] text-slate-400 font-medium">({waitingList.length})</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-medium">
                            <span className="material-symbols-outlined text-xs text-red-400 animate-spin" style={{ animationDuration: '3s' }}>sync</span>
                            Tự động cập nhật
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-3 space-y-1.5 no-scrollbar">
                        {waitingList.map((reg, index) => {
                            const isCI = reg.status?.toLowerCase() === 'checked-in';
                            return (
                                <div key={reg.id}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all ${isCI ? 'bg-red-50/50 border-red-100' : 'bg-white border-slate-100 hover:bg-slate-50'
                                        }`}
                                >
                                    {/* STT */}
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-black text-sm shrink-0 ${isCI ? 'bg-red-600 text-white' : 'bg-slate-100 text-slate-300'
                                        }`}>
                                        {isCI ? String(reg.queue_number || '?').padStart(2, '0') : '—'}
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <p className={`text-sm font-semibold truncate ${isCI ? 'text-slate-800' : 'text-slate-500'}`}>
                                            {reg.user?.full_name || 'Khách vãng lai'}
                                        </p>
                                        <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                                            <span className="material-symbols-outlined text-[11px]">schedule</span>
                                            {isCI && reg.check_in_time
                                                ? format(new Date(reg.check_in_time), 'HH:mm')
                                                : reg.created_at ? format(new Date(reg.created_at), 'HH:mm') : '—'
                                            }
                                        </p>
                                    </div>

                                    {/* Badge */}
                                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold shrink-0 ${isCI ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-400'
                                        }`}>
                                        <span className="material-symbols-outlined text-[11px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                                            {isCI ? 'check_circle' : 'pending'}
                                        </span>
                                        {isCI ? 'Check-in' : 'Chờ'}
                                    </span>
                                </div>
                            );
                        })}

                        {waitingList.length === 0 && (
                            <div className="flex flex-col items-center justify-center h-full gap-3 py-16">
                                <span className="material-symbols-outlined text-5xl text-slate-200">inbox</span>
                                <p className="text-sm font-semibold text-slate-400">Hàng chờ trống</p>
                                <p className="text-xs text-slate-300">Quét mã QR để bắt đầu check-in</p>
                            </div>
                        )}
                    </div>
                </section>
            </main>

            {/* ═══ FOOTER ═══ */}
            <footer className="h-10 bg-white border-t border-slate-200 flex items-center overflow-hidden shrink-0">
                <div className="ticker-wrap">
                    <div className="ticker-content">
                        {[1, 2].map(dup => (
                            <React.Fragment key={dup}>
                                <span className="mx-10 inline-flex items-center gap-2 text-xs text-slate-400">
                                    <span className="material-symbols-outlined text-red-400 text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
                                    Mỗi giọt máu cho đi, một cuộc đời ở lại
                                </span>
                                <span className="mx-10 inline-flex items-center gap-2 text-xs text-slate-400">
                                    <span className="material-symbols-outlined text-red-400 text-sm">id_card</span>
                                    Vui lòng chuẩn bị CCCD gắn chip hoặc VNeID mức 2
                                </span>
                                <span className="mx-10 inline-flex items-center gap-2 text-xs text-slate-400">
                                    <span className="material-symbols-outlined text-red-400 text-sm">verified</span>
                                    Quy trình an toàn theo tiêu chuẩn Bộ Y Tế
                                </span>
                                <span className="mx-10 inline-flex items-center gap-2 text-xs text-slate-400">
                                    <span className="material-symbols-outlined text-red-400 text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>location_on</span>
                                    {campaign?.location_name || '—'}
                                </span>
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            </footer>
        </div>
    );
}
