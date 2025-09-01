'use client';

import { useState } from 'react';
import { type InstructorInfo } from '../utils/instructorUtils';
import { CertificateData, CertificateGenerator } from './CertificateGenerator';

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface CertificationProps {
  moduleId: string;
  moduleTitle: string;
  questions: QuizQuestion[];
  passingScore: number;
  onCertificationEarned: (certificate: Certificate) => void;
}

interface Certificate {
  id: string;
  moduleTitle: string;
  recipientName: string;
  recipientRole: string;
  dateEarned: string;
  score: number;
  validUntil: string;
  certificateId?: string;
  instructor?: InstructorInfo | null;
}

export default function CertificationSystem({
  moduleId,
  moduleTitle,
  questions,
  passingScore,
  onCertificationEarned,
}: CertificationProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [certificate, setCertificate] = useState<Certificate | null>(null);
  const [userInfo, setUserInfo] = useState({
    name: '',
    email: '',
    role: 'Transportation Professional',
  });
  const [showUserForm, setShowUserForm] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answerIndex;
    setAnswers(newAnswers);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    const correctAnswers = answers.filter(
      (answer, index) => answer === questions[index].correctAnswer
    ).length;

    const score = Math.round((correctAnswers / questions.length) * 100);

    if (score >= passingScore) {
      setShowUserForm(true);
    } else {
      setShowResults(true);
    }
  };

  const handleUserInfoSubmit = () => {
    if (!userInfo.name || !userInfo.email) {
      alert('Please fill in all required fields');
      return;
    }

    const correctAnswers = answers.filter(
      (answer, index) => answer === questions[index].correctAnswer
    ).length;

    const score = Math.round((correctAnswers / questions.length) * 100);

    const newCertificate: Certificate = {
      id: `cert_${moduleId}_${Date.now()}`,
      moduleTitle,
      recipientName: userInfo.name,
      recipientRole: userInfo.role,
      dateEarned: new Date().toLocaleDateString(),
      score,
      validUntil: new Date(
        Date.now() + 365 * 24 * 60 * 60 * 1000
      ).toLocaleDateString(), // 1 year
    };

    setCertificate(newCertificate);
    onCertificationEarned(newCertificate);
    setShowUserForm(false);
    setShowResults(true);
  };

  const handleDownloadCertificate = async () => {
    if (!certificate) return;

    setIsGeneratingPDF(true);
    try {
      const certificateData: CertificateData = {
        id: certificate.id,
        moduleTitle: certificate.moduleTitle,
        recipientName: certificate.recipientName,
        recipientEmail: userInfo.email,
        recipientRole: certificate.recipientRole,
        dateEarned: certificate.dateEarned,
        score: certificate.score,
        validUntil: certificate.validUntil,
      };

      const pdfBlob =
        await CertificateGenerator.generateCertificatePDF(certificateData);
      const filename = `FleetFlow_Certificate_${certificate.id}.pdf`;
      CertificateGenerator.downloadCertificate(pdfBlob, filename);
    } catch (error) {
      console.error('Error generating certificate:', error);
      alert('Error generating certificate. Please try again.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handleEmailCertificate = async () => {
    if (!certificate) return;

    setIsSendingEmail(true);
    try {
      const certificateData: CertificateData = {
        id: certificate.id,
        moduleTitle: certificate.moduleTitle,
        recipientName: certificate.recipientName,
        recipientEmail: userInfo.email,
        recipientRole: certificate.recipientRole,
        dateEarned: certificate.dateEarned,
        score: certificate.score,
        validUntil: certificate.validUntil,
      };

      // Generate PDF
      const pdfBlob =
        await CertificateGenerator.generateCertificatePDF(certificateData);
      const pdfBuffer = await pdfBlob.arrayBuffer();

      // Send email
      const response = await fetch('/api/certificates/email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recipientEmail: userInfo.email,
          recipientName: certificate.recipientName,
          moduleTitle: certificate.moduleTitle,
          certificateId: certificate.id,
          score: certificate.score,
          dateEarned: certificate.dateEarned,
          pdfBuffer: Array.from(new Uint8Array(pdfBuffer)),
        }),
      });

      if (response.ok) {
        const result = await response.json();
        setEmailSent(true);
        console.info('Email sent successfully:', result);
        if (result.previewUrl) {
          console.info('Preview URL:', result.previewUrl);
        }
      } else {
        throw new Error('Failed to send email');
      }
    } catch (error) {
      console.error('Error sending certificate email:', error);
      alert('Error sending certificate email. Please try again.');
    } finally {
      setIsSendingEmail(false);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setShowResults(false);
    setQuizStarted(false);
    setCertificate(null);
    setShowUserForm(false);
    setEmailSent(false);
    setUserInfo({ name: '', email: '', role: 'Transportation Professional' });
  };

  // User Information Form for Certificate Generation
  if (showUserForm) {
    return (
      <div>
        <h1>Certification System</h1>
      </div>
    );
  }

  return (
    <div>
      <h1>Certification System - Main Component</h1>
    </div>
  );
}
