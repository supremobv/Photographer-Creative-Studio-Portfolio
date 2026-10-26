"use client";
import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import {
  ArrowUpRight,
  ArrowDown,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  X,
  Menu,
  Plus,
  Play,
  Check,
  Search,
  MoveUpRight,
} from "lucide-react";
import {
  projects,
  categories,
  reels,
  packages,
  addons,
  budgetOptions,
  estimate,
  money,
  todayISO,
  maxDate,
  validDate,
  testimonials,
  type Project,
} from "./portfolio-data";
type Reel = (typeof reels)[number];
function Modal({
  title,
  children,
  onClose,
  wide = false,
}: {
  title: string;
  children: ReactNode;
  onClose: () => void;
  wide?: boolean;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    ref.current?.showModal();
    const old = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = old;
    };
  }, []);
  return (
    <dialog
      ref={ref}
      className={`modal ${wide ? "wide" : ""}`}
      aria-label={title}
      onCancel={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <button className="close" aria-label="Close dialog" onClick={onClose}>
        <X size={20} />
      </button>
      {children}
    </dialog>
  );
}
function FilmPlayer({ reel }: { reel: Reel }) {
  const [failed, setFailed] = useState(false);
  return (
    <div className="film-player">
      <video
        controls
        autoPlay
        muted
        playsInline
        preload="metadata"
        poster={`/images/${reel.poster}.jpg`}
        aria-label={`Play ${reel.title} motion study`}
        onError={() => setFailed(true)}
      >
        <source src={reel.src} type="video/mp4" />
        <track
          kind="captions"
          src={`/videos/${reel.id}.vtt`}
          srcLang="en"
          label="Visual description"
        />
        Your browser does not support this video.
      </video>
      {failed && (
        <p role="alert">
          The video could not load.{" "}
          <a href={reel.source} target="_blank" rel="noreferrer">
            View the source clip ↗
          </a>
        </p>
      )}
      <p>
        STOCK MOTION REFERENCE / {reel.credit} · Use the player controls to
        pause, replay, or view full screen.
      </p>
    </div>
  );
}
export default function CreativeStudio() {
  const [menu, setMenu] = useState(false),
    [category, setCategory] = useState("All work"),
    [query, setQuery] = useState(""),
    [all, setAll] = useState(false),
    [project, setProject] = useState<Project | null>(null),
    [frame, setFrame] = useState(0),
    [reel, setReel] = useState<Reel | null>(null),
    [review, setReview] = useState(0),
    [booking, setBooking] = useState(false),
    [packageId, setPackageId] = useState("custom"),
    [selectedAddons, setSelectedAddons] = useState<string[]>([]),
    [projectId, setProjectId] = useState("none"),
    [dateMode, setDateMode] = useState("Flexible"),
    [date, setDate] = useState(""),
    [error, setError] = useState(""),
    [sending, setSending] = useState(false),
    [reference, setReference] = useState("");
  const filtered = projects.filter(
      (p) =>
        (category === "All work" || p.category === category) &&
        `${p.title} ${p.subtitle} ${p.category}`
          .toLowerCase()
          .includes(query.toLowerCase()),
    ),
    visible = all ? filtered : filtered.slice(0, 6),
    selectedPackage = packages.find((p) => p.id === packageId),
    total = estimate(packageId, selectedAddons);
  function openProject(p: Project) {
    setProject(p);
    setFrame(0);
  }
  function startBooking(id = "custom", inspiration = "none") {
    setProject(null);
    setReel(null);
    setPackageId(id);
    setProjectId(inspiration);
    setSelectedAddons([]);
    setDateMode("Flexible");
    setDate("");
    setReference("");
    setError("");
    setBooking(true);
  }
  function changePackage(id: string) {
    setPackageId(id);
    setSelectedAddons((s) =>
      s.filter((a) => packages.find((p) => p.id === id)?.addons.includes(a)),
    );
  }
  function toggleAddon(id: string) {
    setSelectedAddons((s) =>
      s.includes(id) ? s.filter((a) => a !== id) : [...s, id],
    );
  }
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (dateMode === "Preferred date" && !validDate(date)) {
      setError(
        "Choose a real date from today to 365 days ahead, or choose flexible dates.",
      );
      return;
    }
    setError("");
    setSending(true);
    try {
      const fields = Object.fromEntries(new FormData(e.currentTarget));
      const r = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...fields,
          packageId,
          addons: selectedAddons,
          projectId,
          dateMode,
          date: dateMode === "Preferred date" ? date : "",
        }),
      });
      const data = (await r.json()) as { error?: string; reference: string };
      if (!r.ok)
        throw new Error(
          data.error || "Your inquiry could not be saved. Please try again.",
        );
      setReference(data.reference);
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Unable to send your inquiry. Please try again.",
      );
    } finally {
      setSending(false);
    }
  }
  function resetFilters() {
    setCategory("All work");
    setQuery("");
    setAll(false);
  }
  return (
    <>
      <header className="header">
        <a className="wordmark" href="#" aria-label="COMMON LIGHT home">
          <span className="brand-mark">
            <i />
            <i />
          </span>
          <span>
            COMMON
            <br />
            LIGHT<span className="brand-small">PHOTOGRAPHY & MOTION</span>
          </span>
        </a>
        <nav aria-label="Main navigation" className={menu ? "open" : ""}>
          <a href="#work" onClick={() => setMenu(false)}>
            Selected work <sup>08</sup>
          </a>
          <a href="#films" onClick={() => setMenu(false)}>
            Motion studies
          </a>
          <a href="#studio" onClick={() => setMenu(false)}>
            The studio
          </a>
          <a href="#services" onClick={() => setMenu(false)}>
            The approach
          </a>
        </nav>
        <div className="header-actions">
          <button className="header-cta" onClick={() => startBooking()}>
            LET’S MAKE SOMETHING <ArrowUpRight size={16} />
          </button>
          <button
            className="menu-toggle"
            aria-label="Toggle navigation"
            aria-expanded={menu}
            onClick={() => setMenu(!menu)}
          >
            {menu ? <X /> : <Menu />}
          </button>
        </div>
      </header>
      <main>
        <section className="hero">
          <img
            className="hero-bg"
            src="/images/hero.jpg"
            alt="White surf breaking over a dark rocky coastline, photographed from above"
            fetchPriority="high"
          />
          <div className="hero-top">
            <p>INDEPENDENT CREATIVE STUDIO CONCEPT</p>
            <span>STILLS / FILMS / STORIES</span>
          </div>
          <div className="hero-title">
            <span className="red-label">LOOK A LITTLE CLOSER.</span>
            <h1>
              STORIES IN
              <br />
              EVERY <span>FRAME.</span>
            </h1>
          </div>
          <button
            className="hero-play"
            aria-label="Play Tidelines motion study"
            onClick={() => setReel(reels[0])}
          >
            <Play size={23} fill="currentColor" />
            <span>
              PLAY A<br />
              MOTION STUDY
            </span>
          </button>
          <div className="hero-bottom">
            <p>
              For the people. The places.
              <br />
              The things worth paying attention to.
            </p>
            <a href="#work">
              EXPLORE THE WORK <ArrowDown size={19} />
            </a>
            <span>01 / A DIFFERENT PERSPECTIVE</span>
          </div>
        </section>
        <section className="intro section">
          <p className="eyebrow">A COMMON THREAD. A DIFFERENT LIGHT.</p>
          <div>
            <h2>
              We notice the details.
              <br />
              The in-between.
              <br />
              <span>The story waiting to happen.</span>
            </h2>
            <p>
              Photography, motion, and creative direction.
              <br />A considered point of view for people, brands,
              <br />
              and the places they call their own.
            </p>
          </div>
          <div className="intro-foot">
            <span>A PORTFOLIO CONCEPT BUILT AROUND CURIOSITY.</span>
            <a href="#studio" className="text-link">
              MEET THE APPROACH <ArrowUpRight size={15} />
            </a>
          </div>
        </section>
        <section className="work-section section" id="work">
          <div className="section-heading">
            <div>
              <p className="eyebrow">01 / SELECTED VISUAL STORIES</p>
              <h2>
                THE WORK<span className="red-dot">.</span>
              </h2>
            </div>
            <p>
              Different subjects. A deliberate point of view.
              <br />
              Explore the stories behind the frames.
            </p>
          </div>
          <div className="work-toolbar">
            <div
              className="tabs"
              role="group"
              aria-label="Portfolio categories"
            >
              {categories.map((c) => (
                <button
                  key={c}
                  className={category === c ? "active" : ""}
                  aria-pressed={category === c}
                  onClick={() => {
                    setCategory(c);
                    setAll(false);
                  }}
                >
                  {c}
                  {c === "All work" && <sup>08</sup>}
                </button>
              ))}
            </div>
            <label className="search">
              <Search size={15} />
              <input
                type="search"
                aria-label="Search portfolio"
                placeholder="Find a story"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </label>
          </div>
          <div className="results">
            <span aria-live="polite">
              {String(filtered.length).padStart(2, "0")} PROJECT STUDIES
            </span>
            <span>ILLUSTRATIVE STOCK REFERENCES</span>
            {(category !== "All work" || query) && (
              <button onClick={resetFilters}>
                RESET FILTERS <X size={11} />
              </button>
            )}
          </div>
          <div
            className={`project-grid ${visible.length === 1 ? "single" : ""}`}
          >
            {visible.map((p, i) => (
              <article key={p.id} className={`project-card project-${i}`}>
                <button
                  className="project-image"
                  onClick={() => openProject(p)}
                  aria-label={`Explore ${p.title}`}
                >
                  <img
                    src={`/images/${p.images[0]}.jpg`}
                    alt={p.alt}
                    loading="lazy"
                  />
                  <span className="project-tag">
                    {p.category.toUpperCase()} / CONCEPT STUDY
                  </span>
                  <span className="project-open">
                    <ArrowUpRight size={22} />
                  </span>
                  {p.reelId && (
                    <span className="project-film">
                      <Play size={12} fill="currentColor" />
                      MOTION INSIDE
                    </span>
                  )}
                </button>
                <div className="project-meta">
                  <button onClick={() => openProject(p)}>
                    <h3>{p.title}</h3>
                    <ArrowUpRight size={17} />
                  </button>
                  <p>
                    {p.subtitle}
                    <span>
                      {String(
                        projects.findIndex((v) => v.id === p.id) + 1,
                      ).padStart(2, "0")}{" "}
                      / 2026
                    </span>
                  </p>
                </div>
              </article>
            ))}
          </div>
          {!visible.length && (
            <div className="empty">
              <h3>NOTHING IN THIS FRAME.</h3>
              <p>Try another category or clear the search.</p>
              <button className="button" onClick={resetFilters}>
                EXPLORE ALL WORK <ArrowRight size={16} />
              </button>
            </div>
          )}
          {!all && filtered.length > 6 && (
            <div className="center">
              <button className="button outline" onClick={() => setAll(true)}>
                VIEW ALL {filtered.length} PROJECTS <Plus size={16} />
              </button>
            </div>
          )}
          <p className="portfolio-note">
            Concept titles and creative briefs accompany independent stock
            imagery. These are visual direction studies, not claimed client
            commissions or studio-authored photographs.
          </p>
        </section>
        <section className="films-section section" id="films">
          <div className="section-heading">
            <div>
              <p className="eyebrow">02 / STILL CURIOUS. ALWAYS MOVING.</p>
              <h2>
                STORIES
                <br />
                WITH <em>MOVEMENT.</em>
              </h2>
            </div>
            <p>
              A change of pace. A different rhythm.
              <br />
              Two stock motion studies, ready to play.
            </p>
          </div>
          <div className="film-grid">
            {reels.map((r, i) => (
              <article key={r.id}>
                <button
                  className="film-poster"
                  aria-label={`Watch ${r.title}`}
                  onClick={() => setReel(r)}
                >
                  <img
                    src={`/images/${r.poster}.jpg`}
                    alt={`${r.title} video poster`}
                    loading="lazy"
                  />
                  <span className="film-corner">MOTION STUDY / 0{i + 1}</span>
                  <span className="film-play">
                    <Play size={24} fill="currentColor" />
                  </span>
                  <span className="film-time">{r.length}</span>
                </button>
                <div className="film-meta">
                  <h3>{r.title}</h3>
                  <p>{r.subtitle}</p>
                  <span>FOOTAGE: {r.credit}</span>
                </div>
              </article>
            ))}
          </div>
          <p className="film-note">
            Independent source footage shown with credit. No autoplaying
            background video. Press play to watch a study with native playback
            controls.
          </p>
        </section>
        <section className="studio-section section" id="studio">
          <div className="studio-photo">
            <img
              src="/images/mountain.jpg"
              alt="Mountain ridges receding into mist in monochrome"
              loading="lazy"
            />
            <div>
              <span>NOTICING IS WHERE IT STARTS.</span>
              <ArrowUpRight size={17} />
            </div>
          </div>
          <div className="studio-copy">
            <p className="eyebrow">03 / THE COMMON LIGHT APPROACH</p>
            <h2>
              GOOD STORIES
              <br />
              START WITH
              <br />
              <em>PAYING ATTENTION.</em>
            </h2>
            <p>
              To the light in a room. The way a person moves.
              <br />
              The feeling a brand wants to leave behind.
            </p>
            <p>
              COMMON LIGHT is a creative studio concept built around a simple
              process: listen closely, find a clear direction, and make room for
              the unexpected.
            </p>
            <a className="text-link" href="#services">
              HOW WE COULD WORK TOGETHER <ArrowUpRight size={17} />
            </a>
          </div>
        </section>
        <section className="services-section section" id="services">
          <div className="section-heading">
            <div>
              <p className="eyebrow">
                04 / A STARTING POINT FOR SOMETHING GOOD
              </p>
              <h2>
                LET’S MAKE
                <br />
                IT <em>HAPPEN.</em>
              </h2>
            </div>
            <p>
              A portrait, a product, a place, a film.
              <br />
              Start with a shape. Build around the story.
            </p>
          </div>
          <div className="package-grid">
            {packages.map((p, i) => (
              <article key={p.id}>
                <div className="package-top">
                  <span>
                    0{i + 1} / {p.type.toUpperCase()}
                  </span>
                  <ArrowUpRight size={20} />
                </div>
                <h3>{p.name}</h3>
                <p>{p.intro}</p>
                <div className="package-price">
                  <span>FROM {money(p.price)}</span>
                  <small>{p.duration}</small>
                </div>
                <ul>
                  {p.includes.map((item) => (
                    <li key={item}>
                      <Check size={12} />
                      {item}
                    </li>
                  ))}
                </ul>
                <button
                  className="text-link"
                  onClick={() => startBooking(p.id)}
                >
                  START WITH THIS <ArrowUpRight size={16} />
                </button>
              </article>
            ))}
          </div>
          <p className="package-note">
            Sample PHP packages and deliverables, subject to a written brief and
            quote. Travel, locations, styling, talent, permits, music licensing,
            tax, and additional production costs are scoped separately. No stock
            image rights are sold through these packages.
          </p>
          <div className="custom-brief">
            <span>YOUR IDEA DOESN’T FIT A BOX?</span>
            <button onClick={() => startBooking()}>
              GOOD. LET’S TALK. <ArrowUpRight size={20} />
            </button>
          </div>
        </section>
        <section className="process-section section">
          <p className="eyebrow">A CLEAR PROCESS. SPACE FOR THE UNEXPECTED.</p>
          <div className="process-grid">
            {[
              {
                n: "01",
                title: "LISTEN.",
                text: "The story, the people, the purpose. A conversation before a camera.",
              },
              {
                n: "02",
                title: "SHAPE.",
                text: "A visual direction, a shot plan, and a scope everyone can see.",
              },
              {
                n: "03",
                title: "CREATE.",
                text: "A considered shoot, with space to notice what happens along the way.",
              },
              {
                n: "04",
                title: "REFINE.",
                text: "A thoughtful edit and delivery agreed around where the work will live.",
              },
            ].map((s) => (
              <div key={s.n}>
                <span>{s.n}</span>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </div>
            ))}
          </div>
        </section>
        <section className="testimonials-section section">
          <div className="testimonial-label">
            <p className="eyebrow">05 / THE OTHER SIDE OF THE LENS</p>
            <p>
              TESTIMONIAL LAYOUT PREVIEW
              <br />
              DEMO COPY, NOT REAL CLIENT FEEDBACK
            </p>
          </div>
          <div className="testimonial-body" aria-live="polite">
            <span className="quote">“</span>
            <blockquote>{testimonials[review].quote}</blockquote>
            <div className="testimonial-person">
              <span>
                {testimonials[review].name}
                <small>
                  {testimonials[review].type} · Illustrative testimonial
                </small>
              </span>
              <div>
                <button
                  aria-label="Previous testimonial"
                  onClick={() =>
                    setReview(
                      (r) =>
                        (r + testimonials.length - 1) % testimonials.length,
                    )
                  }
                >
                  <ChevronLeft size={18} />
                </button>
                <span>0{review + 1} / 03</span>
                <button
                  aria-label="Next testimonial"
                  onClick={() =>
                    setReview((r) => (r + 1) % testimonials.length)
                  }
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </div>
        </section>
        <section className="faq-section section">
          <div>
            <p className="eyebrow">BEFORE THE FIRST FRAME</p>
            <h2>
              A FEW
              <br />
              GOOD <em>QUESTIONS.</em>
            </h2>
          </div>
          <div className="faq-list">
            {[
              {
                q: "How does a booking inquiry work?",
                a: "Choose a package or start with a custom brief. Share a location, a preferred date or flexible timing, and what you want to create. The inquiry is saved for review; availability, scope, and final pricing need agreement before a booking.",
              },
              {
                q: "Can I combine photography and video?",
                a: "Yes, as a starting brief. Choose a brand or motion package and any relevant sample add-ons, or use a custom brief. Crew, coverage, deliverables, and usage should be quoted together before production.",
              },
              {
                q: "What do the sample prices include?",
                a: "The package cards list sample capture time and deliverable counts. Travel, venue, styling, talent, permits, music licensing, tax, and additional production expenses are discussed separately. Custom requests do not receive an automatic final quote.",
              },
              {
                q: "Is this the studio’s original commissioned work?",
                a: "This is a demonstration portfolio. Project titles and briefs are concepts; all imagery and footage are credited independent stock references. The studio does not claim to have shot them or worked with the pictured people and brands.",
              },
            ].map((f) => (
              <details key={f.q}>
                <summary>
                  {f.q}
                  <Plus size={16} />
                </summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </section>
        <section className="contact-section section" id="contact">
          <div className="contact-top">
            <p className="eyebrow">SOMETHING WORTH MAKING?</p>
            <span>START A CONVERSATION.</span>
          </div>
          <button onClick={() => startBooking()}>
            <span>
              LET’S MAKE
              <br />
              <em>A GOOD STORY.</em>
            </span>
            <ArrowUpRight />
          </button>
          <div className="contact-bottom">
            <p>
              Give us the spark.
              <br />
              We’ll start with a conversation.
            </p>
            <span>
              NO PAYMENT. NO CONFIRMED BOOKING.
              <br />
              JUST A GOOD PLACE TO BEGIN.
            </span>
          </div>
        </section>
      </main>
      <footer>
        <div className="footer-top">
          <a className="wordmark" href="#">
            <span className="brand-mark">
              <i />
              <i />
            </span>
            <span>
              COMMON
              <br />
              LIGHT
            </span>
          </a>
          <p>
            Photography. Motion.
            <br />A considered point of view.
          </p>
          <div>
            <a href="#work">SELECTED WORK</a>
            <a href="#films">MOTION STUDIES</a>
            <a href="#studio">THE STUDIO</a>
          </div>
          <div>
            <button onClick={() => startBooking()}>
              START A BRIEF <ArrowUpRight size={13} />
            </button>
            <a href="/credits">IMAGE & FILM CREDITS</a>
            <a href="/studio">BOOKING INBOX</a>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 COMMON LIGHT / CREATIVE STUDIO CONCEPT</span>
          <span>ILLUSTRATIVE PROJECTS, TESTIMONIALS & PRICING</span>
          <a href="#">BACK TO THE TOP ↑</a>
        </div>
      </footer>
      {project && (
        <Modal title={project.title} onClose={() => setProject(null)} wide>
          <div className="project-dialog">
            <div className="story-hero">
              <img
                src={`/images/${project.images[frame]}.jpg`}
                alt={`${project.alt} — reference ${frame + 1}`}
              />
              <span>
                {project.category.toUpperCase()} / VISUAL DIRECTION STUDY
              </span>
            </div>
            <div className="frame-controls">
              <button
                aria-label="Previous project photo"
                disabled={project.images.length < 2}
                onClick={() =>
                  setFrame(
                    (f) =>
                      (f + project.images.length - 1) % project.images.length,
                  )
                }
              >
                <ChevronLeft size={18} />
              </button>
              <span>
                FRAME {String(frame + 1).padStart(2, "0")} /{" "}
                {String(project.images.length).padStart(2, "0")}
              </span>
              <button
                aria-label="Next project photo"
                disabled={project.images.length < 2}
                onClick={() => setFrame((f) => (f + 1) % project.images.length)}
              >
                <ChevronRight size={18} />
              </button>
            </div>
            <div className="story-content">
              <p className="eyebrow">
                CONCEPT PROJECT / {project.category.toUpperCase()}
              </p>
              <h2>{project.title}</h2>
              <p className="story-subtitle">{project.subtitle}</p>
              <div className="story-columns">
                <div>
                  <h3>THE IDEA</h3>
                  <p>{project.idea}</p>
                </div>
                <div>
                  <h3>THE APPROACH</h3>
                  <p>{project.approach}</p>
                </div>
                <div>
                  <h3>THE POSSIBILITY</h3>
                  <p>{project.output}</p>
                </div>
              </div>
              {project.reelId && (
                <button
                  className="button outline"
                  onClick={() => {
                    const r = reels.find((r) => r.id === project.reelId)!;
                    setProject(null);
                    setReel(r);
                  }}
                >
                  WATCH THE MOTION STUDY <Play size={14} />
                </button>
              )}
              <div className="story-footer">
                <p>
                  Independent stock references. Concept brief, not a client
                  commission.
                  <br />
                  Original image and footage credits are available in the source
                  notes.
                </p>
                <button
                  className="button"
                  onClick={() => startBooking(project.packageId, project.id)}
                >
                  START A SIMILAR STORY <ArrowUpRight size={16} />
                </button>
              </div>
              <button
                className="next-story"
                onClick={() =>
                  openProject(
                    projects[
                      (projects.findIndex((p) => p.id === project.id) + 1) %
                        projects.length
                    ],
                  )
                }
              >
                NEXT STORY <ArrowRight size={17} />
              </button>
            </div>
          </div>
        </Modal>
      )}
      {reel && (
        <Modal title={reel.title} onClose={() => setReel(null)} wide>
          <div className="reel-dialog">
            <FilmPlayer key={reel.id} reel={reel} />
            <div className="reel-copy">
              <div>
                <p className="eyebrow">STOCK MOTION STUDY / {reel.length}</p>
                <h2>{reel.title}</h2>
              </div>
              <div>
                <p>{reel.description}</p>
                <a
                  className="text-link"
                  href={reel.source}
                  target="_blank"
                  rel="noreferrer"
                >
                  ORIGINAL FOOTAGE & CREDIT <ArrowUpRight size={14} />
                </a>
              </div>
            </div>
            <div className="reel-actions">
              <button className="button" onClick={() => startBooking("motion")}>
                LET’S MAKE SOMETHING MOVE <ArrowUpRight size={16} />
              </button>
              <button
                className="text-link"
                onClick={() => setReel(reels.find((r) => r.id !== reel.id)!)}
              >
                WATCH THE OTHER STUDY <ArrowRight size={15} />
              </button>
            </div>
          </div>
        </Modal>
      )}
      {booking && (
        <Modal title="Booking inquiry" onClose={() => setBooking(false)} wide>
          {reference ? (
            <div className="success">
              <span className="success-check">
                <Check size={30} />
              </span>
              <p className="eyebrow">A GOOD STORY STARTS SOMEWHERE.</p>
              <h2>
                BRIEF
                <br />
                <em>RECEIVED.</em>
              </h2>
              <p>Your inquiry has been saved for studio review.</p>
              <div className="reference">
                <span>YOUR REFERENCE</span>
                <strong>{reference}</strong>
              </div>
              <p className="small-note">
                This is an inquiry, not a confirmed booking. Scope,
                availability, usage, and pricing need studio agreement. No
                payment was taken. Email notifications are not configured in
                this concept site.
              </p>
              <button className="button" onClick={() => setBooking(false)}>
                BACK TO THE STORIES <ArrowRight size={16} />
              </button>
            </div>
          ) : (
            <form className="booking-form" onSubmit={submit}>
              <aside>
                <p className="eyebrow">YOUR NEXT STORY STARTS HERE.</p>
                <h2>
                  GIVE US
                  <br />
                  <em>THE SPARK.</em>
                </h2>
                <p>
                  A person. A product. A place. An idea that’s not quite formed
                  yet. Tell us where you want to begin.
                </p>
                <div className="brief-summary" aria-live="polite">
                  <span>YOUR STARTING POINT</span>
                  <h3>{selectedPackage?.name || "A CUSTOM BRIEF"}</h3>
                  <strong>
                    {total === null ? "LET’S TALK" : money(total)}
                  </strong>
                  <p>
                    {total === null
                      ? "A proposal follows the conversation."
                      : "SAMPLE STARTING ESTIMATE"}
                  </p>
                  {selectedAddons.length > 0 && (
                    <ul>
                      {selectedAddons.map((id) => (
                        <li key={id}>
                          {addons.find((a) => a.id === id)?.name}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                {projectId !== "none" && (
                  <p className="inspiration-note">
                    INSPIRATION:{" "}
                    {projects.find((p) => p.id === projectId)?.title}
                  </p>
                )}
                <p className="small-note">
                  All prices and deliverables are samples. Travel, production
                  expenses, usage, tax, and custom scope require a written
                  quote. An inquiry does not reserve a date.
                </p>
              </aside>
              <div className="form-fields">
                <div className="two-fields">
                  <label className="field" htmlFor="brief-name">
                    Your name *
                    <input
                      id="brief-name"
                      name="name"
                      required
                      minLength={2}
                      maxLength={100}
                      autoComplete="name"
                    />
                  </label>
                  <label className="field" htmlFor="brief-email">
                    Email address *
                    <input
                      id="brief-email"
                      name="email"
                      type="email"
                      required
                      maxLength={180}
                      autoComplete="email"
                    />
                  </label>
                </div>
                <div className="two-fields">
                  <label className="field" htmlFor="brief-phone">
                    Phone number
                    <input
                      id="brief-phone"
                      name="phone"
                      type="tel"
                      maxLength={35}
                      autoComplete="tel"
                    />
                  </label>
                  <label className="field" htmlFor="brief-company">
                    Brand / company
                    <input
                      id="brief-company"
                      name="company"
                      maxLength={140}
                      autoComplete="organization"
                    />
                  </label>
                </div>
                <label className="field" htmlFor="brief-package">
                  Where shall we start?
                  <select
                    id="brief-package"
                    value={packageId}
                    onChange={(e) => changePackage(e.target.value)}
                  >
                    <option value="custom">
                      A custom brief / help me choose
                    </option>
                    {packages.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} · {money(p.price)}
                      </option>
                    ))}
                  </select>
                </label>
                {selectedPackage && (
                  <fieldset className="addons">
                    <legend>
                      A LITTLE EXTRA <span>Optional sample add-ons</span>
                    </legend>
                    {addons
                      .filter((a) => selectedPackage.addons.includes(a.id))
                      .map((a) => (
                        <label key={a.id}>
                          <input
                            type="checkbox"
                            checked={selectedAddons.includes(a.id)}
                            onChange={() => toggleAddon(a.id)}
                          />
                          <span>{a.name}</span>
                          <strong>+{money(a.price)}</strong>
                        </label>
                      ))}
                  </fieldset>
                )}
                <div className="two-fields">
                  <label className="field" htmlFor="brief-date-mode">
                    Your timing
                    <select
                      id="brief-date-mode"
                      value={dateMode}
                      onChange={(e) => setDateMode(e.target.value)}
                    >
                      <option>Flexible</option>
                      <option>Preferred date</option>
                    </select>
                  </label>
                  {dateMode === "Preferred date" ? (
                    <label className="field" htmlFor="brief-date">
                      Preferred shoot date *
                      <input
                        id="brief-date"
                        type="date"
                        min={todayISO()}
                        max={maxDate()}
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        required
                      />
                    </label>
                  ) : (
                    <p className="flexible-note">
                      A little room to find the right date.
                      <br />
                      We’ll discuss timing with the brief.
                    </p>
                  )}
                </div>
                <div className="two-fields">
                  <label className="field" htmlFor="brief-location">
                    City / shoot location *
                    <input
                      id="brief-location"
                      name="location"
                      required
                      minLength={2}
                      maxLength={160}
                      placeholder="City or venue, if known"
                    />
                  </label>
                  <label className="field" htmlFor="brief-budget">
                    Budget direction
                    <select
                      id="brief-budget"
                      name="budget"
                      defaultValue="Let’s discuss"
                    >
                      {budgetOptions.map((b) => (
                        <option key={b}>{b}</option>
                      ))}
                    </select>
                  </label>
                </div>
                <label className="field" htmlFor="brief-story">
                  Tell us about your story *
                  <textarea
                    id="brief-story"
                    name="message"
                    rows={4}
                    required
                    minLength={15}
                    maxLength={2500}
                    placeholder="The idea, the purpose, where the work will be used, and anything we should know…"
                  />
                </label>
                <label className="consent">
                  <input name="consent" type="checkbox" required />I agree to
                  have my contact details and project brief saved for responding
                  to this inquiry.
                </label>
                {error && (
                  <p className="form-error" role="alert">
                    {error}
                  </p>
                )}
                <button className="button full" disabled={sending}>
                  {sending ? "SAVING YOUR BRIEF…" : "SEND THE SPARK"}
                  <ArrowUpRight size={17} />
                </button>
                <p className="small-note">
                  Required fields are marked *. No payment or confirmed booking.
                </p>
              </div>
            </form>
          )}
        </Modal>
      )}
    </>
  );
}
