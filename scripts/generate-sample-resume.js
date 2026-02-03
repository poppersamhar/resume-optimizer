const React = require('react');
const { Document, Page, Text, View, StyleSheet, renderToFile } = require('@react-pdf/renderer');

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 11, fontFamily: 'Helvetica' },
  header: { marginBottom: 20 },
  name: { fontSize: 24, fontFamily: 'Helvetica-Bold', marginBottom: 5 },
  contact: { fontSize: 10, color: '#444', marginBottom: 3 },
  section: { marginBottom: 15 },
  sectionTitle: { fontSize: 14, fontFamily: 'Helvetica-Bold', marginBottom: 8, borderBottomWidth: 1, borderBottomColor: '#000', paddingBottom: 3 },
  jobHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 3 },
  jobTitle: { fontFamily: 'Helvetica-Bold', fontSize: 12 },
  company: { fontSize: 11 },
  dates: { fontSize: 10, color: '#666' },
  bullet: { marginLeft: 10, marginBottom: 3 },
  skills: { fontSize: 10 },
});

const SampleResume = () => (
  React.createElement(Document, {},
    React.createElement(Page, { size: 'A4', style: styles.page },
      // Header
      React.createElement(View, { style: styles.header },
        React.createElement(Text, { style: styles.name }, '张三'),
        React.createElement(Text, { style: styles.contact }, 'zhangsan@email.com | 138-0000-0000 | 北京'),
        React.createElement(Text, { style: styles.contact }, 'github.com/zhangsan | linkedin.com/in/zhangsan')
      ),

      // Summary
      React.createElement(View, { style: styles.section },
        React.createElement(Text, { style: styles.sectionTitle }, 'Professional Summary'),
        React.createElement(Text, {}, '5年全栈开发经验，专注于React和Node.js技术栈。曾主导多个大型Web应用开发，具备良好的团队协作能力和项目管理经验。')
      ),

      // Experience
      React.createElement(View, { style: styles.section },
        React.createElement(Text, { style: styles.sectionTitle }, 'Work Experience'),

        React.createElement(View, { style: { marginBottom: 12 } },
          React.createElement(View, { style: styles.jobHeader },
            React.createElement(View, {},
              React.createElement(Text, { style: styles.jobTitle }, 'Senior Frontend Engineer'),
              React.createElement(Text, { style: styles.company }, 'ABC科技有限公司')
            ),
            React.createElement(Text, { style: styles.dates }, '2021 - Present')
          ),
          React.createElement(Text, { style: styles.bullet }, '• 主导公司核心产品前端架构设计，使用React + TypeScript重构遗留系统'),
          React.createElement(Text, { style: styles.bullet }, '• 优化页面性能，首屏加载时间从3s降低到1.2s，提升60%'),
          React.createElement(Text, { style: styles.bullet }, '• 搭建前端CI/CD流程，实现自动化测试和部署'),
          React.createElement(Text, { style: styles.bullet }, '• 带领5人前端团队，进行代码审查和技术分享')
        ),

        React.createElement(View, { style: { marginBottom: 12 } },
          React.createElement(View, { style: styles.jobHeader },
            React.createElement(View, {},
              React.createElement(Text, { style: styles.jobTitle }, 'Full Stack Developer'),
              React.createElement(Text, { style: styles.company }, 'XYZ互联网公司')
            ),
            React.createElement(Text, { style: styles.dates }, '2019 - 2021')
          ),
          React.createElement(Text, { style: styles.bullet }, '• 使用Node.js和Express开发RESTful API，服务日均请求量100万+'),
          React.createElement(Text, { style: styles.bullet }, '• 设计并实现MySQL数据库架构，优化查询性能'),
          React.createElement(Text, { style: styles.bullet }, '• 开发内部管理系统，提升运营效率30%')
        )
      ),

      // Education
      React.createElement(View, { style: styles.section },
        React.createElement(Text, { style: styles.sectionTitle }, 'Education'),
        React.createElement(View, { style: styles.jobHeader },
          React.createElement(View, {},
            React.createElement(Text, { style: styles.jobTitle }, '北京大学'),
            React.createElement(Text, { style: styles.company }, '计算机科学与技术 学士')
          ),
          React.createElement(Text, { style: styles.dates }, '2015 - 2019')
        )
      ),

      // Skills
      React.createElement(View, { style: styles.section },
        React.createElement(Text, { style: styles.sectionTitle }, 'Skills'),
        React.createElement(Text, { style: styles.skills }, 'Frontend: React, Vue, TypeScript, JavaScript, HTML5, CSS3, Tailwind CSS'),
        React.createElement(Text, { style: styles.skills }, 'Backend: Node.js, Express, Python, Java'),
        React.createElement(Text, { style: styles.skills }, 'Database: MySQL, PostgreSQL, MongoDB, Redis'),
        React.createElement(Text, { style: styles.skills }, 'Tools: Git, Docker, AWS, Jenkins, Webpack')
      )
    )
  )
);

renderToFile(React.createElement(SampleResume), './sample-resume.pdf').then(() => {
  console.log('Sample resume generated: sample-resume.pdf');
});
