'use client';

import { Document, Page, Text, View, StyleSheet, pdf, Font } from '@react-pdf/renderer';
import { OptimizedResume } from '@/types';

// 注册中文字体
Font.register({
  family: 'NotoSansSC',
  src: '/fonts/NotoSansSC-Regular.ttf',
});

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'NotoSansSC',
    fontSize: 10,
    lineHeight: 1.4,
  },
  header: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    paddingBottom: 10,
  },
  name: {
    fontSize: 24,
    fontFamily: 'NotoSansSC',
    marginBottom: 5,
  },
  contactInfo: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    fontSize: 9,
    color: '#444',
  },
  contactItem: {
    marginRight: 15,
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 12,
    fontFamily: 'NotoSansSC',
    marginBottom: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: '#999',
    paddingBottom: 3,
  },
  summary: {
    fontSize: 10,
    color: '#333',
    lineHeight: 1.5,
  },
  experienceItem: {
    marginBottom: 12,
  },
  experienceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 3,
  },
  jobTitle: {
    fontFamily: 'NotoSansSC',
    fontSize: 11,
  },
  company: {
    fontSize: 10,
    color: '#444',
  },
  dates: {
    fontSize: 9,
    color: '#666',
  },
  bulletList: {
    marginLeft: 10,
  },
  bulletItem: {
    flexDirection: 'row',
    marginBottom: 3,
  },
  bullet: {
    width: 10,
  },
  bulletText: {
    flex: 1,
    fontSize: 9,
  },
  educationItem: {
    marginBottom: 8,
  },
  schoolName: {
    fontFamily: 'NotoSansSC',
    fontSize: 10,
  },
  degree: {
    fontSize: 9,
    color: '#444',
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 5,
  },
  skill: {
    fontSize: 9,
    backgroundColor: '#f0f0f0',
    padding: '3 8',
    borderRadius: 3,
  },
});

interface ResumePDFProps {
  resume: OptimizedResume;
}

function ResumePDF({ resume }: ResumePDFProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.name}>{resume.name}</Text>
          <View style={styles.contactInfo}>
            {resume.email && <Text style={styles.contactItem}>{resume.email}</Text>}
            {resume.phone && <Text style={styles.contactItem}>{resume.phone}</Text>}
            {resume.location && <Text style={styles.contactItem}>{resume.location}</Text>}
            {resume.linkedin && <Text style={styles.contactItem}>{resume.linkedin}</Text>}
            {resume.github && <Text style={styles.contactItem}>{resume.github}</Text>}
          </View>
        </View>

        {/* Summary */}
        {resume.optimizedSummary && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>专业概述</Text>
            <Text style={styles.summary}>{resume.optimizedSummary}</Text>
          </View>
        )}

        {/* Experience */}
        {resume.optimizedExperience.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>工作经历</Text>
            {resume.optimizedExperience.map((exp, i) => (
              <View key={i} style={styles.experienceItem}>
                <View style={styles.experienceHeader}>
                  <View>
                    <Text style={styles.jobTitle}>{exp.title}</Text>
                    <Text style={styles.company}>{exp.company}{exp.location ? ` - ${exp.location}` : ''}</Text>
                  </View>
                  <Text style={styles.dates}>{exp.startDate} - {exp.endDate}</Text>
                </View>
                <View style={styles.bulletList}>
                  {exp.highlights.map((highlight, j) => (
                    <View key={j} style={styles.bulletItem}>
                      <Text style={styles.bullet}>•</Text>
                      <Text style={styles.bulletText}>{highlight}</Text>
                    </View>
                  ))}
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Education */}
        {resume.education.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>教育背景</Text>
            {resume.education.map((edu, i) => (
              <View key={i} style={styles.educationItem}>
                <View style={styles.experienceHeader}>
                  <View>
                    <Text style={styles.schoolName}>{edu.school}</Text>
                    <Text style={styles.degree}>{edu.degree} - {edu.field}{edu.gpa ? ` | GPA: ${edu.gpa}` : ''}</Text>
                  </View>
                  <Text style={styles.dates}>{edu.startDate} - {edu.endDate}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Skills */}
        {resume.skills.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>技能</Text>
            <Text style={styles.summary}>{resume.skills.join(' • ')}</Text>
          </View>
        )}
      </Page>
    </Document>
  );
}

interface PDFExportProps {
  resume: OptimizedResume;
}

export default function PDFExport({ resume }: PDFExportProps) {
  const handleExport = async () => {
    const blob = await pdf(<ResumePDF resume={resume} />).toBlob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${resume.name.replace(/\s+/g, '_')}_Resume.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <button
      onClick={handleExport}
      className="px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
    >
      Download PDF
    </button>
  );
}

export { ResumePDF };
export async function generatePDFBlob(resume: OptimizedResume): Promise<Blob> {
  return await pdf(<ResumePDF resume={resume} />).toBlob();
}
