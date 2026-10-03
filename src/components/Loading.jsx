import React from 'react';
import { Sparkles } from './icons';

export const Loading = ({ text = 'Loading luxury experiences...', fullScreen = false }) => {
  const content = (
    <div className="flex flex-col items-center justify-center gap-4 py-12 px-4 text-center">
      <div className="relative flex items-center justify-center">
        <div className="w-14 h-14 rounded-full border-2 border-gold-200 border-t-gold-600 animate-spin" />
        <Sparkles className="absolute text-gold-500 animate-pulse" size={20} />
      </div>
      <p className="font-serif italic text-charcoal-700 tracking-wide text-base">{text}</p>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        {content}
      </div>
    );
  }

  return content;
};
