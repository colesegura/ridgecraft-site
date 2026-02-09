import { useState, useEffect, useRef } from "react";

const VIDEOS = [
  {
    id: 1,
    title: "Grand Tetons — Autumn Light",
    thumbnail: "https://images.unsplash.com/photo-1569091791842-7cfb64e04797?w=400&h=600&fit=crop",
    views: "1.2M",
    likes: "89.4K",
    shares: "12.3K",
    tiktokUrl: "#",
  },
  {
    id: 2,
    title: "Yosemite — Morning Mist",
    thumbnail: "https://images.unsplash.com/photo-1472396961693-142e6e269027?w=400&h=600&fit=crop",
    views: "856K",
    likes: "67.2K",
    shares: "9.8K",
    tiktokUrl: "#",
  },
  {
    id: 3,
    title: "Glacier — Alpine Glow",
    thumbnail: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=400&h=600&fit=crop",
    views: "1.4M",
    likes: "102K",
    shares: "15.1K",
    tiktokUrl: "#",
  },
  {
    id: 4,
    title: "Yellowstone — Thermal Dawn",
    thumbnail: "https://images.unsplash.com/photo-1570432204930-5c2e1e7f3246?w=400&h=600&fit=crop",
    views: "623K",
    likes: "45.8K",
    shares: "7.2K",
    tiktokUrl: "#",
  },
  {
    id: 5,
    title: "Smoky Mountains — Blue Ridge",
    thumbnail: "https://images.unsplash.com/photo-1500534314078-0e8e0dead022?w=400&h=600&fit=crop",
    views: "487K",
    likes: "38.1K",
    shares: "5.6K",
    tiktokUrl: "#",
  },
  {
    id: 6,
    title: "Nantahala — River Valley",
    thumbnail: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=600&fit=crop",
    views: "392K",
    likes: "29.7K",
    shares: "4.1K",
    tiktokUrl: "#",
  },
];

const STATS = [
  { label: "Total Impressions", value: "5M+", suffix: "" },
  { label: "Videos Created", value: "48", suffix: "" },
  { label: "Avg. Engagement Rate", value: "8.2", suffix: "%" },
  { label: "Viral Videos (100K+)", value: "12", suffix: "" },
];

function AnimatedNumber({ value, suffix = "", delay = 0 }) {
  const [displayed, setDisplayed] = useState("0");
  const [started, setStarted] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          setStarted(true);
        }
      },
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

        if (current >= steps) {
          setDisplayed(value);
          clearInterval(interval);
        }
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
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
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
      <img
        src={video.thumbnail}
        alt={video.title}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transition: "transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), filter 0.5s ease",
          transform: hovered ? "scale(1.05)" : "scale(1)",
          filter: hovered ? "brightness(0.6)" : "brightness(0.75)",
        }}
      />

      {/* Gradient overlay */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "70%",
          background: "linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.3) 50%, transparent 100%)",
          pointerEvents: "none",
        }}
      />

      {/* Play icon on hover */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: hovered ? "translate(-50%, -50%) scale(1)" : "translate(-50%, -50%) scale(0.5)",
          opacity: hovered ? 1 : 0,
          transition: "all 0.3s ease",
          width: "56px",
          height: "56px",
          borderRadius: "50%",
          background: "rgba(255,255,255,0.15)",
          backdropFilter: "blur(10px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "1px solid rgba(255,255,255,0.3)",
        }}
      >
        <svg width="20" height="24" viewBox="0 0 20 24" fill="none">
          <path d="M2 2L18 12L2 22V2Z" fill="white" />
        </svg>
      </div>

      {/* Content */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        <span
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "18px",
            fontWeight: 500,
            color: "#fff",
            letterSpacing: "0.02em",
            lineHeight: 1.2,
          }}
        >
          {video.title}
        </span>

        {/* Stats row */}
        <div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
          {[
            { icon: "👁", val: video.views },
            { icon: "♥", val: video.likes },
            { icon: "↗", val: video.shares },
          ].map((s, i) => (
            <span
              key={i}
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "12px",
                color: "rgba(255,255,255,0.7)",
                letterSpacing: "0.05em",
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              <span style={{ fontSize: "10px" }}>{s.icon}</span> {s.val}
            </span>
          ))}
        </div>

        {/* TikTok badge */}
        <div
          style={{
            opacity: hovered ? 1 : 0,
            transform: hovered ? "translateY(0)" : "translateY(8px)",
            transition: "all 0.3s ease 0.05s",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            marginTop: "2px",
          }}
        >
          <span
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "11px",
              color: "rgba(255,255,255,0.5)",
              textTransform: "uppercase",
              letterSpacing: "0.12em",
            }}
          >
            View on TikTok →
          </span>
        </div>
      </div>
    </div>
  );
}

