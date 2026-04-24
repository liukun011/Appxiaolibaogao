import {
  InterviewChecklistQuestion,
  InterviewChecklistSection,
  InterviewInsightItem,
  UploadedAsset
} from '../types';

interface InterviewInsightPayload {
  companyInsightItems: InterviewInsightItem[];
  questionChecklistSections: InterviewChecklistSection[];
}

export interface PresetChecklistTemplate {
  id: string;
  title: string;
  desc: string;
  questionCount: number;
}

const templatePresetQuestions: Record<string, { title: string; questions: string[] }[]> = {
  general: [
    {
      title: '基础经营核验',
      questions: [
        '请先介绍企业目前的主营业务、核心产品和主要客户类型。',
        '最近一年企业经营中最需要重点关注的风险点是什么？',
        '当前收入、利润和现金流的变化趋势分别如何？'
      ]
    },
    {
      title: '管理与合规',
      questions: [
        '企业治理结构、核心管理层分工和决策机制是怎样的？',
        '是否存在诉讼、处罚、税务异常或重大合同纠纷等事项？'
      ]
    }
  ],
  loan: [
    {
      title: '授信核心问题',
      questions: [
        '本次融资或授信的主要用途、金额和期限安排是什么？',
        '当前主要还款来源、现金流覆盖情况和偿债计划如何？',
        '现有借款、担保、抵押或表外负债情况如何？'
      ]
    },
    {
      title: '风险核验',
      questions: [
        '是否存在逾期、诉讼、执行、股权质押或资产受限事项？',
        '上下游客户集中度、回款稳定性和经营波动因素有哪些？'
      ]
    }
  ],
  equity: [
    {
      title: '股权与治理',
      questions: [
        '当前股东结构、实控人安排以及董事会治理机制如何？',
        '近两年是否发生过股权变更、增资或对赌条款调整？',
        '是否存在代持、一致行动或员工持股等特殊安排？'
      ]
    },
    {
      title: '投资价值',
      questions: [
        '核心业务增长逻辑、市场竞争优势和未来规划是什么？',
        '是否存在参股投资、关联交易或历史合规风险需要重点核验？'
      ]
    }
  ]
};

export const presetChecklistTemplates: PresetChecklistTemplate[] = [
  { id: 'general', title: '通用访谈模板', desc: '适合标准企业尽调场景', questionCount: 12 },
  { id: 'loan', title: '授信尽调模板', desc: '关注现金流、抵押与司法风险', questionCount: 16 },
  { id: 'equity', title: '股权投资模板', desc: '关注股权结构、投资人与治理', questionCount: 14 }
];

const buildQuestion = (id: string, text: string): InterviewChecklistQuestion => ({
  id,
  text,
  selected: false
});

const buildPresetQuestion = (id: string, text: string): InterviewChecklistQuestion => ({
  id,
  text,
  selected: true
});

export const buildTemplatePresetSections = (templateId: string, templateTitle: string): InterviewChecklistSection[] =>
  (templatePresetQuestions[templateId] ?? []).map((section, index) => ({
    id: `preset-${templateId}-${index + 1}`,
    title: section.title,
    source: templateTitle,
    summary: `${templateTitle} 已预置基础访谈问题。`,
    questions: section.questions.map((question, questionIndex) =>
      buildPresetQuestion(`preset-${templateId}-${index + 1}-${questionIndex + 1}`, question)
    )
  }));

export const mergeChecklistSections = (
  baseSections: InterviewChecklistSection[],
  nextSections: InterviewChecklistSection[]
): InterviewChecklistSection[] => {
  const sectionMap = new Map<string, InterviewChecklistSection>();

  baseSections.forEach((section) => {
    sectionMap.set(section.id, {
      ...section,
      questions: [...section.questions]
    });
  });

  nextSections.forEach((section) => {
    const existing = sectionMap.get(section.id);
    if (!existing) {
      sectionMap.set(section.id, section);
      return;
    }

    const questionMap = new Map(existing.questions.map((question) => [question.id, question]));
    section.questions.forEach((question) => {
      if (!questionMap.has(question.id)) {
        questionMap.set(question.id, question);
      }
    });

    sectionMap.set(section.id, {
      ...existing,
      summary: section.summary,
      source: section.source,
      questions: Array.from(questionMap.values())
    });
  });

  return Array.from(sectionMap.values());
};

export const replacePresetChecklistSections = (
  existingSections: InterviewChecklistSection[],
  templateId: string,
  templateTitle: string
): InterviewChecklistSection[] => {
  const presetSections = buildTemplatePresetSections(templateId, templateTitle);
  const nonPresetSections = existingSections.filter((section) => !section.id.startsWith('preset-'));

  return [...presetSections, ...nonPresetSections];
};

