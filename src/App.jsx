import { useState, useEffect, useRef } from "react";

// ─── DATA ────────────────────────────────────────────────────────────────────

const VIDEOS = [
  {
    id: 1,
    title: "Yosemite Valley",
    thumbnail: "/images/video1cover.jpg",
    views: "1.1M",
    likes: "242K",
    shares: "18.5K",
    tiktokUrl: "https://www.tiktok.com/t/ZP89uen72/",
  },
  {
    id: 2,
    title: "Grand Tetons",
    thumbnail: "/images/video2cover.jpg",
    views: "714K",
    likes: "149K",
    shares: "11.2K",
    tiktokUrl: "https://www.tiktok.com/t/ZP89mpQqn/",
  },
  {
    id: 3,
    title: "Grand Tetons",
    thumbnail: "/images/video3cover.jpg",
    views: "549K",
    likes: "119K",
    shares: "8.7K",
    tiktokUrl: "https://www.tiktok.com/t/ZP89mc42T/",
  },
];

const STATS = [
  { label: "Total Impressions", value: "7M+", suffix: "" },
  { label: "Total Shares", value: "83K", suffix: "" },
  { label: "Videos Created", value: "48", suffix: "" },
  { label: "Destinations Featured", value: "5", suffix: "" },
];

const DESTINATIONS = [
  {
    id: 1,
    name: "Yosemite Valley",
    location: "Sierra Nevada, California",
    type: "National Park",
    image: "/images/yosemite.jpeg",
    description: "Towering granite cliffs, ancient sequoias, and waterfalls that define the American West. Vintage footage paired with modern beats brings new life to an icon.",
    stats: { views: "1.1M", videos: 12 },
  },
  {
    id: 2,
    name: "Grand Teton Range",
    location: "Jackson Hole, Wyoming",
    type: "National Park",
    image: "/images/tetons.jpeg",
    description: "Jagged peaks rising from alpine meadows. These mountains don't need introduction — they just need to be seen by the right people.",
    stats: { views: "1.2M", videos: 10 },
  },
  {
    id: 3,
    name: "Glacier Backcountry",
    location: "Northern Rockies, Montana",
    type: "National Park",
    image: "/images/glacier.jpeg",
    description: "Glacial lakes, grizzly country, and landscapes that feel untouched. We're bringing attention to one of America's most underrated wildernesses.",
    stats: { views: "680K", videos: 8 },
  },
  {
    id: 4,
    name: "Yellowstone",
    location: "Greater Yellowstone Ecosystem, Wyoming",
    type: "National Park",
    image: "/images/yellowstone.jpeg",
    description: "Geysers, bison, and thermal features unlike anywhere else on Earth. America's first national park still draws millions — we're making sure the next generation sees it.",
    stats: { views: "890K", videos: 10 },
  },
  {
    id: 5,
    name: "Mount Rainier",
    location: "Cascade Range, Washington",
    type: "National Park",
    image: "/images/ranier.jpeg",
    description: "A volcanic giant dominating the Pacific Northwest skyline. Wildflower meadows, glaciers, and old-growth forests waiting to be discovered.",
    stats: { views: "520K", videos: 6 },
  },
];


// ─── COMPONENTS ──────────────────────────────────────────────────────────────

function AnimatedNumber({ value, suffix = "", delay = 0 }) {
  const [displayed, setDisplayed] = useState("0");
  const [started, setStarted] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting && !started) setStarted(true); },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    const timeout = setTimeout(() => {
      const clean = value.replace(/[^0-9.]/g, "");
      const num = parseFloat(clean);
      const hasSuffix = value.replace(/[0-9.]/g, "").replace(suffix, "");
      const duration = 1800;
      const steps = 60;
      const stepTime = duration / steps;
      let current = 0;
      const interval = setInterval(() => {
        current++;
        const progress = current / steps;
        const eased = 1 - Math.pow(1 - progress, 3);
        const currentVal = num * eased;
        if (num >= 1 && !value.includes(".")) {
          setDisplayed(Math.round(currentVal) + hasSuffix);
        } else {
          setDisplayed(currentVal.toFixed(1) + hasSuffix);
        }
        if (current >= steps) { setDisplayed(value); clearInterval(interval); }
      }, stepTime);
      return () => clearInterval(interval);
    }, delay);
    return () => clearTimeout(timeout);
  }, [started, value, suffix, delay]);

  return <span ref={ref}>{displayed}{suffix}</span>;
}

