import { ParsedResume, WorkExperience, Project } from '@/types';

// 知名公司列表
const KNOWN_COMPANIES = [
  // 中国科技大厂
  '百度', '阿里巴巴', '阿里', '腾讯', '字节跳动', '字节', '美团', '京东', '滴滴', '快手',
  '小红书', 'B站', '哔哩哔哩', '网易', '华为', '小米', 'OPPO', 'vivo', '大疆', '商汤',
  '旷视', '依图', '云从', '科大讯飞', '蚂蚁集团', '蚂蚁金服', '拼多多', '携程', '饿了么',
  '微信', '抖音', '今日头条', '知乎', '微博', '58同城', '贝壳', '链家', '猿辅导', '作业帮',
  '得物', 'SHEIN', '米哈游', '莉莉丝', '叠纸', '鹰角', '完美世界', '网龙', '三七互娱',
  '盛趣游戏', '巨人网络', '游族', '心动', 'bilibili', '爱奇艺', '优酷', '芒果TV',
  '虎牙', '斗鱼', '映客', '陌陌', '探探', 'Soul', '货拉拉', '满帮', '菜鸟', '顺丰',
  '中通', '圆通', '韵达', '申通', '极兔', '闪送', '达达', '点我达', '蜂鸟', '美菜',
  '叮咚买菜', '每日优鲜', '盒马', '永辉', '物美', '大润发', '沃尔玛', '家乐福',
  '马上消费', '马上金融', '度小满', '京东金融', '微众银行', '网商银行', '众安保险',
  '平安科技', '招银网络', '兴业数金', '建信金科', '工银科技', '中银金科',
  // 国际科技公司
  'Google', 'Microsoft', 'Amazon', 'Apple', 'Meta', 'Facebook', 'Netflix', 'Tesla',
  'OpenAI', 'Nvidia', 'Intel', 'AMD', 'IBM', 'Oracle', 'Salesforce', 'Adobe', 'SAP',
  'Uber', 'Lyft', 'Airbnb', 'LinkedIn', 'Twitter', 'X', 'Snap', 'Snapchat', 'Pinterest',
  'Stripe', 'Square', 'Block', 'PayPal', 'Shopify', 'Spotify', 'Zoom', 'Slack', 'Dropbox',
  'ByteDance', 'TikTok', 'Grab', 'Gojek', 'Sea', 'Shopee', 'Lazada',
  'Samsung', 'Sony', 'LG', 'Panasonic', 'Toshiba', 'Hitachi', 'NEC', 'Fujitsu',
  'Cisco', 'Dell', 'HP', 'Lenovo', 'ASUS', 'Acer', 'MSI',
  'Qualcomm', 'Broadcom', 'Texas Instruments', 'Micron', 'Western Digital', 'Seagate',
  'VMware', 'ServiceNow', 'Workday', 'Splunk', 'Datadog', 'Snowflake', 'Databricks',
  'Palantir', 'Confluent', 'HashiCorp', 'MongoDB', 'Elastic', 'Redis', 'Cockroach',
  'Figma', 'Canva', 'Notion', 'Airtable', 'Asana', 'Monday', 'Trello', 'Jira',
  'GitHub', 'GitLab', 'Atlassian', 'JetBrains', 'Docker', 'Kubernetes',
  'AWS', 'Azure', 'GCP', 'Alibaba Cloud', '阿里云', '腾讯云', '华为云', '百度云',
  // 金融公司
  '高盛', '摩根士丹利', '摩根大通', '花旗', '汇丰', '渣打', '德意志银行', '瑞银', '瑞信',
  '中金', '中信', '中信证券', '华泰', '国泰君安', '海通', '广发', '招商证券', '申万宏源',
  '招商银行', '平安银行', '浦发银行', '民生银行', '光大银行', '中信银行', '兴业银行',
  '工商银行', '建设银行', '农业银行', '中国银行', '交通银行', '邮储银行',
  'Goldman Sachs', 'Morgan Stanley', 'JPMorgan', 'JP Morgan', 'Citibank', 'Citi',
  'Bank of America', 'Wells Fargo', 'HSBC', 'Barclays', 'Deutsche Bank', 'UBS', 'Credit Suisse',
  'Citadel', 'Two Sigma', 'Jane Street', 'DE Shaw', 'D.E. Shaw', 'Renaissance', 'Bridgewater',
  'Point72', 'Millennium', 'AQR', 'Man Group', 'Winton', 'WorldQuant',
  'BlackRock', 'Vanguard', 'Fidelity', 'State Street', 'PIMCO', 'KKR', 'Blackstone',
  'Carlyle', 'Apollo', 'TPG', 'Warburg Pincus', 'General Atlantic', 'Sequoia', 'a]6z',
  'Andreessen Horowitz', 'Benchmark', 'Greylock', 'Accel', 'Lightspeed', 'GGV', '红杉',
  '高瓴', '腾讯投资', '阿里投资', '经纬', '源码', '今日资本', 'IDG', '晨兴', '启明',
  // 咨询公司
  '麦肯锡', '波士顿咨询', 'BCG', '贝恩', 'Bain', '埃森哲', 'Accenture',
  'McKinsey', 'Boston Consulting', 'Deloitte', '德勤', 'PwC', '普华永道',
  'EY', '安永', 'KPMG', '毕马威', 'Oliver Wyman', 'Roland Berger', 'LEK', 'ATKearney',
  // 其他知名公司
  '宝洁', 'P&G', '联合利华', 'Unilever', '欧莱雅', "L'Oreal", '雀巢', 'Nestle',
  '可口可乐', 'Coca-Cola', '百事', 'PepsiCo', '星巴克', 'Starbucks', '麦当劳', "McDonald's",
  '耐克', 'Nike', '阿迪达斯', 'Adidas', '优衣库', 'Uniqlo', 'ZARA', 'H&M',
  '特斯拉', '蔚来', 'NIO', '小鹏', 'XPeng', '理想', 'Li Auto', '比亚迪', 'BYD',
  '宁德时代', 'CATL', '大众', 'Volkswagen', '丰田', 'Toyota', '本田', 'Honda',
  '宝马', 'BMW', '奔驰', 'Mercedes', 'Benz', '奥迪', 'Audi',
];

