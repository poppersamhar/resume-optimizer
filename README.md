# Resume Optimizer 简历优化器

AI 驱动的简历分析与优化工具，帮助求职者针对目标职位优化简历。

## 功能特点

- **PDF 简历解析**：支持中英文简历，自动提取结构化信息
- **AI 智能分析**：基于 DeepSeek 大模型进行简历评估
- **A/B/C 评级系统**：
  - A (EXCELLENT): 优秀，问题极少
  - B (GOOD): 良好，有改进空间
  - C (SATISFACTORY): 合格，需要较多改进
- **三级优先级问题分类**：
  - URGENT: 需要立刻修订
  - CRITICAL: 对结果影响较大
  - OPTIONAL: 建议性修订
- **按板块分类问题**：个人信息、简介、教育、技能、工作经历
- **智能分类**：自动区分工作经历与项目经历（内置 200+ 知名公司识别）
- **简历编辑器**：支持模块拖拽排序、内容编辑
- **PDF 导出**：生成优化后的简历 PDF

## 技术栈

- **前端**：Next.js 14, React, TypeScript, Tailwind CSS
- **AI**：DeepSeek API
- **PDF 处理**：pdf-parse, pdftotext, @react-pdf/renderer

## 快速开始

### 1. 克隆项目

```bash
git clone https://github.com/poppersamhar/resume-optimizer.git
cd resume-optimizer
```

### 2. 安装依赖

```bash
npm install
```

### 3. 配置环境变量

创建 `.env.local` 文件：

```env
DEEPSEEK_API_KEY=your_deepseek_api_key
```

### 4. 安装 pdftotext（可选，用于解析特殊 PDF）

```bash
# macOS
brew install poppler

# Ubuntu/Debian
sudo apt-get install poppler-utils
```

### 5. 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3000

## 使用流程

1. **上传简历**：上传 PDF 格式的简历
2. **输入职位描述**：粘贴目标职位的 JD
3. **查看分析结果**：获得 A/B/C 评级和详细问题列表
4. **生成优化简历**：AI 自动优化简历内容
5. **编辑导出**：手动调整后导出 PDF

## 项目结构

```
├── app/
│   ├── api/
│   │   ├── analyze/          # 简历分析 API
│   │   ├── generate-resume/  # 简历生成 API
│   │   └── parse-resume/     # PDF 解析 API
│   ├── page.tsx              # 主页面
│   └── layout.tsx
├── components/
│   ├── ResumeUploader.tsx    # 简历上传组件
│   ├── JDInput.tsx           # JD 输入组件
│   ├── MatchResult.tsx       # 分析结果展示
│   ├── ResumeEditor.tsx      # 简历编辑器
│   └── PDFExport.tsx         # PDF 导出
├── lib/
│   ├── prompts.ts            # AI Prompts
│   ├── rating.ts             # 评级计算逻辑
│   ├── constants.ts          # 配置常量
│   ├── resume-classifier.ts  # 经历分类器
│   └── deepseek.ts           # DeepSeek API 封装
└── types/
    └── index.ts              # TypeScript 类型定义
```

## 评级规则

| 等级 | 评价 | 条件 |
|------|------|------|
| A | EXCELLENT | urgent=0, critical≤2, optional≤2 |
| B | GOOD | urgent≤5, critical≤3 |
| C | SATISFACTORY | 其他情况 |

## License

MIT