function VideoCard({ video, index }) {
  const [hovered, setHovered] = useState(false);
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      onClick={() => window.open(video.tiktokUrl, "_blank")}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(40px)",
        transition: `all 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.1}s`,
        cursor: "pointer",
        position: "relative",
        borderRadius: "12px",
        overflow: "hidden",
        aspectRatio: "9/14",
        background: "#1a1a1a",
      }}
    >
      <img src={video.thumbnail} alt={video.title} style={{
        width: "100%", height: "100%", objectFit: "cover",
        transition: "transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), filter 0.5s ease",
        transform: hovered ? "scale(1.05)" : "scale(1)",
        filter: hovered ? "brightness(0.6)" : "brightness(0.75)",
      }} />
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "70%",
        background: "linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.3) 50%, transparent 100%)", pointerEvents: "none" }} />
      <div style={{
        position: "absolute", top: "50%", left: "50%",
        transform: hovered ? "translate(-50%, -50%) scale(1)" : "translate(-50%, -50%) scale(0.5)",
        opacity: hovered ? 1 : 0, transition: "all 0.3s ease",
        width: "56px", height: "56px", borderRadius: "50%",
        background: "rgba(255,255,255,0.15)", backdropFilter: "blur(10px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        border: "1px solid rgba(255,255,255,0.3)",
      }}>
        <svg width="20" height="24" viewBox="0 0 20 24" fill="none"><path d="M2 2L18 12L2 22V2Z" fill="white" /></svg>
      </div>
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "20px", display: "flex", flexDirection: "column", gap: "10px" }}>
        <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "18px", fontWeight: 500, color: "#fff", letterSpacing: "0.02em", lineHeight: 1.2 }}>
          {video.title}
        </span>
        <div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
          {[{ icon: "👁", val: video.views }, { icon: "♥", val: video.likes }, { icon: "↗", val: video.shares }].map((s, i) => (
            <span key={i} style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12px", color: "rgba(255,255,255,0.7)", letterSpacing: "0.05em", display: "flex", alignItems: "center", gap: "4px" }}>
              <span style={{ fontSize: "10px" }}>{s.icon}</span> {s.val}
            </span>
          ))}
        </div>
        <div style={{ opacity: hovered ? 1 : 0, transform: hovered ? "translateY(0)" : "translateY(8px)", transition: "all 0.3s ease 0.05s", display: "flex", alignItems: "center", gap: "6px", marginTop: "2px" }}>
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "0.12em" }}>
            View on TikTok →
          </span>
        </div>
      </div>
    </div>
  );
}

