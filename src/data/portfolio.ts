export type Project = {
  slug: string;
  number: string;
  title: string;
  subtitle: string;
  summary: string;
  description: string;
  problem: string;
  approach: string;
  results: string[];
  tools: string[];
  githubUrl: string;
  accent: string;
  placeholder?: boolean;
};

export type TimelineEntry = {
  date: string;
  type: 'education' | 'work' | 'project';
  title: string;
  organization: string;
  detail: string;
};

// Editable project collection: add a project here and the cards/detail routes update automatically.
export const projects: Project[] = [
  {
    slug: 'e-commerce-sales-analytics',
    number: '01',
    title: 'E-Commerce Sales Analytics',
    subtitle: 'Finding the season inside the sale',
    summary: 'A SQL and Excel investigation of 100,000 orders for a leading Brazilian retailer.',
    description: 'A commercial deep-dive that turned a large, multi-source order history into a sharper seasonal marketing story.',
    problem: 'The retailer had a substantial order history, but no clean view of where growth was coming from or how seasonal moments were shaping demand.',
    approach: 'I joined multiple sources with SQL, used subqueries and CTEs to isolate customer and order behavior, then translated the findings into an Excel reporting layer for decision-makers.',
    results: ['52.13% sales increase identified in November', 'Five festive seasons tied to the spike', 'A repeatable report to support marketing strategy'],
    tools: ['SQL', 'Excel', 'CTEs', 'Subqueries'],
    githubUrl: 'https://github.com/Rohit5950',
    accent: 'terracotta',
  },
  {
    slug: 'yulu-bike-demand-analysis',
    number: '02',
    title: 'Yulu Bike Demand Analysis',
    subtitle: 'Reading the weather in the ride',
    summary: 'EDA and hypothesis testing to understand what moves bike rental demand.',
    description: 'A practical demand study connecting weather and calendar patterns to better fleet allocation.',
    problem: 'Yulu needed to understand whether demand shifts were meaningful enough to inform where and when bikes should be made available.',
    approach: 'I explored the rental data with Python, tested hypotheses around working days and weekends, and measured how temperature and humidity relate to rental variation.',
    results: ['Temperature and humidity explain 20–30% of rental variation', 'Working days generate 35% more rentals than weekends', 'Evidence to support fleet allocation decisions'],
    tools: ['Python', 'Pandas', 'EDA', 'Hypothesis Testing', 'Machine Learning'],
    githubUrl: 'https://github.com/Rohit5950',
    accent: 'teal',
  },
  {
    slug: 'customer-segmentation-clv',
    number: '03',
    title: 'Customer Segmentation & CLV Analysis',
    subtitle: 'The value hiding in the long tail',
    summary: 'RFM and CLV analysis across 1M+ CRM records to make customer value actionable.',
    description: 'A customer intelligence project that connected segmentation to campaign, stock, and engagement decisions.',
    problem: 'A million-plus CRM records contained valuable customer signals, but broad campaigns made it difficult to prioritize high-value relationships.',
    approach: 'I treated outliers, built RFM segments, estimated customer lifetime value, and translated the segments into clearer campaign and inventory actions.',
    results: ['15% boost in campaign effectiveness', '25% increase in high-value customer engagement', '20% improvement in stock efficiency', '30% reduction in stockouts'],
    tools: ['Python', 'RFM', 'CLV', 'Outlier Treatment'],
    githubUrl: 'https://github.com/Rohit5950',
    accent: 'ochre',
  }
];

// Editable chronological journey: oldest to newest, with education, work, and projects together.
export const timeline: TimelineEntry[] = [
  {
    date: 'Aug 2019 – Jul 2022',
    type: 'education',
    title: 'BBA',
    organization: 'Maulana Abul Kalam Azad University of Technology, Kolkata',
    detail: 'Built the business foundation that now gives my analysis a practical point of view.',
  },
  {
    date: 'May 2023 – Apr 2024',
    type: 'work',
    title: 'Analyst / Operation Executive',
    organization: 'Ford Hospital & Research Center, Patna',
    detail: 'Worked close to hospital operations, where small reporting improvements had immediate human and operational consequences.',
  },
  {
    date: 'Aug 2024 – Dec 2026',
    type: 'education',
    title: 'Data Science & Analytics specialization',
    organization: 'Scaler, Bangalore',
    detail: 'Deepening the toolkit across SQL, Python, statistics, machine learning, and business analytics.',
  },
  {
    date: 'Nov 2024',
    type: 'project',
    title: 'E-Commerce Sales Analytics',
    organization: 'Independent analysis',
    detail: 'Found a 52.13% November sales increase tied to five festive seasons.',
  },
  {
    date: 'Nov 2024 – Present',
    type: 'work',
    title: 'Associate',
    organization: 'Physics Wallah, Bangalore',
    detail: 'Driving data-informed academic operations and building systems that make program delivery more reliable.',
  },
  {
    date: 'Mar 2025',
    type: 'project',
    title: 'Yulu Bike Demand Analysis',
    organization: 'Independent analysis',
    detail: 'Connected demand patterns to weather, calendar behavior, and fleet allocation.',
  },
  {
    date: 'Sep 2025',
    type: 'project',
    title: 'Customer Segmentation & CLV Analysis',
    organization: 'Independent analysis',
    detail: 'Translated 1M+ CRM records into more useful customer and inventory decisions.',
  },
];

export const skills = [
  { label: 'Programming', items: ['Python', 'SQL'] },
  { label: 'Libraries', items: ['Pandas', 'NumPy'] },
  { label: 'Analytics & BI', items: ['Power BI', 'Advanced Excel', 'Google Sheets'] },
  { label: 'Databases', items: ['MySQL'] },
  { label: 'Other', items: ['Machine Learning', 'Data Analytics', 'AI fundamentals'] },
];

export const impactStats = [
  { value: 35, suffix: '%', label: 'reduction in program delivery delays', note: 'academic operations' },
  { value: 52, suffix: '%', label: 'sales spike identified in festive-season analysis', note: 'e-commerce analysis' },
  { value: 25, suffix: '%', label: 'improvement in hospital operational efficiency', note: 'hospital operations' },
  { value: 100, suffix: '+', label: 'Telegram groups automated', note: 'workflow automation' },
];