'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function BOLDocumentationTraining() {
  const [activeSection, setActiveSection] = useState('overview');

  const sections = [
    { id: 'overview', title: 'Overview', icon: '📋' },
    { id: 'mbl-hbl', title: 'MBL vs HBL', icon: '📄' },
    { id: 'bol-types', title: '4 Types of BOL', icon: '📑' },
    { id: 'shipping-docs', title: '40 Essential Documents', icon: '📚' },
    { id: 'acronyms', title: 'Logistics Acronyms', icon: '🔤' },
    { id: 'certification', title: 'Certification', icon: '🏆' },
  ];

  const mblHblComparison = [
    {
      feature: 'Issued By',
      hbl: 'Freight Forwarder / NVOCC',
      mbl: 'Shipping Line / Ocean Carrier',
    },
    {
      feature: 'Issued To',
      hbl: 'Actual Shipper/Consignee',
      mbl: 'Freight Forwarder / NVOCC',
    },
    {
      feature: 'Shipper Name',
      hbl: 'Actual Exporter',
      mbl: 'Freight Forwarder / NVOCC',
    },
    {
      feature: 'Consignee Name',
      hbl: 'Actual Importer',
      mbl: "Forwarder's overseas agent / NVOCC",
    },
    {
      feature: 'Purpose',
      hbl: 'For shipper and consignee internal use',
      mbl: 'For actual movement of cargo with the shipping line',
    },
    {
      feature: 'Tracking',
      hbl: "Not trackable on carrier's website",
      mbl: "Trackable on shipping line's website",
    },
    {
      feature: 'Used For',
      hbl: 'Negotiation of terms between exporter/importer',
      mbl: 'Booking, port handling, and customs documentation',
    },
  ];

  const bolTypes = [
    {
      type: 'Master Bill of Lading (MBL)',
      description: 'Issued by the carrier (e.g., shipping line)',
      usage: 'Used between the carrier and freight forwarder',
      details: 'Lists the NVOCC or forwarder as consignee',
    },
    {
      type: 'House Bill of Lading (HBL)',
      description: 'Issued by the freight forwarder to the client',
      usage: 'Lists the actual shipper and buyer',
      details: 'Used to track, release, and claim your cargo',
    },
    {
      type: 'Original Bill of Lading',
      description: 'Physical copy required to release cargo',
      usage: "Offers legal control (cargo won't move without it)",
      details: '⚠️ Delays happen if originals are lost or delayed',
    },
    {
      type: 'Telex Release / Express BL',
      description: 'No physical copy needed',
      usage: 'Faster cargo release',
      details: 'Common for repeat clients or trusted transactions',
    },
  ];

  const shippingDocuments = [
    {
      name: 'Bill of Lading',
      description:
        'The most important shipping document. Acts as contract, receipt, and title. Used to claim cargo at destination.',
    },
    {
      name: 'Packing List',
      description:
        'Matches the invoice line-by-line. Shows quantity, weight, and content. Missing or wrong? Customs will flag it.',
    },
    {
      name: 'Commercial Invoice',
      description:
        "Not just a bill. It's what customs uses to assess duties. Include HS codes, value, buyer/seller details.",
    },
    {
      name: 'Dangerous Goods Declaration',
      description:
        'Required for hazardous cargo. Details safety handling instructions. Must meet carrier and legal rules.',
    },
    {
      name: 'Letter of Credit',
      description:
        'Guarantees seller payment. Issued by a bank. Triggered only when all terms are met.',
    },
    {
      name: 'Certificate of Origin',
      description:
        'Proves where goods were made. Needed for duty reductions. Mandatory in many trade agreements.',
    },
    {
      name: 'Arrival Notice',
      description:
        'Notifies consignee cargo has arrived. Tells where and when to pick up. Often needed to trigger customs clearance.',
    },
    {
      name: 'Export Declaration',
      description:
        "Tells your government what you're shipping. Used for tracking and export controls. Mandatory for many outbound goods.",
    },
    {
      name: 'Import License',
      description:
        'Government permission to import specific goods. Required for controlled or restricted items.',
    },
    {
      name: 'Customs Declaration',
      description:
        'Official statement of cargo contents and value for customs authorities.',
    },
    {
      name: 'Insurance Certificate',
      description: 'Proof of cargo insurance coverage during transit.',
    },
    {
      name: 'Inspection Certificate',
      description: 'Third-party verification of cargo condition and quality.',
    },
    {
      name: 'Phytosanitary Certificate',
      description: 'Required for plant products, certifies pest-free status.',
    },
    {
      name: 'Health Certificate',
      description: 'Required for food products and animal-derived goods.',
    },
    {
      name: 'Fumigation Certificate',
      description: 'Proof that wooden packaging materials have been treated.',
    },
    {
      name: 'Weight Certificate',
      description: 'Official verification of cargo weight.',
    },
    {
      name: 'Temperature Log',
      description: 'Record of temperature conditions for refrigerated cargo.',
    },
    {
      name: 'Delivery Receipt',
      description: 'Proof of cargo delivery at final destination.',
    },
    {
      name: 'Dock Receipt',
      description: 'Acknowledges receipt of cargo at the dock.',
    },
    {
      name: 'Warehouse Receipt',
      description: 'Document showing cargo is stored in a warehouse.',
    },
  ];

  const logisticsAcronyms = [
    {
      acronym: 'AWB',
      full: 'Air Waybill',
      definition: 'Document for air freight shipments',
    },
    {
      acronym: 'BL / BOL',
      full: 'Bill of Lading',
      definition: 'Primary shipping document for ocean/land freight',
    },
    {
      acronym: 'MAWB / HAWB',
      full: 'Master / House Air Waybill',
      definition: 'Air freight equivalents of MBL/HBL',
    },
    {
      acronym: 'FCL / LCL',
      full: 'Full / Less than Container Load',
      definition: 'Container shipping classifications',
    },
    {
      acronym: 'CFS',
      full: 'Container Freight Station',
      definition: 'Facility for LCL cargo consolidation',
    },
    {
      acronym: 'CHA',
      full: 'Customs House Agent',
      definition: 'Licensed customs clearance professional',
    },
    {
      acronym: 'DG / NON-DG',
      full: 'Dangerous / Non-Dangerous Goods',
      definition: 'Hazmat classification',
    },
    {
      acronym: 'ETA / ETD',
      full: 'Estimated Time of Arrival / Departure',
      definition: 'Schedule timing',
    },
    {
      acronym: 'POD',
      full: 'Proof of Delivery',
      definition: 'Documentation of successful delivery',
    },
    {
      acronym: 'EXW / FOB / CIF / DDP',
      full: 'Incoterms (Trade Terms)',
      definition: 'International commercial terms',
    },
    {
      acronym: 'ICD',
      full: 'Inland Container Depot',
      definition: 'Inland container handling facility',
    },
    {
      acronym: 'HS CODE',
      full: 'Harmonized System Code',
      definition: 'International product classification',
    },
    {
      acronym: 'SCM',
      full: 'Supply Chain Management',
      definition: 'End-to-end logistics coordination',
    },
    {
      acronym: '3PL / 4PL',
      full: 'Third / Fourth Party Logistics',
      definition: 'Outsourced logistics services',
    },
    {
      acronym: 'NOC',
      full: 'No Objection Certificate',
      definition: 'Government clearance document',
    },
    {
      acronym: 'SOP',
      full: 'Standard Operating Procedure',
      definition: 'Established process guidelines',
    },
  ];

  const warehouseTerms = [
    {
      term: 'Inventory Management',
      definition:
        'Tracking and controlling stock levels, identifying shortages, and managing replenishments.',
    },
    {
      term: 'Picking',
      definition:
        'Retrieving items from storage to fulfill orders promptly and accurately.',
    },
    {
      term: 'Packing',
      definition:
        'Safely wrapping and packaging items for secure shipment to customers.',
    },
    {
      term: 'Putaway',
      definition:
        'Organizing and storing incoming goods in designated warehouse locations for easy retrieval.',
    },
    {
      term: 'Receiving',
      definition:
        'Checking and documenting items upon their arrival at the warehouse to maintain accurate records.',
    },
    {
      term: 'Cycle Counting',
      definition:
        'Regularly counting portions of inventory to ensure accuracy without the need for a full inventory count.',
    },
    {
      term: 'WMS (Warehouse Management System)',
      definition:
        'Utilizing software to streamline and monitor warehouse operations efficiently.',
    },
    {
      term: 'Cross-Docking',
      definition:
        'Directly transferring goods from inbound to outbound trucks without storage in between.',
    },
    {
      term: 'Safety Stock',
      definition:
        'Maintaining extra inventory as a precaution against delays or unexpected shortages.',
    },
    {
      term: 'FIFO (First In, First Out)',
      definition:
        'Prioritizing the use or sale of older stock first, particularly beneficial for perishable goods.',
    },
    {
      term: 'LIFO (Last In, First Out)',
      definition:
        'Utilizing newer stock first, commonly applied to fast-moving products.',
    },
    {
      term: 'Bin Location',
      definition:
        'Designating specific storage locations within the warehouse for efficient item retrieval.',
    },
    {
      term: 'Kitting',
      definition:
        'Assembling multiple products into a single package or kit for convenience and efficiency.',
    },
    {
      term: 'Slotting',
      definition:
        'Strategically organizing products within the warehouse to optimize accessibility and workflow.',
    },
    {
      term: 'Order Fulfillment',
      definition:
        'Managing the entire process from order receipt to successful delivery to customers.',
    },
    {
      term: 'Backorder',
      definition:
        'Processing orders for items currently out of stock, ensuring timely delivery once restocked.',
    },
    {
      term: 'Returns Processing',
      definition:
        'Managing returned goods through inspection, restocking, or appropriate disposal procedures.',
    },
    {
      term: 'Shrinkage',
      definition:
        'Addressing inventory loss due to theft, damage, or administrative errors.',
    },
  ];

  return (
    <div
      style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        minHeight: '100vh',
        paddingTop: '80px',
        paddingBottom: '40px',
      }}
    >
      {/* Navigation */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
          padding: '12px 20px',
          zIndex: 1000,
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            maxWidth: '1400px',
            margin: '0 auto',
          }}
        >
          <Link
            href='/'
            style={{
              fontSize: '1.8rem',
              fontWeight: 'bold',
              background: 'linear-gradient(45deg, #3b82f6, #06b6d4)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textDecoration: 'none',
            }}
          >
            🚛 FleetFlow™
          </Link>

          <Link href='/training' style={{ textDecoration: 'none' }}>
            <button
              style={{
                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '8px',
                fontSize: '0.9rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
            >
              ← Back to Training
            </button>
          </Link>
        </div>
      </div>

      {/* Header */}
      <div
        style={{
          textAlign: 'center',
          marginBottom: '40px',
          padding: '0 20px',
        }}
      >
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            borderRadius: '20px',
            padding: '40px',
            margin: '0 auto',
            maxWidth: '800px',
            border: '1px solid rgba(255, 255, 255, 0.18)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          }}
        >
          <h1
            style={{
              fontSize: '3rem',
              fontWeight: 'bold',
              color: 'white',
              margin: '0 0 16px 0',
              textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
            }}
          >
            📄 BOL Documentation Mastery
          </h1>
          <p
            style={{
              fontSize: '1.4rem',
              color: 'rgba(255, 255, 255, 0.95)',
              margin: '0 0 8px 0',
              fontWeight: '600',
              textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
            }}
          >
            Master Bills of Lading, Shipping Documents & Logistics
          </p>
          <p
            style={{
              fontSize: '1.1rem',
              color: 'rgba(255, 255, 255, 0.9)',
              margin: 0,
              lineHeight: '1.6',
              fontStyle: 'italic',
            }}
          >
            "Most cargo delays aren't caused by storms or traffic - they're
            caused by document errors"
          </p>
        </div>
      </div>

      {/* Section Navigation */}
      <div
        style={{
          display: 'flex',
          gap: '10px',
          justifyContent: 'center',
          marginBottom: '40px',
          flexWrap: 'wrap',
          padding: '0 20px',
        }}
      >
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            style={{
              background:
                activeSection === section.id
                  ? 'rgba(255, 255, 255, 0.9)'
                  : 'rgba(255, 255, 255, 0.1)',
              color: activeSection === section.id ? '#667eea' : 'white',
              border:
                activeSection === section.id
                  ? '2px solid rgba(255, 255, 255, 0.9)'
                  : '1px solid rgba(255, 255, 255, 0.3)',
              padding: '10px 20px',
              borderRadius: '25px',
              fontSize: '0.9rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              backdropFilter: 'blur(10px)',
            }}
          >
            {section.icon} {section.title}
          </button>
        ))}
      </div>

      {/* Main Content */}
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 20px',
        }}
      >
        {activeSection === 'overview' && (
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              borderRadius: '20px',
              padding: '40px',
              border: '2px solid rgba(255, 255, 255, 0.3)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            }}
          >
            <h2
              style={{
                fontSize: '2rem',
                fontWeight: 'bold',
                color: '#1f2937',
                marginBottom: '20px',
              }}
            >
              📋 Course Overview
            </h2>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '20px',
                marginBottom: '30px',
              }}
            >
              <div
                style={{
                  background: 'rgba(16, 185, 129, 0.1)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  borderRadius: '12px',
                  padding: '20px',
                }}
              >
                <h3 style={{ color: '#10b981', marginBottom: '10px' }}>
                  🎯 Learning Objectives
                </h3>
                <ul style={{ color: '#374151', lineHeight: '1.6' }}>
                  <li>Master the difference between MBL and HBL</li>
                  <li>Understand 4 types of Bills of Lading</li>
                  <li>Learn 40 essential shipping documents</li>
                  <li>Master logistics acronyms and terminology</li>
                  <li>Understand warehouse operations</li>
                </ul>
              </div>

              <div
                style={{
                  background: 'rgba(59, 130, 246, 0.1)',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  borderRadius: '12px',
                  padding: '20px',
                }}
              >
                <h3 style={{ color: '#3b82f6', marginBottom: '10px' }}>
                  📚 Course Modules
                </h3>
                <ul style={{ color: '#374151', lineHeight: '1.6' }}>
                  <li>MBL vs HBL Comparison</li>
                  <li>4 Types of BOL Training</li>
                  <li>Essential Shipping Documents</li>
                  <li>Logistics Acronyms Dictionary</li>
                  <li>Warehouse Operations Terms</li>
                </ul>
              </div>
            </div>

            <div
              style={{
                background: 'rgba(245, 158, 11, 0.1)',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                borderRadius: '12px',
                padding: '20px',
              }}
            >
              <h3 style={{ color: '#f59e0b', marginBottom: '15px' }}>
                ⚠️ Why Documentation Matters
              </h3>
              <p
                style={{
                  color: '#374151',
                  fontSize: '1.1rem',
                  lineHeight: '1.6',
                }}
              >
                Most problems in shipping start with one thing:{' '}
                <strong>Bad documentation</strong>. Late cargo, fines, customs
                holds, and denied claims can all be avoided by mastering proper
                documentation procedures. This course will make you an expert in
                shipping documents and logistics terminology.
              </p>
            </div>
          </div>
        )}

        {activeSection === 'mbl-hbl' && (
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              borderRadius: '20px',
              padding: '40px',
              border: '2px solid rgba(255, 255, 255, 0.3)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            }}
          >
            <h2
              style={{
                fontSize: '2rem',
                fontWeight: 'bold',
                color: '#1f2937',
                marginBottom: '20px',
              }}
            >
              📄 MBL vs HBL: Master the Difference
            </h2>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
                gap: '30px',
                marginBottom: '40px',
              }}
            >
              <div
                style={{
                  background: 'rgba(59, 130, 246, 0.1)',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  borderRadius: '12px',
                  padding: '25px',
                }}
              >
                <h3
                  style={{
                    color: '#3b82f6',
                    marginBottom: '15px',
                    fontSize: '1.3rem',
                  }}
                >
                  🔹 MBL (Master Bill of Lading)
                </h3>
                <p
                  style={{
                    color: '#374151',
                    marginBottom: '15px',
                    fontWeight: '600',
                  }}
                >
                  <strong>Definition:</strong> The Master Bill of Lading is
                  issued by the main carrier (shipping line) to the freight
                  forwarder (or NVOCC).
                </p>
                <div style={{ marginBottom: '10px' }}>
                  <strong style={{ color: '#1f2937' }}>Issued By:</strong> Ocean
                  Carrier / Shipping Line
                </div>
                <div style={{ marginBottom: '10px' }}>
                  <strong style={{ color: '#1f2937' }}>Issued To:</strong>{' '}
                  Freight Forwarder / NVOCC
                </div>
                <div>
                  <strong style={{ color: '#1f2937' }}>Contains:</strong>
                  <ul style={{ marginTop: '5px', color: '#374151' }}>
                    <li>Shipper: Freight forwarder</li>
                    <li>
                      Consignee: Freight forwarder (or their overseas agent)
                    </li>
                    <li>Port of Loading / Destination</li>
                    <li>Cargo details (as provided by the forwarder)</li>
                  </ul>
                </div>
              </div>

              <div
                style={{
                  background: 'rgba(16, 185, 129, 0.1)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  borderRadius: '12px',
                  padding: '25px',
                }}
              >
                <h3
                  style={{
                    color: '#10b981',
                    marginBottom: '15px',
                    fontSize: '1.3rem',
                  }}
                >
                  🔹 HBL (House Bill of Lading)
                </h3>
                <p
                  style={{
                    color: '#374151',
                    marginBottom: '15px',
                    fontWeight: '600',
                  }}
                >
                  <strong>Definition:</strong> The House Bill of Lading is
                  issued by a freight forwarder to the actual shipper
                  (exporter).
                </p>
                <div style={{ marginBottom: '10px' }}>
                  <strong style={{ color: '#1f2937' }}>Issued By:</strong>{' '}
                  Freight Forwarder or NVOCC
                </div>
                <div style={{ marginBottom: '10px' }}>
                  <strong style={{ color: '#1f2937' }}>Issued To:</strong>{' '}
                  Actual exporter (shipper) or importer (consignee)
                </div>
                <div>
                  <strong style={{ color: '#1f2937' }}>Contains:</strong>
                  <ul style={{ marginTop: '5px', color: '#374151' }}>
                    <li>Shipper: Actual exporter</li>
                    <li>Consignee: Actual importer</li>
                    <li>Cargo details</li>
                    <li>
                      Sometimes mentions freight charges (if prepaid or collect)
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div
              style={{
                background: 'rgba(245, 158, 11, 0.1)',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                borderRadius: '12px',
                padding: '20px',
                marginBottom: '30px',
              }}
            >
              <h3 style={{ color: '#f59e0b', marginBottom: '15px' }}>
                🧾 Example Scenario
              </h3>
              <p style={{ color: '#374151', lineHeight: '1.6' }}>
                If you're an exporter in India shipping goods to Dubai:
              </p>
              <ol
                style={{
                  color: '#374151',
                  lineHeight: '1.6',
                  marginTop: '10px',
                }}
              >
                <li>You book through a freight forwarder</li>
                <li>The freight forwarder books space with a shipping line</li>
                <li>
                  The shipping line issues the <strong>MBL</strong> to the
                  freight forwarder
                </li>
                <li>
                  The freight forwarder issues an <strong>HBL</strong> to you
                  (the actual shipper)
                </li>
              </ol>
            </div>

            {/* Comparison Table */}
            <h3
              style={{
                color: '#1f2937',
                marginBottom: '20px',
                fontSize: '1.4rem',
              }}
            >
              ✅ Key Differences Between MBL and HBL
            </h3>
            <div style={{ overflowX: 'auto' }}>
              <table
                style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  background: 'white',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                }}
              >
                <thead>
                  <tr style={{ background: '#f8fafc' }}>
                    <th
                      style={{
                        padding: '15px',
                        textAlign: 'left',
                        borderBottom: '2px solid #e2e8f0',
                        fontWeight: 'bold',
                        color: '#1f2937',
                      }}
                    >
                      Feature
                    </th>
                    <th
                      style={{
                        padding: '15px',
                        textAlign: 'left',
                        borderBottom: '2px solid #e2e8f0',
                        fontWeight: 'bold',
                        color: '#10b981',
                      }}
                    >
                      HBL (House Bill of Lading)
                    </th>
                    <th
                      style={{
                        padding: '15px',
                        textAlign: 'left',
                        borderBottom: '2px solid #e2e8f0',
                        fontWeight: 'bold',
                        color: '#3b82f6',
                      }}
                    >
                      MBL (Master Bill of Lading)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {mblHblComparison.map((row, index) => (
                    <tr
                      key={index}
                      style={{
                        background: index % 2 === 0 ? '#f8fafc' : 'white',
                        borderBottom: '1px solid #e2e8f0',
                      }}
                    >
                      <td
                        style={{
                          padding: '12px 15px',
                          fontWeight: '600',
                          color: '#1f2937',
                        }}
                      >
                        {row.feature}
                      </td>
                      <td style={{ padding: '12px 15px', color: '#374151' }}>
                        {row.hbl}
                      </td>
                      <td style={{ padding: '12px 15px', color: '#374151' }}>
                        {row.mbl}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeSection === 'bol-types' && (
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              borderRadius: '20px',
              padding: '40px',
              border: '2px solid rgba(255, 255, 255, 0.3)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            }}
          >
            <h2
              style={{
                fontSize: '2rem',
                fontWeight: 'bold',
                color: '#1f2937',
                marginBottom: '20px',
              }}
            >
              📑 4 Main Types of Bill of Lading
            </h2>

            <p
              style={{
                fontSize: '1.1rem',
                color: '#6b7280',
                marginBottom: '30px',
                lineHeight: '1.6',
                fontStyle: 'italic',
              }}
            >
              Understanding these 4 types is crucial for proper shipping
              operations and avoiding delays.
            </p>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
                gap: '25px',
              }}
            >
              {bolTypes.map((type, index) => (
                <div
                  key={index}
                  style={{
                    background:
                      index === 0
                        ? 'rgba(59, 130, 246, 0.1)'
                        : index === 1
                          ? 'rgba(16, 185, 129, 0.1)'
                          : index === 2
                            ? 'rgba(245, 158, 11, 0.1)'
                            : 'rgba(168, 85, 247, 0.1)',
                    border:
                      index === 0
                        ? '1px solid rgba(59, 130, 246, 0.3)'
                        : index === 1
                          ? '1px solid rgba(16, 185, 129, 0.3)'
                          : index === 2
                            ? '1px solid rgba(245, 158, 11, 0.3)'
                            : '1px solid rgba(168, 85, 247, 0.3)',
                    borderRadius: '12px',
                    padding: '25px',
                  }}
                >
                  <h3
                    style={{
                      color:
                        index === 0
                          ? '#3b82f6'
                          : index === 1
                            ? '#10b981'
                            : index === 2
                              ? '#f59e0b'
                              : '#a855f7',
                      marginBottom: '15px',
                      fontSize: '1.2rem',
                      fontWeight: 'bold',
                    }}
                  >
                    {index + 1}️⃣ {type.type}
                  </h3>

                  <div style={{ marginBottom: '12px' }}>
                    <strong style={{ color: '#1f2937' }}>Description:</strong>
                    <p
                      style={{
                        color: '#374151',
                        margin: '5px 0',
                        lineHeight: '1.5',
                      }}
                    >
                      {type.description}
                    </p>
                  </div>

                  <div style={{ marginBottom: '12px' }}>
                    <strong style={{ color: '#1f2937' }}>Usage:</strong>
                    <p
                      style={{
                        color: '#374151',
                        margin: '5px 0',
                        lineHeight: '1.5',
                      }}
                    >
                      {type.usage}
                    </p>
                  </div>

                  <div>
                    <strong style={{ color: '#1f2937' }}>Key Points:</strong>
                    <p
                      style={{
                        color: '#374151',
                        margin: '5px 0',
                        lineHeight: '1.5',
                      }}
                    >
                      {type.details}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div
              style={{
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '12px',
                padding: '20px',
                marginTop: '30px',
              }}
            >
              <h3 style={{ color: '#ef4444', marginBottom: '15px' }}>
                🔍 Why This Matters
              </h3>
              <p style={{ color: '#374151', lineHeight: '1.6' }}>
                If your BL type doesn't match your trade setup, you could face:
              </p>
              <ul
                style={{
                  color: '#374151',
                  marginTop: '10px',
                  lineHeight: '1.6',
                }}
              >
                <li>🚫 Delayed customs release</li>
                <li>🚫 Storage or demurrage fees</li>
                <li>🚫 Legal disputes over cargo ownership</li>
              </ul>
              <p
                style={{
                  color: '#374151',
                  marginTop: '15px',
                  fontWeight: '600',
                }}
              >
                ✅ Knowing the difference = faster, smoother, cheaper shipping.
              </p>
            </div>
          </div>
        )}

        {activeSection === 'shipping-docs' && (
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              borderRadius: '20px',
              padding: '40px',
              border: '2px solid rgba(255, 255, 255, 0.3)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            }}
          >
            <h2
              style={{
                fontSize: '2rem',
                fontWeight: 'bold',
                color: '#1f2937',
                marginBottom: '20px',
              }}
            >
              📚 Essential Shipping Documents
            </h2>

            <div
              style={{
                background: 'rgba(59, 130, 246, 0.1)',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                borderRadius: '12px',
                padding: '20px',
                marginBottom: '30px',
              }}
            >
              <h3 style={{ color: '#3b82f6', marginBottom: '10px' }}>
                📄 Top Essential Documents
              </h3>
              <p style={{ color: '#374151', lineHeight: '1.6' }}>
                These are the most critical documents every cargo professional
                should master. Each document serves a specific purpose in the
                shipping process.
              </p>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
                gap: '20px',
              }}
            >
              {shippingDocuments.slice(0, 8).map((doc, index) => (
                <div
                  key={index}
                  style={{
                    background: 'rgba(249, 250, 251, 0.8)',
                    border: '1px solid rgba(209, 213, 219, 0.5)',
                    borderRadius: '8px',
                    padding: '20px',
                    borderLeft: '4px solid #10b981',
                  }}
                >
                  <h4
                    style={{
                      color: '#1f2937',
                      marginBottom: '10px',
                      fontSize: '1.1rem',
                      fontWeight: 'bold',
                    }}
                  >
                    🔹 {doc.name}
                  </h4>
                  <p
                    style={{
                      color: '#374151',
                      lineHeight: '1.5',
                      fontSize: '0.95rem',
                    }}
                  >
                    {doc.description}
                  </p>
                </div>
              ))}
            </div>

            <div
              style={{
                background: 'rgba(245, 158, 11, 0.1)',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                borderRadius: '12px',
                padding: '20px',
                marginTop: '30px',
                textAlign: 'center',
              }}
            >
              <h3 style={{ color: '#f59e0b', marginBottom: '15px' }}>
                📋 Additional Documents
              </h3>
              <p style={{ color: '#374151', lineHeight: '1.6' }}>
                There are 32 more essential shipping documents beyond these core
                ones. Each plays a crucial role in international trade and
                logistics operations.
              </p>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '10px',
                  marginTop: '20px',
                }}
              >
                {shippingDocuments.slice(8).map((doc, index) => (
                  <div
                    key={index}
                    style={{
                      background: 'rgba(255, 255, 255, 0.6)',
                      padding: '10px',
                      borderRadius: '6px',
                      fontSize: '0.9rem',
                      color: '#374151',
                      fontWeight: '500',
                    }}
                  >
                    • {doc.name}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeSection === 'acronyms' && (
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              borderRadius: '20px',
              padding: '40px',
              border: '2px solid rgba(255, 255, 255, 0.3)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            }}
          >
            <h2
              style={{
                fontSize: '2rem',
                fontWeight: 'bold',
                color: '#1f2937',
                marginBottom: '20px',
              }}
            >
              🔤 Essential Logistics Acronyms
            </h2>

            <div
              style={{
                background: 'rgba(168, 85, 247, 0.1)',
                border: '1px solid rgba(168, 85, 247, 0.3)',
                borderRadius: '12px',
                padding: '20px',
                marginBottom: '30px',
              }}
            >
              <h3 style={{ color: '#a855f7', marginBottom: '10px' }}>
                📖 Master Industry Terminology
              </h3>
              <p style={{ color: '#374151', lineHeight: '1.6' }}>
                These acronyms are used daily in logistics and freight
                operations. Mastering them is essential for professional
                communication.
              </p>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
                gap: '15px',
                marginBottom: '30px',
              }}
            >
              {logisticsAcronyms.map((item, index) => (
                <div
                  key={index}
                  style={{
                    background: 'rgba(249, 250, 251, 0.8)',
                    border: '1px solid rgba(209, 213, 219, 0.5)',
                    borderRadius: '8px',
                    padding: '15px',
                    borderLeft: '4px solid #a855f7',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      marginBottom: '8px',
                    }}
                  >
                    <span
                      style={{
                        background: '#a855f7',
                        color: 'white',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '0.8rem',
                        fontWeight: 'bold',
                        marginRight: '10px',
                      }}
                    >
                      {item.acronym}
                    </span>
                    <span
                      style={{
                        color: '#1f2937',
                        fontWeight: '600',
                        fontSize: '0.95rem',
                      }}
                    >
                      {item.full}
                    </span>
                  </div>
                  <p
                    style={{
                      color: '#374151',
                      fontSize: '0.9rem',
                      lineHeight: '1.4',
                      margin: 0,
                    }}
                  >
                    {item.definition}
                  </p>
                </div>
              ))}
            </div>

            <h3
              style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                color: '#1f2937',
                marginBottom: '20px',
              }}
            >
              🏢 Essential Warehouse Terms
            </h3>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
                gap: '15px',
              }}
            >
              {warehouseTerms.map((item, index) => (
                <div
                  key={index}
                  style={{
                    background: 'rgba(249, 250, 251, 0.8)',
                    border: '1px solid rgba(209, 213, 219, 0.5)',
                    borderRadius: '8px',
                    padding: '15px',
                    borderLeft: '4px solid #10b981',
                  }}
                >
                  <h4
                    style={{
                      color: '#1f2937',
                      marginBottom: '8px',
                      fontSize: '1rem',
                      fontWeight: 'bold',
                    }}
                  >
                    {item.term}
                  </h4>
                  <p
                    style={{
                      color: '#374151',
                      fontSize: '0.9rem',
                      lineHeight: '1.4',
                      margin: 0,
                    }}
                  >
                    {item.definition}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSection === 'certification' && (
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              borderRadius: '20px',
              padding: '40px',
              border: '2px solid rgba(255, 255, 255, 0.3)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            }}
          >
            <h2
              style={{
                fontSize: '2rem',
                fontWeight: 'bold',
                color: '#1f2937',
                marginBottom: '20px',
                textAlign: 'center',
              }}
            >
              🏆 Documentation Specialist Certification
            </h2>

            <div
              style={{
                background: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                borderRadius: '12px',
                padding: '30px',
                textAlign: 'center',
                marginBottom: '30px',
              }}
            >
              <h3
                style={{
                  color: '#10b981',
                  marginBottom: '15px',
                  fontSize: '1.4rem',
                }}
              >
                🎓 Earn Your Certification
              </h3>
              <p
                style={{
                  color: '#374151',
                  lineHeight: '1.6',
                  fontSize: '1.1rem',
                }}
              >
                Complete all training modules and pass the comprehensive
                assessment to earn your FleetFlow University℠ Documentation
                Specialist Certification.
              </p>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '20px',
                marginBottom: '30px',
              }}
            >
              <div
                style={{
                  background: 'rgba(59, 130, 246, 0.1)',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  borderRadius: '12px',
                  padding: '20px',
                  textAlign: 'center',
                }}
              >
                <h4 style={{ color: '#3b82f6', marginBottom: '10px' }}>
                  📚 Requirements
                </h4>
                <ul
                  style={{
                    color: '#374151',
                    textAlign: 'left',
                    lineHeight: '1.6',
                  }}
                >
                  <li>Complete MBL vs HBL training</li>
                  <li>Master 4 types of BOL</li>
                  <li>Study 40 shipping documents</li>
                  <li>Learn logistics acronyms</li>
                  <li>Pass final assessment (85%)</li>
                </ul>
              </div>

              <div
                style={{
                  background: 'rgba(245, 158, 11, 0.1)',
                  border: '1px solid rgba(245, 158, 11, 0.3)',
                  borderRadius: '12px',
                  padding: '20px',
                  textAlign: 'center',
                }}
              >
                <h4 style={{ color: '#f59e0b', marginBottom: '10px' }}>
                  ⏱️ Duration
                </h4>
                <p style={{ color: '#374151', lineHeight: '1.6' }}>
                  <strong>4-5 hours</strong> of comprehensive training covering
                  all aspects of shipping documentation and logistics
                  terminology.
                </p>
              </div>

              <div
                style={{
                  background: 'rgba(168, 85, 247, 0.1)',
                  border: '1px solid rgba(168, 85, 247, 0.3)',
                  borderRadius: '12px',
                  padding: '20px',
                  textAlign: 'center',
                }}
              >
                <h4 style={{ color: '#a855f7', marginBottom: '10px' }}>
                  🎯 Benefits
                </h4>
                <ul
                  style={{
                    color: '#374151',
                    textAlign: 'left',
                    lineHeight: '1.6',
                  }}
                >
                  <li>Professional certification</li>
                  <li>Industry recognition</li>
                  <li>Career advancement</li>
                  <li>Reduced documentation errors</li>
                  <li>Enhanced job prospects</li>
                </ul>
              </div>
            </div>

            <div
              style={{
                background: 'linear-gradient(135deg, #10b981, #059669)',
                borderRadius: '12px',
                padding: '30px',
                textAlign: 'center',
                color: 'white',
              }}
            >
              <h3 style={{ marginBottom: '15px', fontSize: '1.3rem' }}>
                🚀 Ready to Get Certified?
              </h3>
              <p style={{ marginBottom: '20px', opacity: 0.9 }}>
                Complete all training modules and demonstrate your mastery of
                shipping documentation.
              </p>
              <button
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  padding: '15px 30px',
                  borderRadius: '8px',
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
              >
                🏆 Start Certification Assessment
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