function DestinationCard({ destination, index }) {
  const [hovered, setHovered] = useState(false);
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(40px)",
        transition: `all 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.15}s`,
        cursor: "pointer",
        position: "relative",
        borderRadius: "12px",
        overflow: "hidden",
        background: "#111",
        border: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div style={{ position: "relative", aspectRatio: "3/2", overflow: "hidden" }}>
        <img src={destination.image} alt={destination.name} style={{
          width: "100%", height: "100%", objectFit: "cover",
          transition: "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
          transform: hovered ? "scale(1.05)" : "scale(1)",
          filter: "brightness(0.7) saturate(0.85)",
        }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 60%)" }} />
        <div style={{ position: "absolute", top: "16px", left: "16px" }}>
          <span style={{
            fontFamily: "'DM Sans', sans-serif", fontSize: "9px", fontWeight: 500,
            letterSpacing: "0.2em", textTransform: "uppercase", color: "#c4a478",
            background: "rgba(0,0,0,0.5)", backdropFilter: "blur(10px)",
            padding: "6px 12px", borderRadius: "100px",
            border: "1px solid rgba(196,164,120,0.2)",
          }}>
            {destination.type}
          </span>
        </div>
        <div style={{ position: "absolute", bottom: "16px", right: "16px", display: "flex", gap: "12px" }}>
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", color: "rgba(255,255,255,0.6)" }}>
            👁 {destination.stats.views}
          </span>
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", color: "rgba(255,255,255,0.6)" }}>
            🎬 {destination.stats.videos} videos
          </span>
        </div>
      </div>
      <div style={{ padding: "24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "8px" }}>
          <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "24px", fontWeight: 500, color: "#fff" }}>
            {destination.name}
          </h3>
        </div>
        <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", letterSpacing: "0.15em", textTransform: "uppercase", color: "#c4a478", display: "block", marginBottom: "12px" }}>
          {destination.location}
        </span>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", fontWeight: 300, lineHeight: 1.7, color: "rgba(255,255,255,0.4)" }}>
          {destination.description}
        </p>
        <div style={{
          marginTop: "16px", paddingTop: "16px", borderTop: "1px solid rgba(255,255,255,0.06)",
          display: "flex", alignItems: "center", gap: "6px",
          opacity: hovered ? 1 : 0.4, transition: "opacity 0.3s ease",
        }}>
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", color: "#c4a478", textTransform: "uppercase", letterSpacing: "0.12em" }}>
            Read the feature →
          </span>
        </div>
      </div>
    </div>
  );
}


// ─── MAIN APP ────────────────────────────────────────────────────────────────

