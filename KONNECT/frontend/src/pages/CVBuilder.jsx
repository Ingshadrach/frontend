import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { jsPDF } from 'jspdf';

const CVBuilder = () => {
  const { user } = useAuth();
  const [isGenerating, setIsGenerating] = useState(false);

  const [cvData, setCvData] = useState({
    name: '',
    email: '',
    phone: user?.phone || '',
    bio: '',
    experience: '',
    education: '',
    skills: ''
  });

  const handleGenerate = async (e) => {
    e.preventDefault();
    setIsGenerating(true);

    try {
      // Generate PDF locally for MVP
      const doc = new jsPDF();
      let yPos = 20;

      // Title/Header
      doc.setFontSize(22);
      doc.setFont('helvetica', 'bold');
      doc.text(cvData.name || 'Konnect Resume', 20, yPos);
      yPos += 10;

      // Contact Info
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100);
      doc.text(`${cvData.email} | ${cvData.phone}`, 20, yPos);
      yPos += 20;
      doc.setTextColor(0);

      // Helper function for sections
      const addSection = (title, content) => {
        if (!content) return;
        
        // Add page if close to bottom
        if (yPos > 270) {
          doc.addPage();
          yPos = 20;
        }

        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(59, 130, 246); // Primary blue
        doc.text(title, 20, yPos);
        yPos += 2;
        
        doc.setDrawColor(200);
        doc.line(20, yPos, 190, yPos);
        yPos += 8;

        doc.setFontSize(11);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(50);
        
        // Split long text into multiple lines
        const lines = doc.splitTextToSize(content, 170);
        doc.text(lines, 20, yPos);
        yPos += (lines.length * 5) + 15;
      };

      addSection('Professional Summary', cvData.bio);
      addSection('Experience', cvData.experience);
      addSection('Education', cvData.education);
      addSection('Skills', cvData.skills);

      // Download the PDF
      doc.save(`Konnect_CV_${cvData.name.replace(/\s+/g, '_') || 'Resume'}.pdf`);
      
    } catch (error) {
      console.error(error);
      alert('We had trouble generating your CV right now.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div>
      <h1 className="page-header">CV Builder</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
        Generate a professional, ready-to-print Resume PDF directly from your profile data.
      </p>

      <div className="card" style={{ maxWidth: '800px', margin: '0 auto' }}>
        <form onSubmit={handleGenerate}>
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '1rem', marginBottom: '1rem' }}>
            <div className="input-group" style={{ marginBottom: 0 }}>
              <label>Full Name</label>
              <input 
                type="text" 
                className="input" 
                placeholder="Samuel Koroma"
                value={cvData.name}
                onChange={(e) => setCvData({...cvData, name: e.target.value})}
                required
              />
            </div>
            <div className="input-group" style={{ marginBottom: 0 }}>
              <label>Professional Email</label>
              <input 
                type="email" 
                className="input" 
                placeholder="samuel@example.com"
                value={cvData.email}
                onChange={(e) => setCvData({...cvData, email: e.target.value})}
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label>Phone Number</label>
            <input 
              type="tel" 
              className="input" 
              value={cvData.phone}
              onChange={(e) => setCvData({...cvData, phone: e.target.value})}
              required
            />
          </div>

          <div className="input-group">
            <label>Professional Summary (Bio)</label>
            <textarea 
              className="input" 
              rows="3"
              placeholder="A brief overview of your career goals and best traits..."
              value={cvData.bio}
              onChange={(e) => setCvData({...cvData, bio: e.target.value})}
            ></textarea>
          </div>

          <div className="input-group">
            <label>Experience</label>
            <textarea 
              className="input" 
              rows="4"
              placeholder="List your previous jobs, companies, and responsibilites..."
              value={cvData.experience}
              onChange={(e) => setCvData({...cvData, experience: e.target.value})}
            ></textarea>
          </div>

          <div className="input-group">
            <label>Education</label>
            <textarea 
              className="input" 
              rows="3"
              placeholder="Degrees, certifications, and schools attended..."
              value={cvData.education}
              onChange={(e) => setCvData({...cvData, education: e.target.value})}
            ></textarea>
          </div>

          <div className="input-group">
            <label>Skills</label>
            <input 
              type="text" 
              className="input" 
              placeholder="e.g. Communication, Data Entry, First Aid (comma separated)"
              value={cvData.skills}
              onChange={(e) => setCvData({...cvData, skills: e.target.value})}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', borderTop: '1px solid var(--border)', paddingTop: '1.5rem', marginTop: '2rem' }}>
            <button type="submit" className="btn" disabled={isGenerating}>
              {isGenerating ? 'Generating PDF...' : 'Download CV'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CVBuilder;
