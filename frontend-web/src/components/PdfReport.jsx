import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 12,
  },
  header: {
    textAlign: 'center',
    fontSize: 20,
    marginBottom: 10,
    borderBottom: '1px solid #EEE',
    paddingBottom: 10,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: 10,
    borderTop: '1px solid #EEE',
    paddingTop: 10,
  },
  body: {
    marginVertical: 10,
    textAlign: 'left',
  },
});

const PdfReport = ({ headerContent, bodyContent, footerContent }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text>{headerContent}</Text>
      </View>

      <View style={styles.body}>
        {bodyContent.map((section, index) => (
          <View key={index} style={{ marginBottom: 10 }}>
            <Text>{section}</Text>
          </View>
        ))}
      </View>

      <View style={styles.footer}>
        <Text>{footerContent}</Text>
      </View>
    </Page>
  </Document>
);

export default PdfReport;