// 工作相关的职位关键词
const JOB_TITLE_KEYWORDS = [
  // 中文职位
  '实习生', '实习', '工程师', '开发', '产品经理', '产品', '运营', '分析师', '设计师',
  '架构师', '总监', '经理', '主管', '专员', '助理', '顾问', '研究员', '科学家',
  '算法', '前端', '后端', '全栈', '测试', 'QA', '运维', 'DevOps', 'SRE',
  '数据', 'AI', '人工智能', '机器学习', 'ML', '深度学习', 'NLP', 'CV',
  '合伙人', '创始人', '联合创始人', 'CEO', 'CTO', 'CFO', 'COO', 'VP',
  // 英文职位
  'intern', 'engineer', 'developer', 'manager', 'analyst', 'designer', 'architect',
  'director', 'lead', 'senior', 'junior', 'associate', 'consultant', 'researcher',
  'scientist', 'specialist', 'coordinator', 'administrator', 'executive',
  'founder', 'co-founder', 'partner', 'head', 'chief', 'officer', 'president',
];

// 项目相关的关键词
const PROJECT_KEYWORDS = [
  '个人项目', '开源项目', '课程项目', '毕业设计', '毕设', '学术项目', '研究项目',
  '竞赛项目', '黑客松', 'hackathon', 'side project', 'personal project',
  'open source', 'academic project', 'course project', 'capstone',
];

// 检查是否包含知名公司名称
function containsKnownCompany(text: string): boolean {
  const lowerText = text.toLowerCase();
  return KNOWN_COMPANIES.some(company =>
    lowerText.includes(company.toLowerCase())
  );
}

// 检查是否包含职位关键词
function containsJobTitle(text: string): boolean {
  const lowerText = text.toLowerCase();
  return JOB_TITLE_KEYWORDS.some(keyword =>
    lowerText.includes(keyword.toLowerCase())
  );
}

// 检查是否像项目
function looksLikeProject(text: string): boolean {
  const lowerText = text.toLowerCase();
  return PROJECT_KEYWORDS.some(keyword =>
    lowerText.includes(keyword.toLowerCase())
  );
}

// 检查是否有公司特征（有公司名+职位）
function hasCompanyCharacteristics(item: WorkExperience | Project): boolean {
  if ('company' in item && item.company) {
    // 有公司字段
    const companyName = item.company;
    const title = 'title' in item ? item.title : '';

    // 检查是否是知名公司
    if (containsKnownCompany(companyName)) {
      return true;
    }

    // 检查是否有职位
    if (title && containsJobTitle(title)) {
      return true;
    }

    // 公司名看起来像真实公司（包含常见后缀）
    const companyPatterns = [
      /公司$/, /集团$/, /科技$/, /网络$/, /信息$/, /软件$/, /互联网$/,
      /有限$/, /股份$/, /控股$/, /投资$/, /咨询$/, /服务$/,
      /Inc\.?$/i, /Corp\.?$/i, /LLC$/i, /Ltd\.?$/i, /Co\.?$/i,
      /Technologies$/i, /Solutions$/i, /Systems$/i, /Labs?$/i,
    ];

    if (companyPatterns.some(pattern => pattern.test(companyName))) {
      return true;
    }
  }

  return false;
}

// 将项目转换为工作经历
function projectToExperience(project: Project): WorkExperience {
  return {
    company: project.name,
    title: '项目负责人',
    startDate: '',
    endDate: '',
    highlights: [
      project.description,
      ...project.highlights,
    ].filter(Boolean),
  };
}

// 将工作经历转换为项目
function experienceToProject(exp: WorkExperience): Project {
  return {
    name: exp.company || exp.title,
    description: exp.highlights[0] || '',
    technologies: [],
    highlights: exp.highlights.slice(1),
  };
}

// 主要的分类函数
export function classifyExperienceAndProjects(resume: ParsedResume): ParsedResume {
  const experience: WorkExperience[] = [];
  const projects: Project[] = [];

  // 处理原有的 experience
  for (const exp of resume.experience || []) {
    const combinedText = `${exp.company} ${exp.title} ${exp.highlights.join(' ')}`;

    // 如果看起来像项目而不是工作
    if (looksLikeProject(combinedText) && !containsKnownCompany(exp.company || '')) {
      projects.push(experienceToProject(exp));
    } else {
      experience.push(exp);
    }
  }

  // 处理原有的 projects
  for (const proj of resume.projects || []) {
    const combinedText = `${proj.name} ${proj.description} ${proj.highlights.join(' ')}`;

    // 如果项目名称是知名公司，或者有明显的公司特征
    if (containsKnownCompany(proj.name) || containsKnownCompany(proj.description)) {
      // 这可能是被错误分类的工作经历
      experience.push(projectToExperience(proj));
    } else {
      projects.push(proj);
    }
  }

  // 按时间排序工作经历（如果有日期的话）
  experience.sort((a, b) => {
    const dateA = a.startDate || '';
    const dateB = b.startDate || '';
    return dateB.localeCompare(dateA); // 降序，最近的在前
  });

  return {
    ...resume,
    experience,
    projects,
  };
}

// 导出公司列表供其他地方使用
export { KNOWN_COMPANIES, JOB_TITLE_KEYWORDS };
