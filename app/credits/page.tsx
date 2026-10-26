import { reels } from "../portfolio-data";
const photos = [
  [
    "hero",
    "9306787",
    "Pexels contributor",
    "aerial-shot-of-ocean-waves-hitting-the-rocks",
  ],
  [
    "coast",
    "18672828",
    "Pexels contributor",
    "beach-and-rocks-on-the-coast-of-sea",
  ],
  [
    "mountain",
    "35360736",
    "Pexels contributor",
    "dramatic-black-and-white-mountain-landscape",
  ],
  [
    "portrait",
    "37646397",
    "Eko Agalarov",
    "sunlit-beach-fashion-portrait-of-a-woman",
  ],
  [
    "portrait2",
    "33715326",
    "Pexels contributor",
    "elegant-woman-posing-in-sunlit-fashion-portrait",
  ],
  ["product", "6754410", "Stefanie Berlin", "perfume-bottle-on-the-table"],
  [
    "product2",
    "8872285",
    "Pexels contributor",
    "overhead-shot-of-a-bottle-of-perfume",
  ],
  [
    "architecture",
    "3188582",
    "Pexels contributor",
    "concrete-brutalist-building",
  ],
  [
    "architecture2",
    "35058936",
    "Pexels contributor",
    "brutalist-architecture-building-exterior-view",
  ],
  [
    "wedding",
    "30811972",
    "Pexels contributor",
    "romantic-outdoor-wedding-photo-with-bride-and-groom",
  ],
];
export default function Credits() {
  return (
    <main className="notes-page">
      <a className="wordmark" href="/">
        COMMON
        <br />
        LIGHT
      </a>
      <p className="eyebrow">THE PEOPLE BEHIND THE REFERENCE FRAMES.</p>
      <h1>
        IMAGE &<br />
        FILM <em>CREDITS.</em>
      </h1>
      <p>
        COMMON LIGHT is a demonstration creative studio. Project titles, briefs,
        service packages, prices, proposed deliverables, and testimonial
        quotations are sample content. All photographs and video clips are
        independent stock references, not studio-authored work or actual client
        commissions.
      </p>
      <p>
        Photographed people, couples, brands, products, and buildings are not
        claimed clients, partners, or endorsers. Images within a concept story
        can depict independent subjects and locations. The stories describe
        possible creative directions, not verified production histories or
        results. Testimonial copy is explicitly illustrative and does not
        represent real client feedback.
      </p>
      <p>
        The local media files come from Pexels. Photos are cropped for layout,
        and the hero receives a display overlay for text legibility. Video clips
        are presented with native controls as credited stock motion studies. No
        stock image or footage rights are sold as part of the sample service
        packages.
      </p>
      <h2>MOTION REFERENCES</h2>
      <div className="credits-grid">
        {reels.map((r) => (
          <a key={r.id} href={r.source} target="_blank" rel="noreferrer">
            <img
              src={`/images/${r.poster}.jpg`}
              alt={`${r.title} video poster`}
            />
            <span>
              {r.credit}
              <small>{r.title} · Independent source footage ↗</small>
            </span>
          </a>
        ))}
      </div>
      <p>
        TIDELINES uses footage by Edward Ng / #edwardng.raw from Pexels video
        12657904. AFTER HOURS uses footage by Amar Preciado from Pexels video
        10822505. The city study is a short source clip, not a complete produced
        film. Poster images come from the respective Pexels videos.
      </p>
      <h2>STILL REFERENCES</h2>
      <div className="credits-grid">
        {photos.map(([image, id, by, slug]) => (
          <a
            key={id}
            href={`https://www.pexels.com/photo/${slug}-${id}/`}
            target="_blank"
            rel="noreferrer"
          >
            <img
              src={`/images/${image}.jpg`}
              alt={`${image} stock reference`}
              loading="lazy"
            />
            <span>
              {by}
              <small>Pexels · Photo {id} ↗</small>
            </span>
          </a>
        ))}
      </div>
      <p>
        <a
          className="text-link"
          href="https://www.pexels.com/license/"
          target="_blank"
          rel="noreferrer"
        >
          PEXELS LICENSE ↗
        </a>
      </p>
      <p>
        Booking inquiries save a project brief for review. They do not reserve a
        date, take payment, establish usage rights, or create a confirmed
        engagement. Email notifications are not configured.
      </p>
      <a className="button" href="/">
        BACK TO THE STORIES ↗
      </a>
    </main>
  );
}
