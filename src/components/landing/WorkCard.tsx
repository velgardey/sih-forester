import React, { useEffect, useState } from 'react';

interface WorkCardProps {
  illustration: React.ReactNode;
  title: string;
  description: string;
  borderColor?: string;
}

export const WorkCard: React.FC<WorkCardProps> = ({
  illustration,
  title,
  description,
  borderColor = 'border-transparent',
}) => {
  const [highlightWords, setHighlightWords] = useState<string[]>([]);

  useEffect(() => {
    async function loadConstants() {
      try {
        const constants = await import('@/data/constants.json');
        setHighlightWords(constants.default.highlightWords);
      } catch (error) {
        console.error('Error loading constants:', error);
      }
    }
    loadConstants();
  }, []);

  return (
    <div
      className={`bg-white rounded-xl shadow-lg p-6 text-center w-full max-w-sm transform hover:scale-105 transition-transform duration-300 border-2 ${borderColor}`}
    >
      {/* Illustration */}
      <div className="flex justify-center items-center h-40 mb-4">{illustration}</div>

      {/* Title */}
      <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>

      <p className="text-gray-600 leading-relaxed">
        {description.split(' ').map((word, index) => {
          const cleanWord = word.replace(/[.,]/g, '');
          if (highlightWords.includes(cleanWord)) {
            return (
              <strong key={index} className="text-gray-800">
                {word}{' '}
              </strong>
            );
          }
          return word + ' ';
        })}
      </p>
    </div>
  );
};

export default WorkCard;
