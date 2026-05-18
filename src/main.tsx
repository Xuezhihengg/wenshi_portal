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

type PolicySection = {
  title: string;
  paragraphs?: string[];
  table?: {
    headers: string[];
    rows: string[][];
  };
  children?: PolicySection[];
};

const termsPolicy = {
  updatedAt: {
    zh: '2026年5月18日',
    en: 'May 18, 2026',
  },
  intro: {
    zh: '欢迎使用问事应用及相关服务（以下简称“服务”）。本服务条款（以下简称“条款”）是您与问事服务运营者之间关于使用本服务的法律协议。使用本服务即表示您已阅读、理解并同意本条款；若您不同意，请勿使用本服务。',
    en: 'Welcome to Wenshi and its related services (the “Service”). These Terms of Service are a legal agreement between you and the Wenshi service operator regarding your use of the Service. By using the Service, you confirm that you have read, understood, and agreed to these Terms. If you do not agree, please do not use the Service.',
  },
  sections: {
    zh: [
      {
        title: '重要提示',
        paragraphs: [
          '娱乐性质声明：本服务提供的 AI 解读内容仅供娱乐、文化体验、记录复盘和自我启发参考，不构成任何形式的专业建议。您不应将 AI 解读作为重大人生决策的唯一依据。',
          '责任限制：请仔细阅读本条款中关于“保证免责声明”和“责任限制”的内容。在适用法律允许的最大范围内，我们对因使用或无法使用本服务产生的损害承担有限责任。',
        ],
      },
      {
        title: '一、未成年人',
        paragraphs: [
          '我们非常重视对未成年人的保护，并按下列规则分级处理未成年人对本服务的使用。',
        ],
        children: [
          {
            title: '1.1 不满 14 周岁的儿童',
            paragraphs: ['我们谢绝向不满 14 周岁的儿童提供本服务。若您为不满 14 周岁的儿童，请在监护人的陪同下选择适合您使用的应用。'],
          },
          {
            title: '1.2 已满 14 周岁但未满 18 周岁的未成年人',
            paragraphs: ['可由监护人授权同意或自行授权同意使用本服务。我们建议您请父母或其他法定监护人共同阅读本条款及《问事隐私政策》，并在征得监护人同意后再决定是否使用本服务、是否开启可能涉及付费的功能。'],
          },
          {
            title: '1.3 监护人权利',
            paragraphs: ['若您是未成年人的父母或法定监护人，您可通过本条款“联系我们”章节所列方式联系我们，要求查询、更正、删除被监护人的个人信息或注销其账户。我们将在 7 个工作日内核实并处理，最长不超过 15 个工作日。'],
          },
        ],
      },
      {
        title: '二、许可与使用',
        paragraphs: [
          '在您遵守本条款的前提下，我们授予您一项个人的、非独占的、不可转让的、不可再许可的、有限的权利和许可，允许您访问和使用本服务及其内容，仅用于您的个人娱乐、文化体验、记录复盘或信息目的。',
          '除本条款明确许可外，严禁以任何其他方式使用本服务及其组件。我们保留本条款未授予您的所有权利。',
        ],
        children: [
          {
            title: '2.1 内容定义',
            paragraphs: ['“内容”指服务内的文章、文本、图像、标题、主题、动画、概念、声音、视听效果、界面设计、AI 解读结果及其他内容。'],
          },
          {
            title: '2.2 用户生成内容',
            paragraphs: [
              '您对自己通过服务创建、发布、上传、保存、分享和分发的内容（以下简称“用户生成内容”）承担全部责任。我们不对用户生成内容的准确性、完整性或质量做任何承诺，也不以任何方式认可该内容。',
              '通过在服务上发布或分享用户生成内容，您确认您拥有必要的权利和许可，且不侵犯任何第三方的知识产权、隐私权、名誉权或其他合法权益。',
              '您授权我们在运营、提供、维护和改进本服务所必需的范围内，使用、复制、存储、展示、处理和生成与您的用户生成内容相关的服务结果，而无需向您支付费用。',
            ],
          },
        ],
      },
      {
        title: '三、用户行为规范',
        paragraphs: [
          '使用或访问本服务时，您同意不得从事以下行为。',
        ],
        children: [
          {
            title: '3.1 禁止用途',
            paragraphs: [
              '不得将本服务用于未经授权的商业目的、促销目的，或以本条款不允许的方式为任何第三方利益使用。',
              '不得发布、上传、保存或传播违法、侵权、诽谤、淫秽、侵犯他人隐私、威胁、骚扰、仇恨、歧视、暴力或其他不当内容。',
            ],
          },
          {
            title: '3.2 禁止技术滥用',
            paragraphs: [
              '不得试图干扰、破坏、入侵、逆向工程、修改、利用漏洞，或向服务引入间谍软件、病毒、蠕虫或其他潜在有害程序。',
              '不得使用未经授权的第三方程序拦截、模拟或重定向服务与我们之间的通信，或收集有关服务的信息。',
              '不得规避、绕过、移除、禁用、破坏或修改我们或任何第三方实施的技术保护措施。',
            ],
          },
          {
            title: '3.3 禁止复制与规避',
            paragraphs: [
              '不得以本条款未明确授权的方式复制、再现、分发、展示、镜像、框架或使用本服务或其任何内容。',
              '不得在适用法律未明确允许的情况下，对服务进行反编译、反汇编、数据挖掘、解密、提取源代码、修改、改编或翻译。',
              '不得违反任何适用的法律法规，亦不得鼓励、促进、参与或帮助他人从事上述任何行为。',
            ],
          },
        ],
      },
      {
        title: '四、知识产权',
        paragraphs: [
          '我们及相关权利方拥有本服务（包括其中所有内容）的全部所有权、权益和知识产权。您同意不移除、更改或遮盖服务中包含或附带的任何版权、商标、服务标志或其他专有权利声明。',
          '您理解并同意，您对本服务或其中任何平台内容不享有所有权权益。若我们自行判断认为您违反本条款，我们可以行使本条款下的权利，包括终止本条款和您对服务的访问权限。',
          '虽然我们没有义务监控对服务的访问或使用，或审查、编辑任何内容，但我们有权为运营服务、确保遵守本条款、保护可能受到威胁的任何人的健康或安全、保护合法权益、报告犯罪或违规行为，或遵守适用法律而进行必要处理。',
        ],
      },
      // {
      //   title: '五、付费服务',
      //   paragraphs: [
      //     '本服务可能提供会员订阅、虚拟权益、AI 解读次数或其他付费数字内容。具体付费项目、权益内容、价格、周期、可用范围和规则以 App 内实际展示为准。若当前版本尚未开放付费服务，本条款将作为后续上线付费功能时的基础规则。',
      //   ],
      //   children: [
      //     {
      //       title: '5.1 会员订阅',
      //       paragraphs: ['若本服务提供会员订阅，具体订阅方案、权益内容、订阅周期与价格以您订阅时 App 内显示为准。我们有权根据法律法规要求或运营策略调整订阅方案与定价，并在调整生效前以合理方式告知。'],
      //     },
      //     {
      //       title: '5.2 自动续费服务',
      //       paragraphs: ['若会员订阅包含自动续费功能，扣款时间、扣款方式、取消方式和退款政策以 App 内说明、第三方支付平台规则及单独的自动续费协议为准。您可按 App 内指引或第三方支付平台规则关闭自动续费。'],
      //     },
      //     {
      //       title: '5.3 虚拟权益',
      //       paragraphs: [
      //         '虚拟权益是本服务内的封闭型平台服务凭证，仅可用于在问事平台内兑换或使用对应服务。',
      //         '虚拟权益不具有法定货币价值，不可兑换为人民币或其他货币，不可提现，不可在不同账号之间赠送、转让或交易。',
      //         '虚拟权益一经兑换为相应服务，将按对应规则消耗；已消耗权益无法恢复。账户注销后，未使用的虚拟权益可能永久失效。',
      //       ],
      //     },
      //     {
      //       title: '5.4 退款政策',
      //       paragraphs: [
      //         '会员服务、AI 解读次数、虚拟权益等属于网络数字内容产品或虚拟商品，通常具有即时交付、不可保存、不可恢复的特性。除法律法规强制规定或平台规则另有明确说明外，在线交付的数字化商品不适用 7 日无理由退货。',
      //         '您发出的充值或订阅指令一经第三方支付渠道完成扣款，原则上不可撤回或撤销。因您自身原因（包括但不限于充错账号、充错金额、操作不当、账号或支付密码泄露）所致损失，由您自行承担。',
      //         '如发生重复扣费、错误扣费等异常情况，请通过客服或反馈入口联系我们。我们将依日志记录核实后于 7 个工作日内处理，最长不超过 15 个工作日。',
      //       ],
      //     },
      //     {
      //       title: '5.5 iOS 用户退款',
      //       paragraphs: ['如通过 Apple App Store 完成购买，退款请求应通过 Apple 官方渠道提交，Apple 是否予以退款由 Apple 公司依其退款政策独立决定，我们无权干预亦不承担相应责任。'],
      //     },
      //   ],
      // },
      {
        title: '六、第三方网站和资源',
        paragraphs: [
          '本服务可能包含第三方网站、服务或资源的链接。我们仅为方便起见提供这些链接，对第三方网站或资源上的内容、产品或服务不承担责任。您确认对使用任何第三方网站、服务或资源承担全部责任并自担风险。',
        ],
      },
      {
        title: '七、数据费用和移动设备',
        paragraphs: [
          '您需对使用本服务可能产生的所有网络、流量、设备、短信、数据或通信费用负责。使用本服务前，请了解您的网络运营商、设备厂商或服务提供商可能收取的费用。',
        ],
      },
      {
        title: '八、保证免责声明',
        paragraphs: [
          '在适用法律允许的最大范围内，本服务及通过服务提供的所有材料和信息均按“现状”和“可用”基础提供，不提供任何形式的保证。我们明确否认任何关于适销性、特定用途适用性、不侵权性的明示或暗示保证。',
          '我们不保证服务将满足您的要求，或在不中断、安全或无错误的基础上可用。我们不对服务或通过服务提供的材料或信息的质量、准确性、及时性、真实性、完整性或可靠性做任何保证。',
        ],
        children: [
          {
            title: '8.1 内容性质声明',
            paragraphs: ['本服务通过生成式人工智能技术，依据用户输入的信息生成具有文学性、文化性与娱乐性的解读文本。用户应将其理解为文化欣赏、文学创作、内省启发与娱乐互动的素材，而非任何形式的事实陈述、确定性预测或专业意见。'],
          },
          {
            title: '8.2 AI 生成内容免责',
            paragraphs: ['AI 解读内容由人工智能算法自动生成。我们不对 AI 生成内容的准确性、完整性、及时性或适用性做任何保证。您不应将 AI 生成内容作为任何重大决策的唯一依据。'],
          },
          {
            title: '8.3 不替代专业意见',
            paragraphs: [
              '本服务所生成的全部内容均不构成、亦不得被解释或依赖为医疗、健康、心理、法律、合规、投资、理财、税务、保险、婚姻、家庭、子女教育、职业、升学、移民等领域的专业意见或决策依据。',
              '涉及前述领域事项，用户应当咨询具备相应资质的执业专业人士。用户将本服务生成内容用于前述用途或作为决策依据所产生的任何后果，由用户自行承担。',
            ],
          },
          {
            title: '8.4 高敏感情境的主动干预',
            paragraphs: ['本服务在用户输入涉及自伤、自杀、紧急医疗、暴力威胁等高敏感情境时，可能依据预设规则主动暂停内容生成并提供心理援助热线、紧急救助渠道及公共服务信息，引导用户寻求专业帮助。本机制系我们主动履行的社会责任，不构成对用户安全状态的承诺、保证或担保。'],
          },
        ],
      },
      {
        title: '九、责任限制',
        paragraphs: [
          '在适用法律允许的最大范围内，我们不对因使用或无法使用本服务或服务中任何内容而产生的任何损害承担责任，包括但不限于任何间接、附带、特殊、惩罚性或后果性损害，无论是基于合同、保证、侵权、产品责任、严格责任或其他理论，即使我们已被告知此类损害的可能性。',
          '尽管有上述规定，某些司法管辖区不允许排除某些保证或限制责任，因此上述条款可能不适用于您。在此类司法管辖区，上述排除和限制将在该司法管辖区法律允许的最大范围内适用。',
        ],
      },
      {
        title: '十、服务变更与终止',
        paragraphs: [
          '我们可能会不时更新、修改或改进服务功能。',
          '在与适用法律一致的最大范围内，如果发生以下情况，我们可以暂停、修改或终止您对服务的访问和使用，而无需承担责任或向您发出通知：(a) 我们停止向类似用户提供服务或其部分；(b) 您违反本条款的任何规定；(c) 我们出于任何原因自行判断认为有必要暂停、修改或终止您的访问权限。',
          '本条款终止、中止或取消后，授予您的权利将自动终止，您不得再行使这些权利。',
        ],
      },
      {
        title: '十一、争议解决',
        children: [
          {
            title: '11.1 适用法律',
            paragraphs: ['本条款及与之相关的任何行为，包括因本条款产生或与之相关的争议、争论、分歧或索赔，均受中华人民共和国法律管辖。'],
          },
          {
            title: '11.2 争议处理',
            paragraphs: ['因本条款产生的争议，双方应首先友好协商解决；协商不成的，任一方可向有管辖权的人民法院提起诉讼。'],
          },
        ],
      },
      {
        title: '十二、其他条款',
        children: [
          {
            title: '12.1 完整协议',
            paragraphs: ['本条款及本条款中提及的其他文件、政策或信息构成您与我们之间关于服务的完整理解，并取代此前关于服务的任何口头或书面理解或协议。'],
          },
          {
            title: '12.2 可分割性',
            paragraphs: ['如果本条款的任何条款被有管辖权的法院或机构认定为不可执行，则该条款仅在适用法律允许的最大范围内执行，本条款的其余条款仍具有完全效力。'],
          },
          {
            title: '12.3 弃权',
            paragraphs: ['我们未能执行本条款的任何权利或规定，不应被视为放弃该权利或规定。任何弃权仅在经正式授权的书面文件中有效。'],
          },
          {
            title: '12.4 条款变更',
            paragraphs: ['我们可能不时更改、修改或更新本条款，修订后的条款将前瞻性地适用。为便于参考，我们会更新页面中的“最后更新”日期。'],
          },
        ],
      },
      {
        title: '十三、联系我们',
        paragraphs: [
          '如果您对本条款或服务有任何问题、意见或建议，可以通过官网反馈页或 App 内反馈入口联系我们。',
          '我们通常在收到您的请求后 7 个工作日内回复，最长不超过 15 个工作日。',
        ],
      },
    ],
    en: [
      {
        title: 'Important Notice',
        paragraphs: [
          'Entertainment nature: AI interpretations provided by the Service are for entertainment, cultural experience, journaling, review, and self-reflection only. They do not constitute professional advice and should not be the sole basis for major life decisions.',
          'Limitation of liability: please read the warranty disclaimer and limitation of liability carefully. To the maximum extent permitted by law, our liability for damages arising from use of the Service is limited.',
        ],
      },
      {
        title: '1. Minors',
        paragraphs: ['We take minors’ protection seriously and handle use of the Service by age group.'],
        children: [
          { title: '1.1 Children under 14', paragraphs: ['We do not provide the Service to children under 14. If you are under 14, please use age-appropriate apps with a guardian present.'] },
          { title: '1.2 Users aged 14 to under 18', paragraphs: ['You may use the Service with guardian authorization or your own authorization where allowed. We recommend that you and your parent or legal guardian read these Terms and the Wenshi Privacy Policy together before using the Service or enabling paid features.'] },
          { title: '1.3 Guardian rights', paragraphs: ['Parents or legal guardians may contact us to request access, correction, deletion, or account closure for a minor. We will verify and handle the request within 7 business days, and no later than 15 business days.'] },
        ],
      },
      {
        title: '2. License and Use',
        paragraphs: [
          'Subject to your compliance with these Terms, we grant you a personal, non-exclusive, non-transferable, non-sublicensable, limited license to access and use the Service and its content for personal entertainment, cultural experience, journaling, review, or informational purposes.',
          'Any use not expressly permitted by these Terms is prohibited. We reserve all rights not granted to you.',
        ],
        children: [
          { title: '2.1 Content', paragraphs: ['“Content” includes articles, text, images, titles, themes, animations, concepts, audio, audiovisual effects, interface design, AI outputs, and other materials in the Service.'] },
          { title: '2.2 User-generated content', paragraphs: ['You are solely responsible for content you create, publish, upload, save, share, or distribute through the Service. By doing so, you confirm that you have the necessary rights and that the content does not infringe third-party rights. You grant us the permission necessary to operate, provide, maintain, and improve the Service.'] },
        ],
      },
      {
        title: '3. User Conduct',
        paragraphs: ['When using or accessing the Service, you agree not to engage in the following conduct.'],
        children: [
          { title: '3.1 Prohibited uses', paragraphs: ['Do not use the Service for unauthorized commercial or promotional purposes, or for any third party’s benefit in a way not permitted by these Terms. Do not post or transmit unlawful, infringing, defamatory, obscene, privacy-invasive, threatening, harassing, hateful, discriminatory, violent, or otherwise inappropriate content.'] },
          { title: '3.2 Technical abuse', paragraphs: ['Do not interfere with, disrupt, hack, reverse engineer, modify, exploit, or introduce spyware, viruses, worms, or other harmful code into the Service. Do not use unauthorized third-party programs to intercept, simulate, redirect, or collect Service communications or information.'] },
          { title: '3.3 Copying and circumvention', paragraphs: ['Do not copy, reproduce, distribute, display, mirror, frame, decompile, disassemble, mine data from, decrypt, extract source code from, or circumvent technical protection measures in the Service except where expressly allowed by law.'] },
        ],
      },
      {
        title: '4. Intellectual Property',
        paragraphs: [
          'We and our rights holders own all rights, title, interests, and intellectual property in the Service and its platform content. You agree not to remove, alter, or obscure any copyright, trademark, service mark, or proprietary notices.',
          'We may monitor, review, or process access, use, or content where reasonably necessary to operate the Service, enforce these Terms, protect safety or legitimate rights, report unlawful conduct, or comply with law.',
        ],
      },
      // {
      //   title: '5. Paid Services',
      //   paragraphs: ['The Service may provide subscriptions, virtual benefits, AI reading credits, or other paid digital content. Specific paid items, benefits, prices, periods, scope, and rules are subject to in-app display. If paid services are not yet available, this section serves as the baseline rule for future paid features.'],
      //   children: [
      //     { title: '5.1 Subscriptions', paragraphs: ['If subscriptions are offered, plans, benefits, periods, and prices are subject to the in-app display at the time of subscription.'] },
      //     { title: '5.2 Auto-renewal', paragraphs: ['If auto-renewal applies, billing time, payment method, cancellation method, and refund policy are subject to in-app notices, payment-platform rules, and any separate auto-renewal agreement.'] },
      //     { title: '5.3 Virtual benefits', paragraphs: ['Virtual benefits are closed-loop service credentials within Wenshi only. They have no legal currency value, cannot be withdrawn or exchanged for cash, and cannot be transferred or traded between accounts.'] },
      //     { title: '5.4 Refund policy', paragraphs: ['Membership services, AI reading credits, and virtual benefits are generally digital content or virtual goods with immediate delivery characteristics. Unless required by law or stated by platform rules, online-delivered digital goods are not subject to no-reason returns.'] },
      //     { title: '5.5 iOS refunds', paragraphs: ['Purchases made through Apple App Store should be refunded through Apple’s official channels. Apple independently decides whether to issue refunds under its own policy.'] },
      //   ],
      // },
      { title: '6. Third-party Websites and Resources', paragraphs: ['The Service may contain links to third-party websites, services, or resources. These links are provided for convenience only. We are not responsible for third-party content, products, or services, and you use them at your own risk.'] },
      { title: '7. Data Fees and Mobile Devices', paragraphs: ['You are responsible for all network, data, device, SMS, or communication fees that may arise from using the Service. Please check fees charged by your carrier, device provider, or service provider before use.'] },
      {
        title: '8. Warranty Disclaimer',
        paragraphs: [
          'To the maximum extent permitted by law, the Service and all materials and information provided through it are provided on an “as is” and “as available” basis without warranties of any kind. We expressly disclaim warranties of merchantability, fitness for a particular purpose, and non-infringement.',
          'We do not warrant that the Service will meet your requirements or be available uninterrupted, secure, or error-free, nor do we warrant the quality, accuracy, timeliness, truthfulness, completeness, or reliability of the Service or its materials.',
        ],
        children: [
          { title: '8.1 Nature of content', paragraphs: ['The Service uses generative AI to produce interpretive text based on user input. Users should understand outputs as cultural appreciation, creative writing, self-reflection, and entertainment, not factual statements, deterministic predictions, or professional advice.'] },
          { title: '8.2 AI-generated content disclaimer', paragraphs: ['AI interpretations are automatically generated by algorithms. We make no warranty regarding their accuracy, completeness, timeliness, or suitability. You should not rely on AI-generated content as the sole basis for any major decision.'] },
          { title: '8.3 Not professional advice', paragraphs: ['Service outputs do not constitute medical, health, psychological, legal, compliance, investment, financial, tax, insurance, marriage, family, education, career, school admission, immigration, or similar professional advice. Consult qualified professionals for such matters.'] },
          { title: '8.4 High-risk situations', paragraphs: ['When inputs involve self-harm, suicide, urgent medical needs, or threats of violence, the Service may pause generation and provide crisis hotlines, emergency channels, or public assistance information. This is a voluntary social responsibility measure and not a guarantee of user safety.'] },
        ],
      },
      { title: '9. Limitation of Liability', paragraphs: ['To the maximum extent permitted by law, we are not liable for damages arising from use or inability to use the Service or any content in it, including indirect, incidental, special, punitive, or consequential damages, whether based on contract, warranty, tort, product liability, strict liability, or other theory, even if we have been advised of the possibility of such damages.', 'Some jurisdictions do not allow certain warranty exclusions or liability limitations, so the above terms may not apply to you. In such jurisdictions, exclusions and limitations apply to the fullest extent permitted by local law.'] },
      { title: '10. Service Changes and Termination', paragraphs: ['We may update, modify, or improve Service features from time to time.', 'To the maximum extent consistent with applicable law, we may suspend, modify, or terminate your access without liability or prior notice if: (a) we stop providing the Service or part of it to similar users; (b) you violate these Terms; or (c) we determine that suspension, modification, or termination is necessary.', 'When these Terms end, are suspended, or are canceled, your granted rights automatically end.'] },
      { title: '11. Dispute Resolution', children: [{ title: '11.1 Governing law', paragraphs: ['These Terms and disputes related to them are governed by the laws of the People’s Republic of China.'] }, { title: '11.2 Dispute handling', paragraphs: ['Disputes should first be resolved through friendly negotiation. If negotiation fails, either party may bring a claim before a court with jurisdiction.'] }] },
      { title: '12. Miscellaneous', children: [{ title: '12.1 Entire agreement', paragraphs: ['These Terms and referenced policies constitute the complete understanding between you and us regarding the Service.'] }, { title: '12.2 Severability', paragraphs: ['If any provision is found unenforceable, it will be enforced to the maximum extent permitted, and the remaining provisions remain in effect.'] }, { title: '12.3 Waiver', paragraphs: ['Our failure to enforce any right or provision is not a waiver. Any waiver must be in writing by an authorized representative.'] }, { title: '12.4 Changes', paragraphs: ['We may change or update these Terms from time to time. Updated Terms apply prospectively, and we will update the “Last updated” date.'] }] },
      { title: '13. Contact Us', paragraphs: ['If you have questions, comments, or suggestions about these Terms or the Service, please contact us through the website feedback page or in-app feedback entry.', 'We usually respond within 7 business days after receiving your request, and no later than 15 business days.'] },
    ],
  },
} satisfies {
  updatedAt: Record<Language, string>;
  intro: Record<Language, string>;
  sections: Record<Language, PolicySection[]>;
};

