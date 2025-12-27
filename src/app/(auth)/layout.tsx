export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen grid lg:grid-cols-2 bg-slate-950 text-white relative overflow-hidden">
            {/* Background Grid Pattern - Same as HeroSection */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
                <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-blue-500 opacity-20 blur-[100px]"></div>
                <div className="absolute right-0 bottom-0 -z-10 h-[310px] w-[310px] rounded-full bg-purple-500 opacity-20 blur-[100px]"></div>
            </div>
            {/* Left Side - Form */}
            <div className="flex flex-col justify-center items-center p-6 lg:p-12 order-2 lg:order-1 relative z-10">
                <div className="w-full max-w-sm space-y-8">
                    {children}
                </div>
            </div>

            {/* Right Side - Visual */}
            <div className="hidden lg:flex flex-col justify-center items-center p-6 order-1 lg:order-2">
                <div className="w-full h-full rounded-[2rem] overflow-hidden relative bg-[#121212] border border-gray-800/50 shadow-2xl">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 via-[#121212] to-[#121212] z-0" />

                    {/* Gradient Blob Effect */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-[150%] h-[150%] bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 blur-[100px] opacity-40 animate-pulse-slow" />
                        <div className="absolute inset-0 bg-[#121212]/30 backdrop-blur-[100px]" />
                    </div>

                    {/* Content */}
                    <div className="relative z-10 w-full h-full flex items-center justify-center p-12">
                        <div className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4 shadow-2xl transform transition-all hover:scale-105 duration-500">
                            <div className="flex items-center gap-3">
                                <span className="text-white/90 text-lg font-medium">Peça para a BarberSaaS gerenciar sua barbearia.</span>
                                <div className="ml-auto w-8 h-8 rounded-full bg-black/50 flex items-center justify-center text-white">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                                </div>
                            </div>
                            <div className="w-[2px] h-5 bg-blue-400 animate-pulse mt-1 hidden" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
