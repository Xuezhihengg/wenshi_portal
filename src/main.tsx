import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

type Language = 'zh' | 'en';
type Page = 'home' | 'privacy' | 'terms' | 'account-deletion';
type FeedbackType = 'bug' | 'feature' | 'experience' | 'other';
type SectionId = 'philosophy' | 'features' | 'flow' | 'faq' | 'feedback';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
const CANONICAL_URL = 'https://wenshi.app';
const PORTAL_SESSION_KEY = 'wenshi.portal.session';

const copy = {
  zh: {
    nav: ['理念', '功能', '下载', 'FAQ', '反馈'],
    brand: '问事',
    badge: '现代六爻记录与分析工具',
    heroTitle: '把每一次起卦，变成可追踪、可复盘的生活判断。',
    heroBody: '问事以传统六爻为骨，以现代交互为形，帮助你记录问题、卦象、分析和应验，让灵感不只停留在当下。',
    primaryCta: '立即下载',
    secondaryCta: '了解功能',
    philosophyTitle: '不是神秘化答案，而是结构化看见问题。',
    philosophyBody: '问事尊重六爻体系中的世应、用神、动爻、月日、合冲等判断框架，也把记录、复盘和资料管理做成普通人能长期使用的产品体验。',
    featureTitle: '为认真起卦的人设计',
    featureIntro: '从提问、起卦、保存到分析、验事与归档，问事把一次完整的六爻实践拆成清晰的产品路径。',
    aiTitle: 'AI 辅助，不替代判断',
    flowTitle: '您好，今天想问什么？',
    downloadTitle: '为什么选择问事',
    downloadBody: '问事把起卦、分析、保存、验事与历史归档放在同一条清晰路径里。它不是替你决定，而是帮助你把问题看清、把判断留下、把结果复盘。',
    notifyButton: '告诉我们你的想法',
    faqTitle: '常见问题',
    feedbackTitle: '联系与反馈',
    feedbackBody: '如果你对官网、产品或功能有建议，可以直接提交到后台，我们会认真查看。',
    name: '称呼',
    email: '邮箱',
    type: '类型',
    description: '详细描述',
    submit: '提交反馈',
    submitting: '提交中...',
    success: '反馈已提交，谢谢你让问事变得更好。',
    failed: '提交失败，请稍后再试。',
    footer: '以传统结构，做现代记录。',
    privacy: '隐私政策',
    terms: '服务条款',
    deletion: '账号删除',
    backHome: '返回首页',
  },
  en: {
    nav: ['Philosophy', 'Features', 'Download', 'FAQ', 'Feedback'],
    brand: 'Wenshi',
    badge: 'Modern Liuyao journaling and analysis',
    heroTitle: 'Turn every divination into a traceable, reviewable decision record.',
    heroBody: 'Wenshi brings traditional Liuyao structure into a calm modern app: questions, hexagrams, analysis, profiles, and later verification in one place.',
    primaryCta: 'Download now',
    secondaryCta: 'Explore features',
    philosophyTitle: 'Not mystifying answers — structuring the question.',
    philosophyBody: 'Wenshi respects the Liuyao framework of World/Response, Focus Spirit, moving lines, month/day strength, unions, and clashes, while making long-term journaling feel natural.',
    featureTitle: 'Designed for serious divination practice',
    featureIntro: 'From question, casting, saving, analysis, verification, and archive review, Wenshi turns a full Liuyao practice into a clear product flow.',
    aiTitle: 'AI-assisted, not judgment-replacing',
    flowTitle: 'Hello, what would you like to ask today?',
    downloadTitle: 'Why choose Wenshi',
    downloadBody: 'Wenshi keeps casting, analysis, saving, verification, and archive review in one clear path. It does not decide for you; it helps you clarify the question, preserve the reading, and review the outcome.',
    notifyButton: 'Share your thoughts',
    faqTitle: 'FAQ',
    feedbackTitle: 'Contact & Feedback',
    feedbackBody: 'Suggestions about the website, app, or product direction go directly into our admin panel for review.',
    name: 'Name',
    email: 'Email',
    type: 'Type',
    description: 'Details',
    submit: 'Submit feedback',
    submitting: 'Submitting...',
    success: 'Feedback submitted. Thank you for helping Wenshi improve.',
    failed: 'Submit failed. Please try again later.',
    footer: 'Traditional structure, modern memory.',
    privacy: 'Privacy Policy',
    terms: 'Terms of Service',
    deletion: 'Account Deletion',
    backHome: 'Back home',
  },
};