const privacyPolicy = {
  updatedAt: {
    zh: '2026年5月18日',
    en: 'May 18, 2026',
  },
  intro: {
    zh: '欢迎使用问事。本隐私政策适用于问事 App、问事官网及相关服务。我们深知个人信息对您的重要性，并将依据《中华人民共和国个人信息保护法》《中华人民共和国网络安全法》《中华人民共和国数据安全法》《信息安全技术 个人信息安全规范》（GB/T 35273）等法律法规要求，依法保护您的个人信息。请您在使用本服务前仔细阅读并充分理解本政策；当您勾选同意、注册、登录或继续使用本服务，即视为您已理解并同意本政策。若您不同意，请停止使用本服务。',
    en: 'Welcome to Wenshi. This Privacy Policy applies to the Wenshi app, website, and related services. We understand the importance of personal information and protect it in accordance with applicable laws and standards. Please read this policy carefully before using the Service. By agreeing, registering, signing in, or continuing to use the Service, you acknowledge that you understand and accept this policy.',
  },
  sections: {
    zh: [
      {
        title: '一、我们如何收集和使用您的个人信息',
        paragraphs: [
          '我们仅在为您提供本服务所必需的范围内收集个人信息，并遵循“最小必要原则”。不同功能可能涉及不同信息类型；若您拒绝提供非必要信息，通常不会影响基础功能使用，但可能影响对应功能。',
        ],
        children: [
          {
            title: '1.1 注册和登录账户',
            paragraphs: [
              '当您注册或登录问事账户时，我们可能收集手机号、电子邮箱地址、验证码验证结果、登录时间、登录状态和必要的账号标识。手机号和邮箱用于接收验证码、完成账号登录、身份验证和账号安全保护。',
              '当前 App 界面中 Apple、微信、Google 等第三方登录入口处于待接入或未开放状态；若未来正式开放，我们会在启用前补充说明第三方账户信息的收集范围并依法征得授权。',
            ],
          },
          {
            title: '1.2 使用 AI 解读与记录功能',
            paragraphs: [
              '当您使用起卦、分析、AI 解读、保存和复盘功能时，我们会处理您主动输入或生成的咨询问题、卦象数据、分析结果、追问内容、批注、收藏状态、应验记录、创建时间和相关操作数据。',
              '为生成 AI 解读结果，您的咨询问题、卦象结构、操作数据和必要上下文可能会发送至我们对接的 DeepSeek AI 服务进行处理。我们不会主动向 AI 服务提供商发送您的手机号、邮箱等可直接识别身份的信息。',
            ],
          },
          {
            title: '1.3 个性化资料（可选）',
            paragraphs: [
              '为便于保存、回看和区分不同问事对象，您可以选择填写昵称、性别、出生日期、头像、档案名称等资料。部分资料可能用于卦象记录、历史筛选、档案展示和个性化解读上下文。',
              '头像图片由您主动选择或拍摄后上传；您可以不提供头像，也可以在 App 内修改或删除相关资料。',
            ],
          },
          {
            title: '1.4 历史记录',
            paragraphs: [
              '为方便您回顾和管理记录，我们会保存您的问题、卦象、AI 解读结果、保存备注、追问历史、收藏状态和应验批注。历史记录在账户存续期间保存，您可以在 App 内删除相关记录。',
              '游客模式下产生的记录主要保存在本机，不会同步到云端；卸载应用、更换设备或清理本地数据可能导致本地记录丢失。',
            ],
          },
          {
            title: '1.5 设备信息和日志信息',
            paragraphs: [
              '为保障服务安全、改善体验和诊断故障，我们可能收集设备型号、操作系统版本、屏幕信息、设备语言、网络类型、IP 地址、应用版本号、接口请求日志、错误日志、性能数据和崩溃信息。',
              '日志信息主要用于安全审计、故障排查、接口稳定性分析和反滥用，不会用于与服务无关的广告追踪。',
            ],
          },
          // {
          //   title: '1.6 支付信息',
          //   paragraphs: [
          //     '当前版本暂不展示付费服务相关隐私条款。若未来上线会员、虚拟权益、订阅或应用内购买，我们会在功能上线前补充订单信息、支付渠道、退款处理和法定保存期限等说明。',
          //   ],
          // },
          {
            title: '1.7 客服与反馈信息',
            paragraphs: [
              '当您通过 App 内反馈或官网反馈与我们联系时，我们会收集您主动提供的反馈类型、问题描述、联系方式、反馈截图、设备环境和提交时间，用于定位问题、回复咨询和改进产品。',
            ],
          },
          // {
          //   title: '1.8 推送通知令牌',
          //   paragraphs: [
          //     '当前版本暂不展示推送令牌相关条款。若未来接入 APNs、FCM、厂商推送或其他通知服务，我们会在上线前补充 Push Token、设备标识、通知用途和关闭方式等说明。',
          //   ],
          // },
          // {
          //   title: '1.9 个性化服务说明',
          //   paragraphs: [
          //     '当前版本暂不展示基于用户画像或推荐算法的个性化服务条款。若未来调整个性化服务范围、数据类型或算法机制，我们会通过 App 内显著提示或重新征得您的同意。',
          //   ],
          // },
        ],
      },
      {
        title: '二、我们申请的设备权限说明',
        paragraphs: [
          '为提供头像、反馈截图、本地记录、网络访问和基础运行能力，我们可能申请部分系统权限。我们仅在您主动触发相关功能或系统运行需要时使用权限，您可以拒绝授权或在系统设置中关闭已授权权限。以下清单依据当前 wenshi-app 配置、原生清单和代码使用情况整理。',
        ],
        children: [
          {
            title: '2.1 Android 权限清单',
            table: {
              headers: ['权限名称', '权限标识', '使用目的', '触发场景', '是否可关闭'],
              rows: [
                ['访问网络', 'android.permission.INTERNET', '连接服务器、登录、同步记录、上传头像或反馈截图、请求 AI 解读', '应用启动及使用时', '否，基础功能必需'],
                ['读取外部存储', 'android.permission.READ_EXTERNAL_STORAGE', '从相册选择头像或反馈截图', '用户主动选择图片时', '是，可在系统设置关闭'],
                ['写入外部存储', 'android.permission.WRITE_EXTERNAL_STORAGE', '图片选择/保存能力的兼容配置；当前核心功能不依赖主动写入外部存储', '兼容旧 Android 版本或相关模块初始化时', '是，可在系统设置关闭'],
                ['录音权限', 'android.permission.RECORD_AUDIO', '当前原生清单中存在，可能来源于 Expo/React Native 预构建默认配置；问事当前不提供录音功能，也不会主动采集音频', '当前业务不主动触发', '是，可在系统设置关闭'],
                ['悬浮窗权限', 'android.permission.SYSTEM_ALERT_WINDOW', '开发调试覆盖层；正式服务功能不依赖该权限', '调试构建或开发环境', '是，可在系统设置关闭'],
                ['震动权限', 'android.permission.VIBRATE', '轻触反馈、操作确认等触感反馈', '用户操作触发反馈时', '通常可随系统触感设置关闭'],
              ],
            },
          },
          {
            title: '2.2 iOS 权限清单',
            table: {
              headers: ['权限名称', '权限标识', '使用目的', '触发场景', '是否可关闭'],
              rows: [
                ['相机权限', 'NSCameraUsageDescription', '拍摄并设置个人头像', '用户主动点击拍摄头像时', '是，可在 iOS 设置中关闭'],
                ['照片库权限', 'NSPhotoLibraryUsageDescription', '选择头像图片或上传反馈截图', '用户主动选择图片时', '是，可在 iOS 设置中关闭'],
                ['保存到相册权限', 'NSPhotoLibraryAddUsageDescription', '保存图片到系统相册', '用户主动保存图片时', '是，可在 iOS 设置中关闭'],
                ['麦克风权限', 'NSMicrophoneUsageDescription', '当前原生配置中存在，可能来源于 Expo/React Native 预构建默认配置；问事当前不提供录音功能，也不会主动采集音频', '当前业务不主动触发', '是，可在 iOS 设置中关闭'],
                ['本地网络/HTTP 例外配置', 'NSAppTransportSecurity 例外', '域名审核期间临时连接公网 IP 后端服务；正式域名和 HTTPS 完成后将尽量收敛', '访问临时公网 IP 接口时', '不属于用户权限开关'],
              ],
            },
          },
          {
            title: '2.3 权限关闭方式',
            paragraphs: [
              '您可以在 iOS“设置 → 问事”或 Android 系统“应用信息 → 权限”中管理相机、相册、存储、通知等权限。关闭某项权限后，可能无法使用对应功能，但不影响其他基础功能。',
            ],
          },
        ],
      },
      {
        title: '三、我们如何使用 Cookie 和同类技术',
        paragraphs: [
          '官网可能使用必要的 Cookie、LocalStorage、SessionStorage 或类似技术，用于维持访问状态、记住语言设置、统计访问量、提升加载效率和防止重复提交。App 可能使用 AsyncStorage、SQLite 等本地存储技术保存登录状态、语言偏好、主题设置、游客模式数据和本地记录。',
          '这些技术不用于未经授权的跨站追踪。您可以通过浏览器或系统设置清除相关数据，但清除后可能需要重新登录或重新设置偏好。',
        ],
      },
      {
        title: '四、我们如何共享、转让、公开披露您的个人信息',
        paragraphs: [
          '我们不会出售您的个人信息。我们仅在实现服务功能、履行法定义务或获得您授权的情况下，与第三方共享必要信息，并遵循最小必要原则。',
        ],
        children: [
          {
            title: '4.1 第三方 SDK 清单',
            paragraphs: ['当前版本未集成 Sentry、Firebase Analytics、广告 SDK、第三方行为追踪 SDK 或第三方推送 SDK。若未来新增 SDK，我们会更新本清单并按法律要求告知或征得同意。'],
            table: {
              headers: ['SDK / 组件名称', '提供方', '使用场景', '可能处理的信息', '是否向第三方传输'],
              rows: [
                ['Expo Image Picker', 'Expo / 650 Industries 生态组件', '相册选择、拍摄头像、上传反馈截图', '用户主动选择或拍摄的图片、图片文件名、尺寸、类型等', '不主动传输给 SDK 提供方；图片可能上传至问事服务端'],
                ['Expo SQLite', 'Expo / 650 Industries 生态组件', '本地数据库、离线记录或缓存', '本地记录、缓存数据、应用内部数据', '否，本地处理'],
                ['AsyncStorage', 'React Native 社区组件', '登录状态、语言、主题、游客模式、本地配置', '本地键值数据、偏好设置、令牌缓存', '否，本地处理'],
                ['React Native / Expo 基础运行库', 'Meta / Expo 生态', '应用运行、界面渲染、系统能力调用', '设备环境、运行状态等基础技术信息', '不作为独立业务目的传输个人信息'],
              ],
            },
          },
          {
            title: '4.2 后端服务提供商',
            table: {
              headers: ['服务商 / 基础设施', '使用场景', '共享或处理的信息', '提供方所在地'],
              rows: [
                ['DeepSeek AI 服务', 'AI 解读内容生成', '咨询问题、卦象结构、操作数据、追问上下文、必要提示词；不主动共享手机号、邮箱等直接身份标识', '中国'],
                ['阿里云短信服务', '注册、登录、绑定、安全验证短信验证码', '手机号码、验证码模板参数、发送状态', '中国'],
                ['阿里云邮件推送服务', '邮箱验证码、服务通知邮件', '邮箱地址、验证码内容、邮件模板、发送状态', '中国'],
                ['云服务器、数据库、对象存储、Nginx 等基础设施', '服务托管、账号数据、记录数据、头像、反馈截图、日志和备份', '账号信息、记录内容、上传文件、访问日志、备份数据', '中国'],
              ],
            },
          },
          {
            title: '4.3 法定情形下的信息披露',
            paragraphs: [
              '在与国家安全、公共安全、公共卫生、重大公共利益、犯罪侦查、起诉、审判、判决执行、监管要求或法律法规强制性要求有关的情况下，我们可能依法披露您的个人信息。',
            ],
          },
          {
            title: '4.4 信息转让和公开披露',
            paragraphs: [
              '我们不会将您的个人信息转让给任何第三方，除非事先获得您的明确同意，或因合并、收购、破产清算等原因发生必要转让。发生此类转让时，我们会要求新的个人信息持有方继续受本政策约束，否则将重新征求您的授权同意。',
              '我们仅在获得您明确同意或基于法律、法律程序、诉讼或政府主管部门强制要求时公开披露个人信息。',
            ],
          },
        ],
      },
      // {
      //   title: '五、我们如何跨境传输您的个人信息',
      //   paragraphs: [
      //     '当前版本暂不展示跨境传输章节。若未来接入境外 SDK、推送服务、登录服务、错误监控或其他可能涉及跨境传输的服务，我们会依法补充接收方、传输数据类型、用途、合规保障和您的选择权，并在必要时征得您的单独同意。',
      //   ],
      // },
      {
        title: '五、我们如何存储和保护您的个人信息',
        children: [
          {
            title: '5.1 存储地点',
            paragraphs: ['我们在中华人民共和国境内运营本服务过程中收集和产生的个人信息，主要存储于中华人民共和国境内服务器。'],
          },
          {
            title: '5.2 存储期限',
            paragraphs: [
              '账户信息在账户存续期间保留；账户注销后将在合理期限内删除或匿名化处理，法律法规另有规定的除外。',
              '卦象记录、解读历史、档案资料在账户存续期间保留，您可在 App 内主动删除。',
              '设备和日志信息通常不超过 12 个月；崩溃、错误和安全日志根据排障和审计需要保留，超期后删除或匿名化。',
              '客服与反馈记录通常在问题解决后合理期限内保留，用于复查、纠纷处理和产品改进。',
            ],
          },
          {
            title: '5.3 安全保护措施',
            paragraphs: [
              '我们采用 HTTPS/TLS 传输加密、访问控制、日志审计、备份恢复、最小权限管理和必要的安全监控措施保护您的个人信息。',
              '尽管我们采取了合理措施，但互联网环境并不存在绝对安全。如发生个人信息安全事件，我们将依法启动应急预案，采取补救措施，并按法律要求通知您和监管机构。',
            ],
          },
        ],
      },
      {
        title: '六、您对个人信息享有的权利',
        paragraphs: [
          '根据相关法律法规，您对您的个人信息享有访问、更正、删除、撤回同意、注销账户、获取副本、投诉举报等权利。您可以通过 App 内功能或本政策“如何联系我们”章节所列方式行使权利。',
        ],
        children: [
          {
            title: '6.1 访问和更正',
            paragraphs: ['您可以在 App 内查看和修改个人资料、档案信息、头像、性别、生日等信息。手机号或邮箱的修改、绑定或解绑请通过账号安全或绑定入口操作。'],
          },
          {
            title: '6.2 删除和注销',
            paragraphs: ['您可以删除历史记录、档案资料或反馈图片。您也可以发起账号注销；注销后我们将停止为您提供账号服务，并依法删除或匿名化处理您的个人信息。'],
          },
          {
            title: '6.3 撤回同意',
            paragraphs: ['您可以在系统设置中关闭相机、相册、存储等权限，也可以停止使用对应功能。撤回同意不影响撤回前基于同意已进行的处理活动。'],
          },
          {
            title: '6.4 个人信息副本和投诉举报',
            paragraphs: ['如需导出个人信息副本、投诉或举报，请通过官网反馈页或 App 内反馈入口联系我们。我们通常在 7 个工作日内回复，最长不超过 15 个工作日。'],
          },
        ],
      },
      {
        title: '七、未成年人保护',
        children: [
          {
            title: '7.1 未满 14 周岁儿童',
            paragraphs: ['我们谢绝向不满 14 周岁的儿童提供本服务。若我们发现未事先获得可证实的父母或监护人同意而收集了 14 周岁以下儿童个人信息，我们将尽快删除相关数据。'],
          },
          {
            title: '7.2 已满 14 周岁未满 18 周岁的未成年人',
            paragraphs: ['若您是已满 14 周岁但未满 18 周岁的未成年人，建议您请父母或其他法定监护人共同阅读本政策，并在征得监护人同意后再使用本服务或向我们提供个人信息。'],
          },
          {
            title: '7.3 监护人权利',
            paragraphs: ['监护人可以联系我们，要求查阅、更正、删除被监护未成年人的个人信息，撤回授权或注销账户。我们通常在 7 个工作日内核实并处理，最长不超过 15 个工作日。'],
          },
        ],
      },
      {
        title: '八、本政策的更新',
        paragraphs: [
          '我们可能会根据法律法规、监管要求、业务调整或技术升级修订本政策。对于重大变更，例如扩大个人信息处理目的或范围、新增重要功能、新增 SDK 或第三方服务商等，我们将通过页面提示、App 内显著位置、站内信或其他合理方式通知您，并在必要时重新征求您的同意。',
          '您可以查看本页面顶部的“最后更新”日期了解最新版本。如您不同意更新后的隐私政策，可以停止使用本服务；继续使用即视为接受更新后的政策。',
        ],
      },
      {
        title: '九、如何联系我们',
        paragraphs: [
          '如您对本隐私政策或个人信息处理有任何疑问、意见或建议，或希望行使本政策赋予您的权利，请通过官网反馈页或 App 内反馈入口联系我们。',
          '我们通常在收到您的请求后 7 个工作日内回复，最长不超过 15 个工作日；涉及复杂事项的，我们将向您说明延期理由。若您对我们的回复不满意，您还可以依法向监管部门投诉举报或向有管辖权的人民法院提起诉讼。',
        ],
      },
    ],
    en: [
      {
        title: '1. How we collect and use personal information',
        paragraphs: ['We collect personal information only where necessary to provide the Service and follow the principle of minimum necessity. Different features may involve different types of data.'],
        children: [
          { title: '1.1 Registration and login', paragraphs: ['We may collect phone number, email address, verification result, login time, login state, and account identifiers for verification, login, and account security. Third-party sign-in entries are currently not open; if enabled later, we will update this policy first.'] },
          { title: '1.2 AI readings and records', paragraphs: ['When you use casting, analysis, AI reading, saving, and review features, we process questions, hexagram data, analysis results, follow-up context, notes, favorites, verification notes, timestamps, and operation data. Necessary context may be sent to DeepSeek AI to generate reading results, but we do not intentionally send phone numbers or email addresses to the AI provider.'] },
          { title: '1.3 Optional profile data', paragraphs: ['You may choose to provide nickname, gender, birth date, avatar, and profile names for record display and review. Avatar images are uploaded only when you choose or take a photo.'] },
          { title: '1.4 History records', paragraphs: ['We save questions, hexagrams, AI results, notes, favorites, and outcome notes so you can review them. Guest-mode data is mainly stored locally and may be lost if the app is deleted or local data is cleared.'] },
          { title: '1.5 Device and log information', paragraphs: ['For security, troubleshooting, and experience improvement, we may process device model, operating system, screen information, language, network type, IP address, app version, request logs, error logs, performance data, and crash information.'] },
          // { title: '1.6 Payment information', paragraphs: ['Payment-related privacy terms are currently hidden until paid features are launched.'] },
          { title: '1.7 Support and feedback', paragraphs: ['When you contact us, we collect feedback type, description, contact details, screenshots, device context, and submission time to troubleshoot and improve the product.'] },
          // { title: '1.8 Push tokens', paragraphs: ['Push token terms are currently hidden until push services are integrated.'] },
          // { title: '1.9 Personalization', paragraphs: ['Personalized service terms are currently hidden until such features are introduced.'] },
        ],
      },
      {
        title: '2. Device permissions',
        paragraphs: ['We request permissions only when necessary for features or system operation. You can deny or disable permissions in system settings. The following list is based on the current Wenshi app configuration and native manifests.'],
        children: [
          { title: '2.1 Android permissions', paragraphs: ['Internet: server connection, login, sync, uploads, and AI requests. Read external storage: select avatars or feedback screenshots. Write external storage: present in the native manifest for compatibility; core features do not actively rely on writing external storage. Record audio: present in the native manifest from prebuild defaults; Wenshi currently has no recording feature and does not actively collect audio. System alert window: development/debug overlay only. Vibrate: haptic feedback.'] },
          { title: '2.2 iOS permissions', paragraphs: ['Camera: take an avatar photo. Photo library: choose avatars or feedback screenshots. Add to photo library: save images to the album. Microphone: present in the native configuration from prebuild defaults; Wenshi currently has no recording feature and does not actively collect audio.'] },
        ],
      },
      { title: '3. Cookies and similar technologies', paragraphs: ['The website may use cookies and local storage for language settings, visit counting, loading, and duplicate-submission prevention. The app may use AsyncStorage and SQLite for login state, language, theme, guest data, and local records.'] },
      {
        title: '4. Sharing, transfer, and disclosure',
        paragraphs: ['We do not sell personal information. We share data only where necessary for service features, legal obligations, or with your authorization.'],
        children: [
          { title: '4.1 Third-party SDKs', paragraphs: ['Current client libraries include Expo Image Picker, Expo SQLite, AsyncStorage, and React Native/Expo runtime libraries. They are used for local capabilities such as image selection, local database, local key-value storage, and app runtime. Current version does not integrate Sentry, Firebase Analytics, advertising SDKs, behavior-tracking SDKs, or third-party push SDKs.'] },
          { title: '4.2 Backend providers', paragraphs: ['DeepSeek AI: AI reading generation using questions, hexagram structure, operation data, and prompt context. Aliyun SMS: phone verification codes. Aliyun Direct Mail: email verification codes and service notices. Cloud servers, databases, object storage, and Nginx infrastructure: hosting, account data, records, uploads, logs, and backups.'] },
          { title: '4.3 Legal disclosure', paragraphs: ['We may disclose information where required by law, regulation, legal process, public safety, criminal investigation, or competent authority requirements.'] },
        ],
      },
      // { title: '5. Cross-border transfer', paragraphs: ['Cross-border transfer terms are currently hidden. If cross-border providers are introduced later, we will update this section and obtain separate consent where required.'] },
      { title: '5. Storage and protection', children: [{ title: '5.1 Location', paragraphs: ['Personal information collected and generated in mainland China is primarily stored on servers in mainland China.'] }, { title: '5.2 Retention', paragraphs: ['Account data is retained during account existence; records and profiles may be deleted by you; logs are retained only as needed for troubleshooting, security, and audit, then deleted or anonymized.'] }, { title: '5.3 Safeguards', paragraphs: ['We use HTTPS/TLS, access control, audit logs, backups, least privilege, and security monitoring. If a personal information incident occurs, we will respond and notify as required by law.'] }] },
      { title: '6. Your rights', paragraphs: ['You have rights to access, correct, delete, withdraw consent, close account, obtain copies, and complain. You may exercise these through in-app functions, website feedback, or in-app feedback.'], children: [{ title: '6.1 Access and correction', paragraphs: ['You can view and edit profile and account information in the app.'] }, { title: '6.2 Deletion and account closure', paragraphs: ['You can delete records and request account closure.'] }, { title: '6.3 Withdrawal', paragraphs: ['You can disable camera, photo, storage, and other permissions in system settings.'] }, { title: '6.4 Copy and complaints', paragraphs: ['Contact us through feedback channels for data export or complaints. We usually respond within 7 business days, and no later than 15 business days.'] }] },
      { title: '7. Minors', children: [{ title: '7.1 Children under 14', paragraphs: ['We do not provide the Service to children under 14. If we discover such data without verifiable guardian consent, we will delete it promptly.'] }, { title: '7.2 Users aged 14 to under 18', paragraphs: ['Teen users should read this policy with a guardian before using the Service or providing personal information.'] }, { title: '7.3 Guardian rights', paragraphs: ['Guardians may request access, correction, deletion, withdrawal of consent, or account closure for a minor.'] }] },
      { title: '8. Updates', paragraphs: ['We may update this policy due to legal, regulatory, business, or technical changes. For material changes, we will notify you through reasonable means and obtain consent where required.'] },
      { title: '9. Contact us', paragraphs: ['If you have questions or wish to exercise your rights, contact us through the website feedback page or in-app feedback entry. We usually respond within 7 business days, and no later than 15 business days.'] },
    ],
  },
} satisfies {
  updatedAt: Record<Language, string>;
  intro: Record<Language, string>;
  sections: Record<Language, PolicySection[]>;
};

