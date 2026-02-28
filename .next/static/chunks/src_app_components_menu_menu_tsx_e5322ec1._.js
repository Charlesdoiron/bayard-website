(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/app/components/menu/menu.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Menu
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$shared$2f$lib$2f$app$2d$dynamic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/shared/lib/app-dynamic.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
const DotLottiePlayer = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$shared$2f$lib$2f$app$2d$dynamic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(()=>__turbopack_context__.A("[project]/node_modules/@dotlottie/react-player/dist/index.js [app-client] (ecmascript, next/dynamic entry, async loader)").then((mod)=>mod.DotLottiePlayer), {
    loadableGenerated: {
        modules: [
            "[project]/node_modules/@dotlottie/react-player/dist/index.js [app-client] (ecmascript, next/dynamic entry)"
        ]
    },
    ssr: false
});
_c = DotLottiePlayer;
const menuItems = [
    {
        href: "#presentation",
        label: "Présentation"
    },
    {
        href: "#activities",
        label: "Activités"
    },
    {
        href: "#infrastructures",
        label: "Infrastructures"
    },
    {
        href: "#infos",
        label: "Infos pratiques"
    },
    {
        href: "#contact",
        label: "Contact"
    }
];
function Menu() {
    _s();
    const [isVisible, setIsVisible] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [lastScrollY, setLastScrollY] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isPastHero, setIsPastHero] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isScrolling, setIsScrolling] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const scrollTimeoutRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const lottieRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const prevScrollY = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(0);
    const prevTime = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(Date.now());
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Menu.useEffect": ()=>{
            const handleScroll = {
                "Menu.useEffect.handleScroll": ()=>{
                    const currentScrollY = window.scrollY;
                    // Detect if we've scrolled past the hero section
                    const heroHeight = window.innerWidth >= 768 ? window.innerHeight : window.innerHeight * 0.7;
                    setIsPastHero(currentScrollY > heroHeight - 100);
                    // Lottie speed based on scroll velocity
                    const now = Date.now();
                    const dt = now - prevTime.current || 16;
                    const dy = Math.abs(currentScrollY - prevScrollY.current);
                    const velocity = dy / dt; // px/ms
                    const speed = Math.min(Math.max(velocity * 3, 0.3), 4);
                    prevScrollY.current = currentScrollY;
                    prevTime.current = now;
                    if (lottieRef.current) {
                        lottieRef.current.setSpeed(speed);
                    }
                    setIsScrolling(true);
                    if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
                    scrollTimeoutRef.current = setTimeout({
                        "Menu.useEffect.handleScroll": ()=>setIsScrolling(false)
                    }["Menu.useEffect.handleScroll"], 150);
                    // Don't hide menu if we're at the very top
                    if (currentScrollY < 10) {
                        setIsVisible(true);
                        setLastScrollY(currentScrollY);
                        return;
                    }
                    // Hide menu when scrolling down, show when scrolling up
                    if (currentScrollY > lastScrollY && currentScrollY > 80) {
                        setIsVisible(false);
                    } else if (currentScrollY < lastScrollY) {
                        setIsVisible(true);
                    }
                    setLastScrollY(currentScrollY);
                }
            }["Menu.useEffect.handleScroll"];
            // Add scroll listener
            window.addEventListener("scroll", handleScroll, {
                passive: true
            });
            return ({
                "Menu.useEffect": ()=>{
                    window.removeEventListener("scroll", handleScroll);
                }
            })["Menu.useEffect"];
        }
    }["Menu.useEffect"], [
        lastScrollY
    ]);
    // Close mobile menu when clicking outside or on links
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Menu.useEffect": ()=>{
            const handleClickOutside = {
                "Menu.useEffect.handleClickOutside": (event)=>{
                    if (isMobileMenuOpen && !event.target.closest(".mobile-menu-container")) {
                        setIsMobileMenuOpen(false);
                    }
                }
            }["Menu.useEffect.handleClickOutside"];
            document.addEventListener("click", handleClickOutside);
            return ({
                "Menu.useEffect": ()=>document.removeEventListener("click", handleClickOutside)
            })["Menu.useEffect"];
        }
    }["Menu.useEffect"], [
        isMobileMenuOpen
    ]);
    // Prevent body scroll when mobile menu is open
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Menu.useEffect": ()=>{
            if (isMobileMenuOpen) {
                document.documentElement.style.overflow = "hidden";
                document.body.style.overflow = "hidden";
            } else {
                document.documentElement.style.overflow = "unset";
                document.body.style.overflow = "unset";
            }
            return ({
                "Menu.useEffect": ()=>{
                    document.documentElement.style.overflow = "unset";
                    document.body.style.overflow = "unset";
                }
            })["Menu.useEffect"];
        }
    }["Menu.useEffect"], [
        isMobileMenuOpen
    ]);
    // Play/pause lottie based on scroll
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Menu.useEffect": ()=>{
            if (!lottieRef.current) return;
            if (isScrolling) {
                lottieRef.current.play();
            } else {
                lottieRef.current.pause();
            }
        }
    }["Menu.useEffect"], [
        isScrolling
    ]);
    const handleMobileMenuToggle = ()=>{
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };
    const handleMobileLinkClick = ()=>{
        setIsMobileMenuOpen(false);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
        className: "fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out transform translate-y-0 ".concat(isMobileMenuOpen ? "bg-black" : isPastHero ? "lg:bg-black bg-transparent" : "bg-transparent"),
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                className: "relative flex items-center justify-between px-4 md:px-8 lg:px-12 transition-all duration-300 py-4 md:py-6 ".concat(isPastHero && !isMobileMenuOpen ? "lg:py-0" : ""),
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex-shrink-0 transition-opacity duration-300 ".concat(isPastHero && !isMobileMenuOpen ? "opacity-0 pointer-events-none" : "opacity-100"),
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            href: "/",
                            className: "block p-2 -m-2",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "relative",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    src: "/logo.svg",
                                    alt: "Logo Club Bayard",
                                    width: 60,
                                    height: 60,
                                    className: "brightness-0 invert"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/components/menu/menu.tsx",
                                    lineNumber: 149,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/app/components/menu/menu.tsx",
                                lineNumber: 148,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/app/components/menu/menu.tsx",
                            lineNumber: 147,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/components/menu/menu.tsx",
                        lineNumber: 144,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        onClick: ()=>window.scrollTo({
                                top: 0,
                                behavior: "smooth"
                            }),
                        className: "flex-shrink-0 transition-all duration-300 absolute left-4 sm:left-6 lg:left-8 flex items-center gap-3 cursor-pointer ".concat(isPastHero && !isMobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"),
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "bg-white lg:bg-transparent rounded-full p-2 ring-1 ring-black/5 lg:ring-0 shadow-sm lg:shadow-none",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "brightness-0 lg:brightness-0 lg:invert",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(DotLottiePlayer, {
                                        ref: lottieRef,
                                        src: "/horse.lottie",
                                        autoplay: isScrolling,
                                        loop: true,
                                        style: {
                                            width: 32,
                                            height: 32
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/components/menu/menu.tsx",
                                        lineNumber: 167,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/app/components/menu/menu.tsx",
                                    lineNumber: 166,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/app/components/menu/menu.tsx",
                                lineNumber: 165,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "-ml-3 hidden lg:block text-white/50 text-sm font-medium font-[family-name:var(--font-inter)] tracking-wide -mb-1",
                                children: "| Club Bayard Equitation"
                            }, void 0, false, {
                                fileName: "[project]/src/app/components/menu/menu.tsx",
                                lineNumber: 176,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/components/menu/menu.tsx",
                        lineNumber: 161,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "hidden lg:flex items-center gap-3 xl:gap-4 font-[family-name:var(--font-inter)]",
                        children: menuItems.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    href: item.href,
                                    className: "relative group px-3 xl:px-4 py-2 text-md  font-medium whitespace-nowrap text-white hover:text-white",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "relative z-10 tracking-wide",
                                            children: item.label
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/components/menu/menu.tsx",
                                            lineNumber: 189,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "absolute bottom-1 left-3 xl:left-4 right-3 xl:right-4 h-px bg-white rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-200"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/components/menu/menu.tsx",
                                            lineNumber: 194,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/components/menu/menu.tsx",
                                    lineNumber: 185,
                                    columnNumber: 15
                                }, this)
                            }, item.label, false, {
                                fileName: "[project]/src/app/components/menu/menu.tsx",
                                lineNumber: 184,
                                columnNumber: 13
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/src/app/components/menu/menu.tsx",
                        lineNumber: 182,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: handleMobileMenuToggle,
                        className: "lg:hidden mobile-menu-container transition-all duration-300 bg-white rounded-full p-3 ring-1 ring-black/5 shadow-sm text-black hover:text-black ".concat(isMobileMenuOpen ? "mr-2" : ""),
                        "aria-label": "Toggle mobile menu",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "w-6 h-6 flex flex-col justify-center items-center space-y-1 cursor-pointer",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "w-full h-0.5 bg-current rounded-full transition-all duration-300 ".concat(isMobileMenuOpen ? "rotate-45 translate-y-1.5" : "")
                                }, void 0, false, {
                                    fileName: "[project]/src/app/components/menu/menu.tsx",
                                    lineNumber: 207,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "w-full h-0.5 bg-current rounded-full transition-all duration-300 ".concat(isMobileMenuOpen ? "opacity-0" : "")
                                }, void 0, false, {
                                    fileName: "[project]/src/app/components/menu/menu.tsx",
                                    lineNumber: 212,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "w-full h-0.5 bg-current rounded-full transition-all duration-300 ".concat(isMobileMenuOpen ? "-rotate-45 -translate-y-1.5" : "")
                                }, void 0, false, {
                                    fileName: "[project]/src/app/components/menu/menu.tsx",
                                    lineNumber: 217,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/components/menu/menu.tsx",
                            lineNumber: 206,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/components/menu/menu.tsx",
                        lineNumber: 201,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/components/menu/menu.tsx",
                lineNumber: 140,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mobile-menu-container lg:hidden fixed inset-x-0 top-full bg-black/95 backdrop-blur-md transition-all duration-300 ease-in-out transform ".concat(isMobileMenuOpen ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-4 pointer-events-none"),
                style: {
                    zIndex: 40,
                    maxHeight: isMobileMenuOpen ? "100vh" : "0",
                    overflow: "hidden"
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                    className: "px-4 py-6 space-y-1 font-[family-name:var(--font-inter)]",
                    children: menuItems.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            href: item.href,
                            onClick: handleMobileLinkClick,
                            className: "block w-full text-left px-4 py-4 text-white/90 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200 text-lg font-medium uppercase tracking-wide",
                            children: item.label
                        }, item.label, false, {
                            fileName: "[project]/src/app/components/menu/menu.tsx",
                            lineNumber: 241,
                            columnNumber: 13
                        }, this))
                }, void 0, false, {
                    fileName: "[project]/src/app/components/menu/menu.tsx",
                    lineNumber: 239,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/components/menu/menu.tsx",
                lineNumber: 227,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/components/menu/menu.tsx",
        lineNumber: 135,
        columnNumber: 5
    }, this);
}
_s(Menu, "trUdbxiyBoxZRi6lQ/dx55isNjg=");
_c1 = Menu;
var _c, _c1;
__turbopack_context__.k.register(_c, "DotLottiePlayer");
__turbopack_context__.k.register(_c1, "Menu");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_app_components_menu_menu_tsx_e5322ec1._.js.map