const features = {
  zh: [
    {
      kicker: 'STEP 01',
      title: '先把问题问清楚',
      body: '从问题页开始，记录想问的具体事项、对象与背景。问事鼓励把模糊的念头落成一句可回看的问题，让后续卦象与应验都有明确锚点。',
      image: '/assets/QuestionScreen.PNG',
      align: 'right',
    },
    {
      kicker: 'STEP 02',
      title: '以仪式感完成起卦',
      body: '起卦页保留投掷、停顿、生成的节奏，同时用现代界面降低操作负担。你关注问题本身，系统负责记录时间、卦象和必要上下文。',
      image: '/assets/CastScreen.PNG',
      align: 'left',
    },
    {
      kicker: 'STEP 03',
      title: '保存时补齐上下文',
      body: '卦象不是孤立图片。保存页将问题、档案、时间、卦名与备注整理在一起，方便未来从历史页重新进入完整分析。',
      image: '/assets/SaveScreen.PNG',
      align: 'right',
    },
    {
      kicker: 'ANALYSIS',
      title: '结构化呈现四神与用神',
      body: '分析页把用神、原神、忌神、仇神拆成可解释卡片，展示爻位、旺衰、动静、世应与证据标签，不再只给一段难以复盘的结论。',
      image: '/assets/AnalysisScreen_main.PNG',
      align: 'left',
    },
    {
      kicker: 'AI READING',
      title: 'AI 解析先给断语，再讲证据',
      body: 'AI 解析页会先给出明确判断，再把应期、时间线与关键论断拆开说明。每条解释都尽量回扣卦象信号，帮助你快速抓住重点，而不是堆砌空泛话术。',
      image: '/assets/AIAnalysis.PNG',
      align: 'right',
    },
    {
      kicker: 'UNION',
      title: '用图解释合局关系',
      body: '三合、半合、六合、六冲等关系以图形与说明并行呈现。成局与待引不靠玄乎语气，而是对应到参与地支、爻位和触发条件。',
      image: '/assets/AnalysisScreen_union.PNG',
      align: 'left',
    },
    {
      kicker: 'REVIEW',
      title: '验事与历史形成闭环',
      body: '保存后的卦象进入历史中心，你可以收藏、筛选、回看，并在应验后补充批注。问事真正重视的是长期复盘，而不是一次性的“看完即走”。',
      image: '/assets/ArchiveCenterScreen.PNG',
      align: 'right',
    },
  ],
  en: [
    {
      kicker: 'STEP 01',
      title: 'Start with a clear question',
      body: 'Wenshi begins by helping you capture the matter, person, and context. A divination record should start from a question you can review later.',
      image: '/assets/QuestionScreen.PNG',
      align: 'right',
    },
    {
      kicker: 'STEP 02',
      title: 'Cast with focus and rhythm',
      body: 'The casting screen keeps the ritual feeling of the moment while removing friction. You stay with the question; Wenshi records the time and structure.',
      image: '/assets/CastScreen.PNG',
      align: 'left',
    },
    {
      kicker: 'STEP 03',
      title: 'Save the full context',
      body: 'A hexagram is not just a screenshot. Wenshi stores the question, profile, time, hexagram names, and notes so every record remains readable.',
      image: '/assets/SaveScreen.PNG',
      align: 'right',
    },
    {
      kicker: 'ANALYSIS',
      title: 'Explain Focus and spirit roles',
      body: 'The analysis screen separates Focus, Source, Adverse, and Hostile spirits into explainable cards with line position, strength, movement, and evidence tags.',
      image: '/assets/AnalysisScreen_main.PNG',
      align: 'left',
    },
    {
      kicker: 'AI READING',
      title: 'AI reading with evidence first',
      body: 'The AI reading starts with a clear verdict, then lays out timing, timeline, and concise claims. Each point is tied back to visible hexagram signals instead of generic fortune-telling language.',
      image: '/assets/AIAnalysis.PNG',
      align: 'right',
    },
    {
      kicker: 'UNION',
      title: 'Make union patterns visible',
      body: 'Three-Harmony, Half-Harmony, Six-Union, and Six-Clash are shown with diagrams and concise interpretation tied to branches, lines, and activation.',
      image: '/assets/AnalysisScreen_union.PNG',
      align: 'left',
    },
    {
      kicker: 'REVIEW',
      title: 'Close the loop with review',
      body: 'Saved readings go into the archive. Favorite, filter, revisit, and add verification notes after events unfold. Wenshi is built for long-term practice.',
      image: '/assets/ArchiveCenterScreen.PNG',
      align: 'right',
    },
  ],
};