const legal = {
  terms: {
    zh: ['服务条款', '问事提供记录、分析与复盘工具，不构成法律、医疗、金融或其他专业建议。用户应对自己的提问、记录、判断和行为负责。请勿提交违法、侵权或伤害他人的内容。'],
    en: ['Terms of Service', 'Wenshi provides journaling, analysis, and review tools. It is not legal, medical, financial, or other professional advice. Users are responsible for their questions, records, judgments, and actions. Do not submit unlawful, infringing, or harmful content.'],
  },
  'account-deletion': {
    zh: ['账号删除', '你可以在应用的用户中心发起注销账号。注销不会立即物理删除全部数据库记录，而会先标记账号不可用，并按安全、审计和法定义务处理保留数据。'],
    en: ['Account Deletion', 'You can request account deletion from the user center in the app. Deletion first disables the account rather than immediately physically removing every database record; retained data is handled according to safety, audit, and legal requirements.'],
  },
} satisfies Record<Exclude<Page, 'home' | 'privacy'>, Record<Language, [string, string]>>;

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
            <a href="#flow" className="button primary">{t.primaryCta}</a>
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
  if (page === 'privacy') {
    const policy = privacyPolicy;
    return (
      <main>
        <nav className="top-nav">
          <button className="logo" onClick={onHome}><span>问</span>{copy[language].brand}</button>
          <button className="lang" onClick={onLanguage}>{language === 'zh' ? 'EN' : '中文'}</button>
        </nav>
        <LegalDocument
          title={language === 'en' ? 'Privacy Policy' : '隐私政策'}
          updatedAt={policy.updatedAt[language]}
          intro={policy.intro[language]}
          sections={policy.sections[language]}
          language={language}
          onHome={onHome}
        />
      </main>
    );
  }
  if (page === 'terms') {
    const policy = termsPolicy;
    return (
      <main>
        <nav className="top-nav">
          <button className="logo" onClick={onHome}><span>问</span>{copy[language].brand}</button>
          <button className="lang" onClick={onLanguage}>{language === 'zh' ? 'EN' : '中文'}</button>
        </nav>
        <LegalDocument
          title={language === 'en' ? 'Terms of Service' : '服务条款'}
          updatedAt={policy.updatedAt[language]}
          intro={policy.intro[language]}
          sections={policy.sections[language]}
          language={language}
          onHome={onHome}
        />
      </main>
    );
  }
  const [title, body] = legal[page][language];
  const paragraphs = body.split('\n\n').filter(Boolean);
  return (
    <main>
      <nav className="top-nav">
        <button className="logo" onClick={onHome}><span>问</span>{copy[language].brand}</button>
        <button className="lang" onClick={onLanguage}>{language === 'zh' ? 'EN' : '中文'}</button>
      </nav>
      <section className="legal-page">
        <span>LEGAL</span>
        <h1>{title}</h1>
        {paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        <button className="button ghost" onClick={onHome}>{copy[language].backHome}</button>
      </section>
    </main>
  );
}