export default function RidgecraftStudio() {
  const [scrollY, setScrollY] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0a0a0a",
        color: "#fff",
        fontFamily: "'DM Sans', sans-serif",
        overflowX: "hidden",
      }}
    >
      {/* Google Fonts */}
      <link
        href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500;600&display=swap"
        rel="stylesheet"
      />

      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        ::selection { background: rgba(196, 164, 120, 0.4); }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes grain {
          0%, 100% { transform: translate(0, 0); }
          10% { transform: translate(-5%, -10%); }
          30% { transform: translate(3%, -15%); }
          50% { transform: translate(-10%, 5%); }
          70% { transform: translate(8%, -5%); }
          90% { transform: translate(-3%, 10%); }
        }
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>

      {/* Film grain overlay */}
      <div
        style={{
          position: "fixed",
          top: "-50%",
          left: "-50%",
          width: "200%",
          height: "200%",
          background: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E")`,
          pointerEvents: "none",
          zIndex: 1000,
          animation: "grain 0.5s steps(1) infinite",
          opacity: 0.5,
        }}
      />

      {/* Navigation */}
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          padding: "24px 40px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: scrollY > 50 ? "rgba(10,10,10,0.85)" : "transparent",
          backdropFilter: scrollY > 50 ? "blur(20px)" : "none",
          transition: "all 0.4s ease",
          borderBottom: scrollY > 50 ? "1px solid rgba(255,255,255,0.06)" : "1px solid transparent",
        }}
      >
        <div style={{ display: "flex", alignItems: "baseline", gap: "4px" }}>
          <span
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "22px",
              fontWeight: 600,
              letterSpacing: "0.08em",
              color: "#c4a478",
            }}
          >
            RIDGECRAFT
          </span>
          <span
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "10px",
              fontWeight: 300,
              letterSpacing: "0.25em",
              color: "rgba(255,255,255,0.35)",
              textTransform: "uppercase",
            }}
          >
            studio
          </span>
        </div>
        <div style={{ display: "flex", gap: "32px", alignItems: "center" }}>
          {["Work", "About", "Contact"].map((item, i) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "12px",
                fontWeight: 400,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.5)",
                textDecoration: "none",
                transition: "color 0.3s ease",
              }}
              onMouseEnter={(e) => (e.target.style.color = "#c4a478")}
              onMouseLeave={(e) => (e.target.style.color = "rgba(255,255,255,0.5)")}
            >
              {item}
            </a>
          ))}
        </div>
      </nav>

      {/* Hero Section */}
      <section
        style={{
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background image */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: "url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&h=900&fit=crop')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "brightness(0.25) saturate(0.6)",
            transform: `scale(${1 + scrollY * 0.0003})`,
            transition: "transform 0.1s linear",
          }}
        />

        {/* Warm color wash */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "radial-gradient(ellipse at 30% 70%, rgba(196, 164, 120, 0.08) 0%, transparent 60%)",
          }}
        />

        <div
          style={{
            position: "relative",
            textAlign: "center",
            maxWidth: "900px",
            padding: "0 40px",
          }}
        >
          <div
            style={{
              animation: "fadeUp 1s ease forwards",
              animationDelay: "0.2s",
              opacity: 0,
            }}
          >
            <span
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "11px",
                fontWeight: 400,
                letterSpacing: "0.35em",
                textTransform: "uppercase",
                color: "#c4a478",
                display: "block",
                marginBottom: "28px",
              }}
            >
              Cinematic Content for Experiential Destinations
            </span>
          </div>

          <h1
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(42px, 7vw, 88px)",
              fontWeight: 300,
              lineHeight: 1.05,
              letterSpacing: "-0.01em",
              animation: "fadeUp 1s ease forwards",
              animationDelay: "0.4s",
              opacity: 0,
            }}
          >
            We make places
            <br />
            <em
              style={{
                fontStyle: "italic",
                color: "#c4a478",
                fontWeight: 300,
              }}
            >
              unforgettable
            </em>
          </h1>

          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "15px",
              fontWeight: 300,
              lineHeight: 1.8,
              color: "rgba(255,255,255,0.45)",
              maxWidth: "480px",
              margin: "32px auto 0",
              animation: "fadeUp 1s ease forwards",
              animationDelay: "0.6s",
              opacity: 0,
            }}
          >
            Short-form content that turns destinations, venues, and
            landscapes into scroll-stopping moments.
          </p>

          <div
            style={{
              animation: "fadeUp 1s ease forwards",
              animationDelay: "0.8s",
              opacity: 0,
              marginTop: "48px",
            }}
          >
            <a
              href="#work"
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "11px",
                fontWeight: 500,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "#0a0a0a",
                background: "#c4a478",
                padding: "16px 40px",
                borderRadius: "0",
                textDecoration: "none",
                display: "inline-block",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.target.style.background = "#d4b88a";
                e.target.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "#c4a478";
                e.target.style.transform = "translateY(0)";
              }}
            >
              View Our Work
            </a>
          </div>
        </div>

        {/* Scroll indicator */}
        <div
          style={{
            position: "absolute",
            bottom: "40px",
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "8px",
            animation: "fadeIn 1s ease forwards",
            animationDelay: "1.5s",
            opacity: 0,
          }}
        >
          <div
            style={{
              width: "1px",
              height: "40px",
              background: "linear-gradient(to bottom, transparent, rgba(196, 164, 120, 0.5))",
            }}
          />
        </div>
      </section>

      {/* Stats Marquee */}
      <section
        style={{
          borderTop: "1px solid rgba(255,255,255,0.06)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          padding: "48px 0",
          overflow: "hidden",
          background: "rgba(196, 164, 120, 0.02)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "clamp(40px, 8vw, 120px)",
            flexWrap: "wrap",
            padding: "0 40px",
          }}
        >
          {STATS.map((stat, i) => (
            <div
              key={i}
              style={{
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                gap: "6px",
              }}
            >
              <span
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "clamp(36px, 5vw, 56px)",
                  fontWeight: 300,
                  color: "#c4a478",
                  letterSpacing: "-0.02em",
                  lineHeight: 1,
                }}
              >
                <AnimatedNumber value={stat.value} suffix={stat.suffix} delay={i * 200} />
              </span>
              <span
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "10px",
                  fontWeight: 400,
                  letterSpacing: "0.25em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.3)",
                }}
              >
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Work / Portfolio Section */}
      <section id="work" style={{ padding: "clamp(60px, 10vw, 120px) 40px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ marginBottom: "60px" }}>
            <span
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "10px",
                fontWeight: 400,
                letterSpacing: "0.35em",
                textTransform: "uppercase",
                color: "#c4a478",
                display: "block",
                marginBottom: "16px",
              }}
            >
              Selected Work
            </span>
            <h2
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "clamp(32px, 4vw, 48px)",
                fontWeight: 300,
                lineHeight: 1.15,
                maxWidth: "500px",
              }}
            >
              Content that moves
              <br />
              <em style={{ fontStyle: "italic", color: "rgba(255,255,255,0.5)" }}>people and metrics</em>
            </h2>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "20px",
            }}
          >
            {VIDEOS.map((video, i) => (
              <VideoCard key={video.id} video={video} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section
        id="about"
        style={{
          padding: "clamp(60px, 10vw, 120px) 40px",
          borderTop: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "clamp(40px, 6vw, 100px)",
            alignItems: "center",
          }}
        >
          <div>
            <span
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "10px",
                fontWeight: 400,
                letterSpacing: "0.35em",
                textTransform: "uppercase",
                color: "#c4a478",
                display: "block",
                marginBottom: "16px",
              }}
            >
              About
            </span>
            <h2
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "clamp(28px, 3.5vw, 42px)",
                fontWeight: 300,
                lineHeight: 1.2,
                marginBottom: "28px",
              }}
            >
              Born in the
              <br />
              <em style={{ fontStyle: "italic", color: "#c4a478" }}>Southern Appalachians</em>
            </h2>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "16px",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "14px",
                fontWeight: 300,
                lineHeight: 1.8,
                color: "rgba(255,255,255,0.45)",
              }}
            >
              <p>
                Ridgecraft Studio creates cinematic short-form content for experiential
                destinations — from mountain estates and wedding venues to national parks
                and tourism boards.
              </p>
              <p>
                We pair striking visuals with trending audio to create content
                that doesn't just get views — it makes people feel something. Our signature
                style blends vintage warmth with modern pacing, turning scenic footage into
                scroll-stopping moments.
              </p>
              <p>
                Based in the heart of the Southern Appalachians, we understand landscapes
                that sell a feeling. Because the best destinations don't need to be explained.
                They need to be experienced.
              </p>
            </div>
          </div>
          <div
            style={{
              position: "relative",
              aspectRatio: "4/5",
              borderRadius: "8px",
              overflow: "hidden",
            }}
          >
            <img
              src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&h=750&fit=crop"
              alt="Mountain landscape"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                filter: "brightness(0.7) saturate(0.8)",
              }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(to top, rgba(10,10,10,0.6) 0%, transparent 50%)",
              }}
            />
          </div>
        </div>
      </section>

      {/* Services strip */}
      <section
        style={{
          borderTop: "1px solid rgba(255,255,255,0.06)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          padding: "clamp(40px, 6vw, 80px) 40px",
          background: "rgba(196, 164, 120, 0.02)",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "40px",
          }}
        >
          {[
            {
              title: "Short-Form Content",
              desc: "Cinematic TikTok and Reels that pair your destination's beauty with trending audio for maximum reach.",
            },
            {
              title: "Destination Videography",
              desc: "On-location shoots including aerial drone footage that captures your property from every angle.",
            },
            {
              title: "Content Strategy",
              desc: "Ongoing content creation and posting strategy tailored to experiential destinations and hospitality brands.",
            },
          ].map((service, i) => (
            <div key={i}>
              <h3
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "22px",
                  fontWeight: 400,
                  marginBottom: "12px",
                  color: "#c4a478",
                }}
              >
                {service.title}
              </h3>
              <p
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "13px",
                  fontWeight: 300,
                  lineHeight: 1.7,
                  color: "rgba(255,255,255,0.4)",
                }}
              >
                {service.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Contact CTA */}
      <section
        id="contact"
        style={{
          padding: "clamp(80px, 12vw, 160px) 40px",
          textAlign: "center",
        }}
      >
        <span
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "10px",
            fontWeight: 400,
            letterSpacing: "0.35em",
            textTransform: "uppercase",
            color: "#c4a478",
            display: "block",
            marginBottom: "24px",
          }}
        >
          Let's Work Together
        </span>
        <h2
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "clamp(36px, 5vw, 64px)",
            fontWeight: 300,
            lineHeight: 1.1,
            marginBottom: "20px",
          }}
        >
          Your destination deserves
          <br />
          <em style={{ fontStyle: "italic", color: "#c4a478" }}>to be seen</em>
        </h2>
        <p
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "14px",
            fontWeight: 300,
            lineHeight: 1.8,
            color: "rgba(255,255,255,0.4)",
            maxWidth: "420px",
            margin: "0 auto 40px",
          }}
        >
          We're currently accepting new destination partners.
          Reach out to discuss how we can bring your property to life on social media.
        </p>
        <a
          href="mailto:hello@ridgecraft.studio"
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "11px",
            fontWeight: 500,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "#0a0a0a",
            background: "#c4a478",
            padding: "16px 48px",
            textDecoration: "none",
            display: "inline-block",
            transition: "all 0.3s ease",
          }}
          onMouseEnter={(e) => {
            e.target.style.background = "#d4b88a";
            e.target.style.transform = "translateY(-2px)";
          }}
          onMouseLeave={(e) => {
            e.target.style.background = "#c4a478";
            e.target.style.transform = "translateY(0)";
          }}
        >
          Get in Touch
        </a>
      </section>

      {/* Footer */}
      <footer
        style={{
          borderTop: "1px solid rgba(255,255,255,0.06)",
          padding: "32px 40px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "16px",
        }}
      >
        <span
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "11px",
            color: "rgba(255,255,255,0.2)",
            letterSpacing: "0.1em",
          }}
        >
          © 2026 Ridgecraft Studio
        </span>
        <div style={{ display: "flex", gap: "24px" }}>
          {["TikTok", "Instagram"].map((platform) => (
            <a
              key={platform}
              href="#"
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "11px",
                color: "rgba(255,255,255,0.25)",
                textDecoration: "none",
                letterSpacing: "0.1em",
                transition: "color 0.3s ease",
              }}
              onMouseEnter={(e) => (e.target.style.color = "#c4a478")}
              onMouseLeave={(e) => (e.target.style.color = "rgba(255,255,255,0.25)")}
            >
              {platform}
            </a>
          ))}
        </div>
      </footer>
    </div>
  );
}
