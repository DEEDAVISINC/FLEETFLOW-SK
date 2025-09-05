'use client';

import { useState } from 'react';
import { Book, ChevronDown, ChevronUp, Code, FileText, Lightbulb, Zap } from 'lucide-react';
import { LearningMaterial } from './DEPOINTEStaffRoster';

interface AIStaffLearningMaterialsProps {
  staffName: string;
  materials: LearningMaterial[];
}

export default function AIStaffLearningMaterials({
  staffName,
  materials,
}: AIStaffLearningMaterialsProps) {
  const [expandedMaterial, setExpandedMaterial] = useState<string | null>(null);

  const toggleMaterial = (materialId: string) => {
    if (expandedMaterial === materialId) {
      setExpandedMaterial(null);
    } else {
      setExpandedMaterial(materialId);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'strategy':
        return <Lightbulb className="h-4 w-4 text-yellow-500" />;
      case 'skill':
        return <Zap className="h-4 w-4 text-blue-500" />;
      case 'process':
        return <Code className="h-4 w-4 text-green-500" />;
      case 'knowledge':
        return <FileText className="h-4 w-4 text-purple-500" />;
      default:
        return <Book className="h-4 w-4 text-gray-500" />;
    }
  };

  const getProficiencyColor = (proficiency: string) => {
    switch (proficiency) {
      case 'beginner':
        return 'bg-blue-100 text-blue-800';
      case 'intermediate':
        return 'bg-green-100 text-green-800';
      case 'advanced':
        return 'bg-purple-100 text-purple-800';
      case 'expert':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!materials || materials.length === 0) {
    return (
      <div className="rounded-lg bg-slate-100 p-4 text-center text-slate-500">
        <Book className="mx-auto mb-2 h-8 w-8" />
        <p>No learning materials available for {staffName}</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-700">
        <Book className="h-5 w-5 text-blue-600" />
        Learning Materials
      </h3>
      
      <div className="space-y-2">
        {materials.map((material) => (
          <div
            key={material.id}
            className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm"
          >
            <div
              className="flex cursor-pointer items-center justify-between p-4"
              onClick={() => toggleMaterial(material.id)}
            >
              <div className="flex items-center gap-3">
                {getTypeIcon(material.type)}
                <div>
                  <h4 className="font-medium text-slate-800">{material.title}</h4>
                  <p className="text-sm text-slate-500">{material.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${getProficiencyColor(
                    material.proficiency
                  )}`}
                >
                  {material.proficiency}
                </span>
                {expandedMaterial === material.id ? (
                  <ChevronUp className="h-5 w-5 text-slate-400" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-slate-400" />
                )}
              </div>
            </div>
            
            {expandedMaterial === material.id && (
              <div className="border-t border-slate-100 bg-slate-50 p-4">
                <div className="prose prose-sm max-w-none">
                  <div className="whitespace-pre-wrap rounded-md bg-white p-3 text-sm">
                    {material.content}
                  </div>
                  <div className="mt-2 text-right text-xs text-slate-400">
                    Last updated: {material.lastUpdated}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}