function LegalDocument({ title, updatedAt, intro, sections, language, onHome }: { title: string; updatedAt: string; intro: string; sections: PolicySection[]; language: Language; onHome: () => void }) {
  return (
    <section className="legal-page legal-policy">
      <div className="legal-hero">
        <span>{language === 'en' ? 'COMPLIANCE DOCUMENT' : '合规文件'}</span>
        <h1>{title}</h1>
        <p>{intro}</p>
        <div className="legal-meta">
          <i>{language === 'en' ? 'Effective document' : '正式生效文件'}</i>
          <i>{language === 'en' ? `Last updated: ${updatedAt}` : `最后更新：${updatedAt}`}</i>
          <i>{language === 'en' ? 'Wenshi service' : '问事服务'}</i>
        </div>
      </div>
      <div className="legal-document">
        <div className="legal-body">
          <PolicySectionList sections={sections} />
          <button className="button ghost" onClick={onHome}>{copy[language].backHome}</button>
        </div>
      </div>
    </section>
  );
}

function PolicySectionList({ sections, level = 0 }: { sections: PolicySection[]; level?: number }) {
  return (
    <>
      {sections.map((section) => (
        <section key={section.title} id={level === 0 ? toPolicyAnchor(section.title) : undefined} className={`policy-section policy-level-${level}`}>
          <h2>{section.title}</h2>
          {section.paragraphs?.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          {section.table ? <PolicyTable table={section.table} /> : null}
          {section.children?.length ? <PolicySectionList sections={section.children} level={level + 1} /> : null}
        </section>
      ))}
    </>
  );
}

function PolicyTable({ table }: { table: NonNullable<PolicySection['table']> }) {
  return (
    <div className="policy-table-wrap">
      <table className="policy-table">
        <thead>
          <tr>{table.headers.map((header) => <th key={header}>{header}</th>)}</tr>
        </thead>
        <tbody>
          {table.rows.map((row) => (
            <tr key={row.join('|')}>
              {row.map((cell, index) => <td key={`${index}-${cell}`}>{cell}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function toPolicyAnchor(title: string) {
  return `policy-${title.replace(/[^\p{L}\p{N}]+/gu, '-').replace(/^-|-$/g, '').toLowerCase()}`;
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
      </div>
      <small>陕ICP备2026011540号-1 · © {year} Wenshi</small>
    </footer>
  );
}

createRoot(document.getElementById('root')!).render(<App />);
