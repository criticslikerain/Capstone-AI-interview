import React from 'react';
import { X, Download } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const AnalysisModal = ({ isOpen, onClose, analysis, category, question, allAnswers }) => {
  if (!isOpen) return null;

  const exportToPDF = () => {
    const doc = new jsPDF('p', 'mm', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    let yPosition = margin;

    // Logo at top right
    doc.setFillColor(6, 182, 212);
    doc.circle(pageWidth - 25, 15, 8, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.text('IP', pageWidth - 28, 18);
    doc.setTextColor(0, 0, 0);
    
    // Title
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('InterviewPro', margin, yPosition);
    yPosition += 10;
    doc.setFontSize(16);
    doc.text('AI Analysis Report', margin, yPosition);
    yPosition += 15;
    
    // Divider
    doc.setDrawColor(6, 182, 212);
    doc.setLineWidth(0.5);
    doc.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 10;
    
    // Category
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Category:', margin, yPosition);
    doc.setFont('helvetica', 'normal');
    doc.text(category.toUpperCase(), margin + 30, yPosition);
    yPosition += 15;
    
    // If summary with all answers
    if (allAnswers && allAnswers.length > 0) {
      allAnswers.forEach((qa, idx) => {
        if (yPosition > pageHeight - 50) {
          doc.addPage();
          yPosition = margin;
        }
        
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text(`Question ${idx + 1}:`, margin, yPosition);
        yPosition += 7;
        
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        const qLines = doc.splitTextToSize(qa.question, pageWidth - 2 * margin);
        doc.text(qLines, margin, yPosition);
        yPosition += qLines.length * 5 + 5;
        
        doc.setFont('helvetica', 'bold');
        doc.text('Your Answer:', margin, yPosition);
        yPosition += 5;
        
        doc.setFont('helvetica', 'normal');
        const aLines = doc.splitTextToSize(qa.answer, pageWidth - 2 * margin);
        doc.text(aLines, margin, yPosition);
        yPosition += aLines.length * 5 + 10;
      });
      
      if (yPosition > pageHeight - 60) {
        doc.addPage();
        yPosition = margin;
      }
      yPosition += 5;
    } else {
      // Single question
      doc.setFont('helvetica', 'bold');
      doc.text('Question:', margin, yPosition);
      yPosition += 7;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      const questionLines = doc.splitTextToSize(question, pageWidth - 2 * margin);
      doc.text(questionLines, margin, yPosition);
      yPosition += questionLines.length * 5 + 10;
    }
    
    // Analysis
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('AI Analysis:', margin, yPosition);
    yPosition += 10;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    const analysisLines = doc.splitTextToSize(analysis, pageWidth - 2 * margin);
    
    for (let i = 0; i < analysisLines.length; i++) {
      if (yPosition > pageHeight - margin) {
        doc.addPage();
        yPosition = margin;
      }
      doc.text(analysisLines[i], margin, yPosition);
      yPosition += 5;
    }
    
    const timestamp = new Date().toLocaleString();
    doc.setFontSize(8);
    doc.setTextColor(128, 128, 128);
    doc.text(`Generated on ${timestamp}`, margin, pageHeight - 10);
    
    doc.save(`InterviewPro-Analysis-${Date.now()}.pdf`);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '2rem',
        maxWidth: '600px',
        width: '90%',
        maxHeight: '80vh',
        overflow: 'auto',
        position: 'relative'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.5rem'
        }}>
          <h2 style={{ margin: 0, fontSize: '1.5rem', color: '#374151' }}>AI Analysis</h2>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={exportToPDF}
              style={{
                padding: '0.5rem',
                backgroundColor: '#06b6d4',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <Download size={18} />
              Export PDF
            </button>
            <button
              onClick={onClose}
              style={{
                padding: '0.5rem',
                backgroundColor: '#ef4444',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              <X size={18} />
            </button>
          </div>
        </div>
        
        <div style={{
          backgroundColor: '#f9fafb',
          padding: '1.5rem',
          borderRadius: '8px',
          whiteSpace: 'pre-wrap',
          lineHeight: '1.6',
          color: '#374151'
        }}>
          {analysis}
        </div>
      </div>
    </div>
  );
};

export default AnalysisModal;
