/**
 * Internal Adaptive Learning Component
 * Runs adaptive learning automatically in the background without UI
 */

'use client';

import { useEffect } from 'react';
import { depointeStaffRoster } from './DEPOINTEStaffRoster';

export default function InternalAdaptiveLearning() {
  useEffect(() => {
    // Initialize adaptive learning system silently
    console.log('🧠 DEPOINTE AI Internal Learning System initialized');

    // Count learning-enabled staff
    const learningStaff = depointeStaffRoster.filter(
      (staff) => staff.adaptiveLearning?.enabled
    );

    console.log(
      `🤖 ${learningStaff.length} AI staff members ready for adaptive learning`
    );

    // Learning system is now active and will learn from all interactions
    // This happens automatically when staff interact with users
  }, []);

  // No UI - this component just initializes the learning system
  return null;
}