type FeatureStory = (typeof features)['zh'][number];

const downloadReasons = {
  zh: [
    ['结构化六爻分析', '把用神、四神、合局、世应、动爻等信号拆开说明，让判断更容易被理解和复盘。'],
    ['从提问到保存一气呵成', '问题、档案、起卦时间、卦象与备注都被整理在同一条路径里，不再散落。'],
    ['历史归档与收藏', '重要卦象可以收藏、筛选和重新进入，逐渐沉淀成自己的问事资料库。'],
    ['应验记录形成闭环', '事情有了后续，可以补充验事批注，让每一次起卦都能回到现实中校验。'],
  ],
  en: [
    ['Structured Liuyao analysis', 'Focus Spirit, spirit roles, unions, World/Response, and moving lines are explained as visible signals.'],
    ['One flow from question to save', 'Question, profile, casting time, hexagram, and notes stay together instead of scattering across screenshots.'],
    ['Archive and favorites', 'Favorite important readings, filter history, and revisit the full analysis whenever you need it.'],
    ['Verification loop', 'Add outcome notes after events unfold, so every reading can return to reality and be reviewed.'],
  ],
};

const faqs = {
  zh: [
    ['问事会替我做决定吗？', '不会。问事不是“替你选择”的工具，而是把提问、卦象结构、分析线索和后续应验整理清楚。它可以帮助你看见问题里的关系与风险，但现实判断仍需要结合事实、经验和个人责任。'],
    ['AI 分析是否等于传统师傅判断？', '不是。AI 解析的定位是辅助整理：把用神、四神、合局、动爻、世应等信号组织成更容易阅读的论断。它不替代长期经验，也不会保证结论必然准确；好的使用方式是把它当作复盘线索，而不是唯一答案。'],
    ['现在可以下载吗？', '官网下载区会放置正式下载入口。当前如果按钮显示“即将上线”，说明对应平台仍在准备或审核中；你也可以通过反馈区留下建议，我们会据此优先完善最影响使用体验的部分。'],
    ['问事适合完全没有六爻基础的人吗？', '可以使用，但更适合作为“记录 + 学习 + 复盘”的长期工具。你不必一开始就理解所有术语，可以先从明确问题、保存卦象、记录结果开始；随着记录积累，再逐步理解用神、动爻、合冲等判断框架。'],
    ['我的卦象记录会同步吗？', '问事围绕账号体系设计，目标是让保存过的卦象、档案、收藏和批注可以长期保留并在设备间同步。具体同步范围会随正式版本逐步完善；涉及隐私的数据会尽量只为记录、分析和安全用途服务。'],
    ['为什么要记录应验？', '只看当下结论，很容易把一次起卦变成情绪消费。记录应验能让你回到现实结果，比较当时的判断依据、时间线和后续变化，慢慢校准自己的理解，这也是问事最重视的闭环。'],
    ['问事是否支持多个问卦人档案？', '支持。你可以为本人、家人或不同对象建立档案，保存性别、出生日期等基础信息。这样每次起卦都能绑定明确对象，之后从历史页回看时也不会混淆背景。'],
    ['反馈提交后会有人看到吗？', '会。官网和应用内反馈都会进入后台系统，我们可以按类型、状态、是否收藏和是否带截图进行处理。越具体的反馈越容易被定位，例如操作路径、设备平台、截图和你期待的结果。'],
  ],
  en: [
    ['Does Wenshi make decisions for me?', 'No. Wenshi is not designed to choose for you. It organizes the question, hexagram structure, analysis clues, and later outcomes so you can see the situation more clearly. Final judgment should still be grounded in facts, experience, and personal responsibility.'],
    ['Is AI analysis the same as a traditional master?', 'No. AI reading is an assistant for organizing signals: Focus Spirit, spirit roles, union patterns, moving lines, World/Response, and timing clues. It does not replace long-term expertise, and it should be treated as reviewable reasoning rather than an unquestionable answer.'],
    ['Can I download it now?', 'The download section is where official platform links will live. If a platform still says “Coming soon”, that version is still being prepared or reviewed. You can also leave feedback so we know which improvements matter most before release.'],
    ['Is Wenshi suitable for beginners?', 'Yes, but it works best as a long-term journaling and learning tool. You can begin with clear questions, saved records, and later verification notes, then gradually learn terms such as Focus Spirit, moving lines, unions, and clashes through repeated review.'],
    ['Will my records sync across devices?', 'Wenshi is designed around account-based saved records, profiles, favorites, and notes. The exact sync scope will expand with official releases. Private data is intended to support record keeping, analysis, security, and feedback handling rather than unrelated uses.'],
    ['Why record later verification?', 'Without later review, a reading can easily become a one-time emotional answer. Verification notes let you compare the original reasoning with what actually happened, helping you calibrate your understanding over time.'],
    ['Can I manage multiple profiles?', 'Yes. You can create profiles for yourself, family members, or different subjects, including basic context such as gender and birth date. This keeps each reading attached to a clear person or topic when you revisit it later.'],
    ['Will submitted feedback be reviewed?', 'Yes. Website and in-app feedback enter the admin system, where it can be filtered by type, status, starred value, and screenshots. The more specific your report is — steps, platform, screenshot, expected result — the easier it is to act on.'],
  ],
};

