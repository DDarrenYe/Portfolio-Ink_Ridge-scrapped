// Everything a visitor reads about the work lives here. Edit this file, not the markup.

export interface Project {
  leaf: string;
  name: string;
  /** Title in Simplified Chinese, shown vertically on the leaf */
  cn: string;
  pinyin: string;
  meaning: string;
  summary: string;
  stack: string[];
  link: { href: string; label: string };
}

export interface Treasure {
  glyph: string;
  pinyin: string;
  object: string;
  area: string;
  tools: string[];
}

export const projects: Project[] = [
  {
    leaf: 'Leaf one',
    name: 'Pacer',
    cn: '配速',
    pinyin: 'pèisù',
    meaning: 'pace',
    summary:
      'Running analytics. Connect Strava or upload a GPX file to see km splits, how much you fade, best efforts and predicted race times, then set a race goal and track it.',
    stack: ['Python', 'FastAPI', 'PostgreSQL', 'statsmodels', 'React'],
    link: { href: 'https://training-analytics-tool.vercel.app', label: 'Try the demo' },
  },
  {
    leaf: 'Leaf two',
    name: 'INBTWN',
    cn: '之间',
    pinyin: 'zhījiān',
    meaning: 'in between',
    summary:
      'An iOS app for learning Mandarin by talking with Toto, an AI conversation partner. Each session ends with a scorecard for fluency, clarity, vocabulary, grammar and task completion.',
    stack: ['SwiftUI', 'Swift packages', 'Claude', 'OpenAI'],
    link: { href: 'https://github.com/DDarrenYe/INBTWN', label: 'Read the source' },
  },
  {
    leaf: 'Leaf three',
    name: 'Pentimento',
    cn: '痕迹',
    pinyin: 'hénjì',
    meaning: 'traces',
    summary:
      'Our team capstone. Students import and critique their AI chats, then submit the essay; graders see which passages match the logged AI answers and export a PDF or CSV.',
    stack: ['Next.js', 'React', 'Supabase', 'Drizzle'],
    link: { href: 'https://days-capstone.vercel.app', label: 'Open the app' },
  },
];

// The four treasures of the study: brush, ink, paper and inkstone.
export const treasures: Treasure[] = [
  { glyph: '笔', pinyin: 'bǐ', object: 'brush', area: 'Interfaces', tools: ['TypeScript', 'React', 'Next.js', 'SwiftUI'] },
  { glyph: '墨', pinyin: 'mò', object: 'ink', area: 'Backend', tools: ['Python', 'FastAPI', 'SQLAlchemy', 'Alembic'] },
  { glyph: '纸', pinyin: 'zhǐ', object: 'paper', area: 'Data', tools: ['PostgreSQL', 'Supabase', 'pandas', 'statsmodels'] },
  { glyph: '砚', pinyin: 'yàn', object: 'inkstone', area: 'Craft', tools: ['pytest', 'vitest', 'Playwright', 'GitHub Actions'] },
];

export const contact = {
  href: 'https://github.com/DDarrenYe',
  label: 'github.com/DDarrenYe',
};
