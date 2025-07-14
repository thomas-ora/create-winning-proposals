import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { ProposalData, PricingTable } from '@/data/types';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { type CurrencyType } from '@/utils/constants';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 30,
    fontFamily: 'Helvetica',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
    paddingBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#7B7FEB',
  },
  logo: {
    width: 120,
    height: 40,
  },
  companyInfo: {
    textAlign: 'right',
  },
  companyName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1E1E1E',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1E1E1E',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 30,
  },
  metaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
    backgroundColor: '#F8F9FA',
    padding: 20,
    borderRadius: 8,
  },
  metaItem: {
    flex: 1,
    alignItems: 'center',
  },
  metaLabel: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 5,
  },
  metaValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E1E1E',
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E1E1E',
    marginBottom: 15,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  paragraph: {
    fontSize: 12,
    lineHeight: 1.6,
    color: '#374151',
    marginBottom: 10,
  },
  listContainer: {
    marginBottom: 10,
  },
  listItem: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  listBullet: {
    width: 8,
    height: 8,
    backgroundColor: '#7B7FEB',
    borderRadius: 4,
    marginRight: 12,
    marginTop: 4,
  },
  listText: {
    fontSize: 12,
    lineHeight: 1.6,
    color: '#374151',
    flex: 1,
  },
  table: {
    marginBottom: 15,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderBottomWidth: 2,
    borderBottomColor: '#7B7FEB',
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  tableCell: {
    flex: 1,
    fontSize: 11,
    color: '#374151',
  },
  tableCellHeader: {
    flex: 1,
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1E1E1E',
  },
  tableTotalRow: {
    flexDirection: 'row',
    backgroundColor: '#EEF2FF',
    borderTopWidth: 2,
    borderTopColor: '#7B7FEB',
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  tableTotalCell: {
    flex: 1,
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1E1E1E',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  footerText: {
    fontSize: 10,
    color: '#666666',
  },
  pageNumber: {
    fontSize: 10,
    color: '#666666',
  },
  highlight: {
    backgroundColor: '#EEF2FF',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
  },
  highlightTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#7B7FEB',
    marginBottom: 8,
  },
  highlightText: {
    fontSize: 12,
    color: '#374151',
    lineHeight: 1.5,
  },
});

interface ProposalPDFProps {
  proposal: ProposalData;
}

export const ProposalPDF = ({ proposal }: ProposalPDFProps) => {
  const renderSection = (section: any) => {
    switch (section.type) {
      case 'text':
        return (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            {section.content.split('\n').map((paragraph: string, index: number) => (
              paragraph.trim() && (
                <Text key={index} style={styles.paragraph}>
                  {paragraph}
                </Text>
              )
            ))}
          </View>
        );

      case 'list':
        return (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.listContainer}>
              {section.content.map((item: string, index: number) => (
                <View key={index} style={styles.listItem}>
                  <View style={styles.listBullet} />
                  <Text style={styles.listText}>{item}</Text>
                </View>
              ))}
            </View>
          </View>
        );

      case 'pricing':
        const pricingData = section.content as PricingTable;
        return (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.table}>
              {/* Table Header */}
              <View style={styles.tableHeader}>
                {pricingData.headers.map((header: string, index: number) => (
                  <Text key={index} style={styles.tableCellHeader}>
                    {header}
                  </Text>
                ))}
              </View>
              
              {/* Table Rows */}
              {pricingData.rows.map((row: any, index: number) => (
                <View key={index} style={styles.tableRow}>
                  {pricingData.headers.map((header: string, cellIndex: number) => (
                    <Text key={cellIndex} style={styles.tableCell}>
                      {row[header]}
                    </Text>
                  ))}
                </View>
              ))}
              
              {/* Total Row */}
              {pricingData.total && (
                <View style={styles.tableTotalRow}>
                  <Text style={[styles.tableTotalCell, { flex: pricingData.headers.length - 1 }]}>
                    Total Investment
                  </Text>
                  <Text style={styles.tableTotalCell}>
                    ${pricingData.total.toLocaleString()}
                  </Text>
                </View>
              )}
            </View>
          </View>
        );

      case 'roi_calculator':
        return (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.highlight}>
              <Text style={styles.highlightTitle}>Interactive ROI Calculator</Text>
              <Text style={styles.highlightText}>
                An interactive ROI calculator is available in the digital version of this proposal. 
                It allows you to adjust parameters and see real-time calculations of potential savings, 
                break-even time, and return on investment.
              </Text>
            </View>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>{proposal.title}</Text>
            <Text style={styles.subtitle}>Prepared for {proposal.client.company}</Text>
          </View>
          <View style={styles.companyInfo}>
            <Text style={styles.companyName}>{proposal.author.company}</Text>
            <Text style={styles.footerText}>{proposal.author.email}</Text>
          </View>
        </View>

        {/* Meta Information */}
        <View style={styles.metaContainer}>
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>Total Value</Text>
            <Text style={styles.metaValue}>
              {formatCurrency(proposal.financial.amount, proposal.financial.currency as CurrencyType)}
            </Text>
          </View>
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>Date</Text>
            <Text style={styles.metaValue}>
              {formatDate(proposal.timeline.createdAt)}
            </Text>
          </View>
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>Status</Text>
            <Text style={styles.metaValue}>{proposal.status.charAt(0).toUpperCase() + proposal.status.slice(1)}</Text>
          </View>
        </View>

        {/* Proposal Sections */}
        {proposal.sections
          .sort((a, b) => a.order - b.order)
          .map((section) => (
            <View key={section.id}>
              {renderSection(section)}
            </View>
          ))}

        {/* Footer */}
        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>
            Generated on {new Date().toLocaleDateString()} • {proposal.author.company}
          </Text>
          <Text 
            style={styles.pageNumber} 
            render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`} 
            fixed 
          />
        </View>
      </Page>
    </Document>
  );
};