const feedbackTypeOptions: Array<{ value: FeedbackType; zh: string; en: string }> = [
  { value: 'bug', zh: 'Bug 反馈', en: 'Bug' },
  { value: 'feature', zh: '功能建议', en: 'Feature' },
  { value: 'experience', zh: '体验优化', en: 'Experience' },
  { value: 'other', zh: '其他', en: 'Other' },
];

const legal = {
  privacy: {
    zh: ['隐私政策', '问事会收集账号登录、个人档案、卦象记录、反馈内容等为提供服务所必需的信息。我们仅为账号、同步、分析、反馈处理与安全审计使用这些信息。你可以在应用内修改资料、退出登录或申请注销账号。'],
    en: ['Privacy Policy', 'Wenshi collects account login data, profiles, divination records, and feedback necessary to provide the service. We use this data for account access, sync, analysis, feedback handling, and security auditing. You may edit your profile, sign out, or request account deletion in the app.'],
  },
  terms: {
    zh: ['服务条款', '问事提供记录、分析与复盘工具，不构成法律、医疗、金融或其他专业建议。用户应对自己的提问、记录、判断和行为负责。请勿提交违法、侵权或伤害他人的内容。'],
    en: ['Terms of Service', 'Wenshi provides journaling, analysis, and review tools. It is not legal, medical, financial, or other professional advice. Users are responsible for their questions, records, judgments, and actions. Do not submit unlawful, infringing, or harmful content.'],
  },
  'account-deletion': {
    zh: ['账号删除', '你可以在应用的用户中心发起注销账号。注销不会立即物理删除全部数据库记录，而会先标记账号不可用，并按安全、审计和法定义务处理保留数据。'],
    en: ['Account Deletion', 'You can request account deletion from the user center in the app. Deletion first disables the account rather than immediately physically removing every database record; retained data is handled according to safety, audit, and legal requirements.'],
  },
} satisfies Record<Exclude<Page, 'home'>, Record<Language, [string, string]>>;

function getInitialLanguage(): Language {
  return new URLSearchParams(window.location.search).get('lang') === 'en' ? 'en' : 'zh';
}

function getInitialPage(): Page {
  const path = window.location.pathname.replace(/^\/+/, '') as Page;
  return path === 'privacy' || path === 'terms' || path === 'account-deletion' ? path : 'home';
}