export default function RidgecraftStudio() {
  const [scrollY, setScrollY] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const sectionLabel = (text) => ({
    fontFamily: "'DM Sans', sans-serif", fontSize: "10px", fontWeight: 400,
    letterSpacing: "0.35em", textTransform: "uppercase", color: "#c4a478",
    display: "block", marginBottom: "16px",
  });

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", color: "#fff", fontFamily: "'DM Sans', sans-serif", overflowX: "hidden" }}>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet" />

      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        ::selection { background: rgba(196, 164, 120, 0.4); }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes grain {
          0%, 100% { transform: translate(0, 0); } 10% { transform: translate(-5%, -10%); }
          30% { transform: translate(3%, -15%); } 50% { transform: translate(-10%, 5%); }
          70% { transform: translate(8%, -5%); } 90% { transform: translate(-3%, 10%); }
        }
        
        /* Mobile Nav */
        @media (max-width: 900px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: block !important; }
        }
      `}</style>

      {/* Film grain */}
      <div style={{
        position: "fixed", top: "-50%", left: "-50%", width: "200%", height: "200%",
        background: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E")`,
        pointerEvents: "none", zIndex: 1000, animation: "grain 0.5s steps(1) infinite", opacity: 0.5,
      }} />

      {/* ── NAV ── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, padding: "24px 40px",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        background: scrollY > 50 ? "rgba(10,10,10,0.85)" : "transparent",
        backdropFilter: scrollY > 50 ? "blur(20px)" : "none", transition: "all 0.4s ease",
        borderBottom: scrollY > 50 ? "1px solid rgba(255,255,255,0.06)" : "1px solid transparent",
      }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: "4px" }}>
          <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "22px", fontWeight: 600, letterSpacing: "0.08em", color: "#c4a478" }}>RIDGECRAFT</span>
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "10px", fontWeight: 300, letterSpacing: "0.25em", color: "rgba(255,255,255,0.35)", textTransform: "uppercase" }}>studio</span>
        </div>
        
        {/* Desktop Nav */}
        <div style={{ display: "flex", gap: "32px", alignItems: "center" }} className="desktop-nav">
          {["Destinations", "Content", "About", "Contact"].map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`} style={{
              fontFamily: "'DM Sans', sans-serif", fontSize: "12px", fontWeight: 400,
              letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)",
              textDecoration: "none", transition: "color 0.3s ease",
            }}
              onMouseEnter={(e) => (e.target.style.color = "#c4a478")}
              onMouseLeave={(e) => (e.target.style.color = "rgba(255,255,255,0.5)")}
            >{item}</a>
          ))}
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="mobile-menu-btn"
          style={{
            display: "none",
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "8px",
            zIndex: 101,
          }}
        >
          <div style={{ width: "24px", height: "2px", background: "#c4a478", marginBottom: "6px", transition: "all 0.3s ease", transform: mobileMenuOpen ? "rotate(45deg) translateY(8px)" : "none" }} />
          <div style={{ width: "24px", height: "2px", background: "#c4a478", marginBottom: "6px", opacity: mobileMenuOpen ? 0 : 1, transition: "opacity 0.3s ease" }} />
          <div style={{ width: "24px", height: "2px", background: "#c4a478", transition: "all 0.3s ease", transform: mobileMenuOpen ? "rotate(-45deg) translateY(-8px)" : "none" }} />
        </button>
      </nav>

      {/* Mobile Menu Overlay */}
      <div style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(10,10,10,0.98)",
        backdropFilter: "blur(20px)",
        zIndex: 99,
        display: mobileMenuOpen ? "flex" : "none",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: "32px",
      }}>
        {["Destinations", "Content", "About", "Contact"].map((item) => (
          <a 
            key={item} 
            href={`#${item.toLowerCase()}`}
            onClick={() => setMobileMenuOpen(false)}
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "18px",
              fontWeight: 400,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.7)",
              textDecoration: "none",
              transition: "color 0.3s ease",
            }}
            onMouseEnter={(e) => (e.target.style.color = "#c4a478")}
            onMouseLeave={(e) => (e.target.style.color = "rgba(255,255,255,0.7)")}
          >
            {item}
          </a>
        ))}
      </div>

      {/* ── HERO ── */}
      <section style={{ height: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", position: "relative", overflow: "hidden" }}>
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "url('/images/smokies.jpeg')",
          backgroundSize: "cover", backgroundPosition: "center",
          filter: "brightness(0.25) saturate(0.6)",
          transform: `scale(${1 + scrollY * 0.0003})`, transition: "transform 0.1s linear",
        }} />
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 30% 70%, rgba(196, 164, 120, 0.08) 0%, transparent 60%)" }} />

        <div style={{ position: "relative", textAlign: "center", maxWidth: "900px", padding: "0 40px" }}>
          <div style={{ animation: "fadeUp 1s ease forwards", animationDelay: "0.2s", opacity: 0 }}>
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", fontWeight: 400, letterSpacing: "0.35em", textTransform: "uppercase", color: "#c4a478", display: "block", marginBottom: "28px" }}>
              A Destination Media Brand
            </span>
          </div>
          <h1 style={{
            fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(42px, 7vw, 88px)",
            fontWeight: 300, lineHeight: 1.05, letterSpacing: "-0.01em",
            animation: "fadeUp 1s ease forwards", animationDelay: "0.4s", opacity: 0,
          }}>
            Bringing destinations<br />
            <em style={{ fontStyle: "italic", color: "#c4a478", fontWeight: 300 }}>to life</em>
          </h1>
          <p style={{
            fontFamily: "'DM Sans', sans-serif", fontSize: "15px", fontWeight: 300, lineHeight: 1.8,
            color: "rgba(255,255,255,0.45)", maxWidth: "520px", margin: "32px auto 0",
            animation: "fadeUp 1s ease forwards", animationDelay: "0.6s", opacity: 0,
          }}>
            Reaching the next generation of travelers at scale with the destinations worth the trip.
          </p>
          <div style={{ animation: "fadeUp 1s ease forwards", animationDelay: "0.8s", opacity: 0, marginTop: "48px", display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
            <a href="#destinations" style={{
              fontFamily: "'DM Sans', sans-serif", fontSize: "11px", fontWeight: 500,
              letterSpacing: "0.2em", textTransform: "uppercase", color: "#0a0a0a",
              background: "#c4a478", padding: "16px 36px", textDecoration: "none",
              display: "inline-block", transition: "all 0.3s ease",
            }}
              onMouseEnter={(e) => { e.target.style.background = "#d4b88a"; e.target.style.transform = "translateY(-2px)"; }}
              onMouseLeave={(e) => { e.target.style.background = "#c4a478"; e.target.style.transform = "translateY(0)"; }}
            >Explore Destinations</a>
            <a href="#contact" style={{
              fontFamily: "'DM Sans', sans-serif", fontSize: "11px", fontWeight: 500,
              letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)",
              border: "1px solid rgba(255,255,255,0.15)", padding: "16px 36px",
              textDecoration: "none", display: "inline-block", transition: "all 0.3s ease",
            }}
              onMouseEnter={(e) => { e.target.style.color = "#c4a478"; e.target.style.borderColor = "rgba(196,164,120,0.3)"; }}
              onMouseLeave={(e) => { e.target.style.color = "rgba(255,255,255,0.5)"; e.target.style.borderColor = "rgba(255,255,255,0.15)"; }}
            >Get in Touch</a>
          </div>
        </div>
        <div style={{ position: "absolute", bottom: "40px", left: "50%", transform: "translateX(-50%)", animation: "fadeIn 1s ease forwards", animationDelay: "1.5s", opacity: 0 }}>
          <div style={{ width: "1px", height: "40px", background: "linear-gradient(to bottom, transparent, rgba(196, 164, 120, 0.5))" }} />
        </div>
      </section>

      {/* ── STATS ── */}
      <section style={{ borderTop: "1px solid rgba(255,255,255,0.06)", borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "48px 0", overflow: "hidden", background: "rgba(196, 164, 120, 0.02)" }}>
        <div style={{ display: "flex", justifyContent: "center", gap: "clamp(40px, 8vw, 120px)", flexWrap: "wrap", padding: "0 40px" }}>
          {STATS.map((stat, i) => (
            <div key={i} style={{ textAlign: "center", display: "flex", flexDirection: "column", gap: "6px" }}>
              <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(36px, 5vw, 56px)", fontWeight: 300, color: "#c4a478", letterSpacing: "-0.02em", lineHeight: 1 }}>
                <AnimatedNumber value={stat.value} suffix={stat.suffix} delay={i * 200} />
              </span>
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "10px", fontWeight: 400, letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)" }}>
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ── DESTINATIONS / MAGAZINE ── */}
      <section id="destinations" style={{ padding: "clamp(60px, 10vw, 120px) 40px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ marginBottom: "60px", maxWidth: "600px" }}>
            <span style={sectionLabel()}>Featured Destinations</span>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(32px, 4vw, 48px)", fontWeight: 300, lineHeight: 1.15, marginBottom: "16px" }}>
              The places we've brought to <em style={{ fontStyle: "italic", color: "#c4a478" }}>millions of travelers</em>
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "24px" }}>
            {DESTINATIONS.map((dest, i) => (
              <DestinationCard key={dest.id} destination={dest} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTENT / PORTFOLIO ── */}
      <section id="content" style={{ padding: "clamp(60px, 10vw, 120px) 40px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ marginBottom: "60px" }}>
            <span style={sectionLabel()}>Latest Content</span>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(32px, 4vw, 48px)", fontWeight: 300, lineHeight: 1.15, maxWidth: "500px" }}>
              Content that moves<br />
              <em style={{ fontStyle: "italic", color: "rgba(255,255,255,0.5)" }}>places and metrics</em>
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "20px" }}>
            {VIDEOS.map((video, i) => (<VideoCard key={video.id} video={video} index={i} />))}
          </div>
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section id="about" style={{ padding: "clamp(60px, 10vw, 120px) 40px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(40px, 6vw, 100px)", alignItems: "center" }}>
          <div>
            <span style={sectionLabel()}>About</span>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(28px, 3.5vw, 42px)", fontWeight: 300, lineHeight: 1.2, marginBottom: "28px" }}>
              Bringing destinations <em style={{ fontStyle: "italic", color: "#c4a478" }}>to life</em>
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px", fontFamily: "'DM Sans', sans-serif", fontSize: "14px", fontWeight: 300, lineHeight: 1.8, color: "rgba(255,255,255,0.45)" }}>
              <p>There's a generation discovering destinations on their phones, not in magazines. We've proven we can reach them at scale.</p>
              <p>Our platform puts experiential destinations in front of the right audience: people who are passionate about travel, nature, and discovering new places. When we feature your destination, you're getting exposure on a platform dedicated to the most compelling locations across the country.</p>
              <p>Great destinations don't need convincing. They just need to be discovered.</p>
            </div>
          </div>
          <div style={{ position: "relative", aspectRatio: "4/5", borderRadius: "8px", overflow: "hidden" }}>
            <img src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&h=750&fit=crop" alt="Mountain landscape" style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.7) saturate(0.8)" }} />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(10,10,10,0.6) 0%, transparent 50%)" }} />
          </div>
        </div>
      </section>

      {/* ── WHO WE SERVE ── */}
      <section style={{ borderTop: "1px solid rgba(255,255,255,0.06)", borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "clamp(40px, 6vw, 80px) 40px", background: "rgba(196, 164, 120, 0.02)" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <span style={{ ...sectionLabel(), textAlign: "center", display: "block", marginBottom: "40px" }}>Experiential Destinations We Serve</span>
          <div style={{ display: "flex", justifyContent: "center", gap: "clamp(24px, 4vw, 48px)", flexWrap: "wrap" }}>
            {["Mountain Estates & Luxury Cabins", "Wedding & Event Venues", "Boutique Resorts & Lodges", "National Parks", "Tourism Boards & DMOs", "Gateway Towns & Cities"].map((item, i) => (
              <span key={i} style={{
                fontFamily: "'Cormorant Garamond', serif", fontSize: "16px", fontWeight: 400,
                fontStyle: "italic", color: "rgba(255,255,255,0.35)",
                padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.06)",
              }}>{item}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section id="contact" style={{ padding: "clamp(80px, 12vw, 160px) 40px", textAlign: "center" }}>
        <span style={{ ...sectionLabel(), textAlign: "center" }}>Let's Work Together</span>
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(36px, 5vw, 64px)", fontWeight: 300, lineHeight: 1.1, marginBottom: "20px" }}>
          Your destination deserves<br /><em style={{ fontStyle: "italic", color: "#c4a478" }}>to be seen</em>
        </h2>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "14px", fontWeight: 300, lineHeight: 1.8, color: "rgba(255,255,255,0.4)", maxWidth: "420px", margin: "0 auto 40px" }}>
          We're currently accepting new partners. Reach out to discuss how Ridgecraft can bring your destination to millions of travelers.
        </p>
        <a href="mailto:hello@ridgecraft.studio" style={{
          fontFamily: "'DM Sans', sans-serif", fontSize: "11px", fontWeight: 500,
          letterSpacing: "0.2em", textTransform: "uppercase", color: "#0a0a0a",
          background: "#c4a478", padding: "16px 48px", textDecoration: "none",
          display: "inline-block", transition: "all 0.3s ease",
        }}
          onMouseEnter={(e) => { e.target.style.background = "#d4b88a"; e.target.style.transform = "translateY(-2px)"; }}
          onMouseLeave={(e) => { e.target.style.background = "#c4a478"; e.target.style.transform = "translateY(0)"; }}
        >Get in Touch</a>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop: "1px solid rgba(255,255,255,0.06)", padding: "32px 40px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
        <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", color: "rgba(255,255,255,0.2)", letterSpacing: "0.1em" }}>© 2026 Ridgecraft Studio</span>
        <div style={{ display: "flex", gap: "24px" }}>
          {["TikTok", "Instagram"].map((platform) => (
            <a key={platform} href="#" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", color: "rgba(255,255,255,0.25)", textDecoration: "none", letterSpacing: "0.1em", transition: "color 0.3s ease" }}
              onMouseEnter={(e) => (e.target.style.color = "#c4a478")}
              onMouseLeave={(e) => (e.target.style.color = "rgba(255,255,255,0.25)")}
            >{platform}</a>
          ))}
        </div>
      </footer>
    </div>
  );
}