export const buildCompanyInsightItems = (
  companyName: string,
  companyCode: string,
  uploadedAssets: UploadedAsset[] = []
): InterviewInsightItem[] => {
  const normalizedName = companyName.trim() || '目标企业';
  const normalizedCode = companyCode.trim();
  const hasMaterials = uploadedAssets.length > 0;

  return [
    {
      id: 'company-name',
      label: '企业名称',
      value: normalizedName
    },
    {
      id: 'company-code',
      label: '统一代码',
      value: normalizedCode || '待补充'
    },
    {
      id: 'company-status',
      label: '企查查状态',
      value: normalizedCode ? '存续（模拟同步）' : '待同步',
      tone: normalizedCode ? 'positive' : 'neutral'
    },
    {
      id: 'shareholder-change',
      label: '股权变更',
      value: normalizedCode ? '近24个月 2 次' : '待洞察',
      tone: normalizedCode ? 'attention' : 'neutral'
    },
    {
      id: 'litigation',
      label: '司法风险',
      value: normalizedName !== '目标企业' ? '发现诉讼/执行线索 3 条' : '待洞察',
      tone: normalizedName !== '目标企业' ? 'attention' : 'neutral'
    },
    {
      id: 'pledge',
      label: '质押抵押',
      value: normalizedCode ? '股权质押 1 条 / 动产抵押 1 条' : '待同步',
      tone: normalizedCode ? 'attention' : 'neutral'
    },
    {
      id: 'tax-penalty',
      label: '税务处罚',
      value: hasMaterials ? '已结合资料补充核验项' : '暂未发现公开异常',
      tone: hasMaterials ? 'positive' : 'neutral'
    }
  ];
};

export const buildAiChecklistSections = (
  companyName: string,
  companyCode: string,
  uploadedAssets: UploadedAsset[] = []
): InterviewChecklistSection[] => {
  const normalizedName = companyName.trim() || '目标企业';

  return [
    {
      id: 'shareholders',
      title: '股东情况和历史股权变更',
      source: '企查查股权穿透',
      summary: '已提取股东结构、历史股权变更和权益性投资线索。',
      questions: [
        buildQuestion('shareholders-1', `${normalizedName} 近两年是否发生过重要股权变更？变更原因是什么？`),
        buildQuestion('shareholders-2', '当前股东中是否存在投资机构、财务投资人、代持或一致行动安排？'),
        buildQuestion('shareholders-3', '企业是否存在权益性投资或参股其他公司的情况？投资背景、金额与当前状态如何？')
      ]
    },
    {
      id: 'litigation',
      title: '法律诉讼和失信情况',
      source: '企查查司法风险 / 中国执行信息公开网',
      summary: '已识别诉讼、执行、失信和限制高消费线索。',
      questions: [
        buildQuestion('litigation-1', `${normalizedName} 当前是否存在未决诉讼、仲裁、执行或保全案件？`),
        buildQuestion('litigation-2', '如果存在司法风险，上述事项对经营、融资或回款会造成哪些具体影响？'),
        buildQuestion('litigation-3', '企业或法定代表人是否曾被列为失信被执行人、限制高消费对象？')
      ]
    },
    {
      id: 'pledge',
      title: '股权质押和动产抵押情况',
      source: '企查查质押抵押',
      summary: '已同步股权质押、动产抵押和资产受限相关线索。',
      questions: [
        buildQuestion('pledge-1', `${normalizedName} 或主要股东是否存在股权质押？对应融资用途和剩余风险敞口是什么？`),
        buildQuestion('pledge-2', '公司名下是否存在动产抵押、设备抵押、应收账款质押等安排？'),
        buildQuestion('pledge-3', '上述质押或抵押是否对后续融资、资产处置或经营稳定性形成限制？')
      ]
    },
    {
      id: 'penalty',
      title: '行政和税收处罚（含欠税）',
      source: '行政处罚 / 税务公开信息',
      summary: '已提取行政处罚、税务异常与欠税相关核验项。',
      questions: [
        buildQuestion('penalty-1', '最近两年是否存在行政处罚、税务异常、欠税公告或监管整改事项？'),
        buildQuestion('penalty-2', '如存在处罚或欠税，目前是否已经整改完毕，后续是否仍有持续影响？')
      ]
    }
  ];
};

export const buildInterviewInsightPayload = (
  companyName: string,
  companyCode: string,
  uploadedAssets: UploadedAsset[] = []
): InterviewInsightPayload => {
  return {
    companyInsightItems: buildCompanyInsightItems(companyName, companyCode, uploadedAssets),
    questionChecklistSections: buildAiChecklistSections(companyName, companyCode, uploadedAssets)
  };
};