function getPortalSessionId() {
  try {
    const existing = window.sessionStorage.getItem(PORTAL_SESSION_KEY);
    if (existing) return existing;
    const next = globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    window.sessionStorage.setItem(PORTAL_SESSION_KEY, next);
    return next;
  } catch {
    return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }
}

function trackPortalVisit(language: Language, page: Page) {
  const params = new URLSearchParams(window.location.search);
  const payload = {
    path: window.location.pathname || '/',
    language,
    referrer: document.referrer || null,
    utm_source: params.get('utm_source'),
    utm_medium: params.get('utm_medium'),
    utm_campaign: params.get('utm_campaign'),
    session_id: getPortalSessionId(),
    metadata: {
      page,
      title: document.title,
      screen: `${window.screen.width}x${window.screen.height}`,
    },
  };
  const body = JSON.stringify(payload);
  if (navigator.sendBeacon) {
    const blob = new Blob([body], { type: 'application/json' });
    navigator.sendBeacon(`${API_BASE}/api/v1/public/portal-visit`, blob);
    return;
  }
  fetch(`${API_BASE}/api/v1/public/portal-visit`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body,
    keepalive: true,
  }).catch(() => undefined);
}

function App() {
  const [language, setLanguage] = useState<Language>(getInitialLanguage);
  const [page, setPage] = useState<Page>(getInitialPage);
  const [activeSection, setActiveSection] = useState<SectionId>('philosophy');
  const t = copy[language];

  useEffect(() => {
    document.documentElement.lang = language === 'en' ? 'en' : 'zh-CN';
    document.title = language === 'en' ? 'Wenshi · Modern Liuyao Journal' : '问事 · 现代六爻记录与分析';
  }, [language]);

  useEffect(() => {
    trackPortalVisit(language, page);
  }, [language, page]);

  function navigate(nextPage: Page) {
    const nextPath = nextPage === 'home' ? '/' : `/${nextPage}`;
    window.history.pushState({}, '', `${nextPath}?lang=${language}`);
    setPage(nextPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function toggleLanguage() {
    const next = language === 'zh' ? 'en' : 'zh';
    setLanguage(next);
    const path = page === 'home' ? '/' : `/${page}`;
    window.history.replaceState({}, '', `${path}?lang=${next}`);
  }

  useEffect(() => {
    const handler = () => setPage(getInitialPage());
    window.addEventListener('popstate', handler);
    return () => window.removeEventListener('popstate', handler);
  }, []);

  useEffect(() => {
    if (page !== 'home') return undefined;
    const ids: SectionId[] = ['philosophy', 'features', 'flow', 'faq', 'feedback'];
    const updateActiveSection = () => {
      const probeY = window.scrollY + Math.min(window.innerHeight * 0.36, 360);
      const current = ids
        .map((id) => ({ id, element: document.getElementById(id) }))
        .filter((item): item is { id: SectionId; element: HTMLElement } => Boolean(item.element))
        .reverse()
        .find((item) => item.element.offsetTop <= probeY);
      if (current) setActiveSection(current.id);
    };
    updateActiveSection();
    window.addEventListener('scroll', updateActiveSection, { passive: true });
    window.addEventListener('resize', updateActiveSection);
    return () => {
      window.removeEventListener('scroll', updateActiveSection);
      window.removeEventListener('resize', updateActiveSection);
    };
  }, [page]);

  if (page !== 'home') {
    return <LegalPage page={page} language={language} onLanguage={toggleLanguage} onHome={() => navigate('home')} />;
  }

  return (
    <main>
      <Nav language={language} activeSection={activeSection} onLanguage={toggleLanguage} onNavigate={navigate} />
      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow">{t.badge}</span>
          <h1>{t.heroTitle}</h1>
          <p>{t.heroBody}</p>
          <div className="hero-actions">
            <a href="#download" className="button primary">{t.primaryCta}</a>
            <a href="#features" className="button ghost">{t.secondaryCta}</a>
          </div>
        </div>
        <PhoneMock language={language} />
      </section>

      <section id="philosophy" className="statement">
        <h2>{t.philosophyTitle}</h2>
        <p>{t.philosophyBody}</p>
      </section>

      <section id="features" className="section features-section">
        <div className="section-head">
          <div>
            <h2>{t.featureTitle}</h2>
            <p>{t.featureIntro}</p>
          </div>
        </div>
        <div className="feature-stories">
          {features[language].map((feature) => (
            <FeatureStoryCard key={feature.title} feature={feature} />
          ))}
        </div>
      </section>

      <section className="ai-band">
        <div>
          <h2>{t.aiTitle}</h2>
          <p>{language === 'en' ? 'Wenshi keeps the analysis explainable: every conclusion is tied to visible signals such as line movement, Five Elements, spirits, unions, clashes, void, and break.' : '问事强调可解释性：每一个结论都尽量落到动爻、五行、四神、合局、冲破、空亡等可见信号上。'}</p>
        </div>
        <div className="signal-card">
          {['用神', '原神', '忌神', '合局', '世应'].map((item) => <i key={item}>{item}</i>)}
        </div>
      </section>

      <section id="flow" className="section download-section">
        <div className="section-head">
          <div>
            <h2>{t.downloadTitle}</h2>
            <p>{t.downloadBody}</p>
          </div>
        </div>
        <div className="download-reason-grid">
          {downloadReasons[language].map(([title, body], index) => (
            <article key={title}>
              <em>{String(index + 1).padStart(2, '0')}</em>
              <h3>{title}</h3>
              <p>{body}</p>
            </article>
          ))}
        </div>
        <div className="download-stage">
          <div className="download-manifesto">
            <h3>{t.flowTitle}</h3>
            <p>{language === 'en' ? 'Keep the moment of asking gentle, focused, and worth returning to.' : '让每一次提问都被认真安放，也能在未来被重新理解。'}</p>
          </div>
          <div className="store-links" aria-label={language === 'en' ? 'Download links' : '下载链接'}>
            <a aria-disabled="true">
              <b></b>
              <span>{language === 'en' ? 'Download on the App Store' : '在 App Store 下载'}</span>
              <em>{language === 'en' ? 'Coming soon' : '即将上线'}</em>
            </a>
            <a aria-disabled="true">
              <b>▶</b>
              <span>{language === 'en' ? 'Get it on Android' : 'Android 版本下载'}</span>
              <em>{language === 'en' ? 'Coming soon' : '即将上线'}</em>
            </a>
          </div>
        </div>
      </section>

      <section id="faq" className="section faq">
        <div className="section-head">
          <h2>{t.faqTitle}</h2>
        </div>
        {faqs[language].map(([question, answer]) => (
          <details key={question}>
            <summary>{question}</summary>
            <p>{answer}</p>
          </details>
        ))}
      </section>

      <FeedbackSection language={language} />
      <Footer language={language} onNavigate={navigate} />
    </main>
  );
}

function Nav({ language, activeSection, onLanguage, onNavigate }: { language: Language; activeSection?: SectionId; onLanguage: () => void; onNavigate: (page: Page) => void }) {
  const t = copy[language];
  const sectionIds: SectionId[] = ['philosophy', 'features', 'flow', 'faq', 'feedback'];
  return (
    <nav className="top-nav">
      <button className="logo" onClick={() => onNavigate('home')}><span>问</span>{t.brand}</button>
      <div>
        {sectionIds.map((id, index) => (
          <a key={id} className={activeSection === id ? 'active' : undefined} href={`#${id}`}>{t.nav[index]}</a>
        ))}
      </div>
      <button className="lang" onClick={onLanguage}>{language === 'zh' ? 'EN' : '中文'}</button>
    </nav>
  );
}

function PhoneMock({ language }: { language: Language }) {
  return (
    <div className="phone hero-phone" aria-label={language === 'en' ? 'Question screen preview' : '问题页预览'}>
      <img src="/assets/QuestionScreen.PNG" alt={language === 'en' ? 'Wenshi question screen' : '问事问题输入页'} />
    </div>
  );
}

function FeatureStoryCard({ feature }: { feature: FeatureStory }) {
  return (
    <article className={`feature-story ${feature.align === 'left' ? 'image-left' : 'image-right'}`}>
      <div className="feature-copy">
        <span>{feature.kicker}</span>
        <h3>{feature.title}</h3>
        <p>{feature.body}</p>
      </div>
      <ScreenshotFrame src={feature.image} alt={feature.title} />
    </article>
  );
}

function ScreenshotFrame({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="screenshot-frame">
      <img src={src} alt={alt} loading="lazy" />
    </div>
  );
}

function FeedbackSection({ language }: { language: Language }) {
  const t = copy[language];
  const [type, setType] = useState<FeedbackType>('feature');
  const [typeOpen, setTypeOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [description, setDescription] = useState('');
  const [state, setState] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const canSubmit = description.trim().length >= 6 && state !== 'submitting';
  const selectedTypeLabel = feedbackTypeOptions.find((option) => option.value === type)?.[language] ?? type;

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!canSubmit) return;
    setState('submitting');
    try {
      const response = await fetch(`${API_BASE}/api/v1/public/feedback`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ type, name, email, description, language }),
      });
      if (!response.ok) throw new Error(await response.text());
      setName('');
      setEmail('');
      setDescription('');
      setType('feature');
      setState('success');
    } catch {
      setState('error');
    }
  }

  return (
    <section id="feedback" className="feedback-section">
      <div>
        <h2>{t.feedbackTitle}</h2>
        <p>{t.feedbackBody}</p>
      </div>
      <form onSubmit={submit}>
        <div className="two-fields">
          <label>{t.name}<input value={name} onChange={(event) => setName(event.target.value)} placeholder={language === 'en' ? 'Optional' : '可选'} /></label>
          <label>{t.email}<input value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" /></label>
        </div>
        <div className="custom-select-field">
          <span>{t.type}</span>
          <div className={`custom-select ${typeOpen ? 'open' : ''}`}>
            <button type="button" onClick={() => setTypeOpen((current) => !current)} aria-expanded={typeOpen}>
              {selectedTypeLabel}
              <i>⌄</i>
            </button>
            {typeOpen ? (
              <div className="custom-select-menu">
                {feedbackTypeOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    className={option.value === type ? 'active' : undefined}
                    onClick={() => {
                      setType(option.value);
                      setTypeOpen(false);
                    }}
                  >
                    {option[language]}
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        </div>
        <label>{t.description}<textarea value={description} onChange={(event) => setDescription(event.target.value)} rows={6} placeholder={language === 'en' ? 'Tell us what you noticed or need.' : '告诉我们你注意到的问题或期待的功能。'} /></label>
        <button className="button primary" disabled={!canSubmit}>{state === 'submitting' ? t.submitting : t.submit}</button>
        {state === 'success' ? <p className="form-message success">{t.success}</p> : null}
        {state === 'error' ? <p className="form-message error">{t.failed}</p> : null}
      </form>
    </section>
  );
}

function LegalPage({ page, language, onLanguage, onHome }: { page: Exclude<Page, 'home'>; language: Language; onLanguage: () => void; onHome: () => void }) {
  const [title, body] = legal[page][language];
  return (
    <main>
      <nav className="top-nav">
        <button className="logo" onClick={onHome}><span>问</span>{copy[language].brand}</button>
        <button className="lang" onClick={onLanguage}>{language === 'zh' ? 'EN' : '中文'}</button>
      </nav>
      <section className="legal-page">
        <span>LEGAL</span>
        <h1>{title}</h1>
        <p>{body}</p>
        <p>{language === 'en' ? `Canonical site: ${CANONICAL_URL}` : `官网地址：${CANONICAL_URL}`}</p>
        <button className="button ghost" onClick={onHome}>{copy[language].backHome}</button>
      </section>
    </main>
  );
}

function Footer({ language, onNavigate }: { language: Language; onNavigate: (page: Page) => void }) {
  const t = copy[language];
  const year = useMemo(() => new Date().getFullYear(), []);
  return (
    <footer>
      <div><strong>{t.brand}</strong><span>{t.footer}</span></div>
      <div>
        <button onClick={() => onNavigate('privacy')}>{t.privacy}</button>
        <button onClick={() => onNavigate('terms')}>{t.terms}</button>
        <button onClick={() => onNavigate('account-deletion')}>{t.deletion}</button>
      </div>
      <small>© {year} Wenshi</small>
    </footer>
  );
}

createRoot(document.getElementById('root')!).render(<App />);
