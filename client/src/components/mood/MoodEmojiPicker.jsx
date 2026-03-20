import { cn } from '../../utils/helpers';

const moods = [
  { value: 1, emoji: '😫', label: 'Terrible', color: 'hover:bg-red-500/20 hover:border-red-500', activeColor: 'bg-red-500/20 border-red-500 ring-red-500/30' },
  { value: 2, emoji: '😟', label: 'Bad', color: 'hover:bg-orange-500/20 hover:border-orange-500', activeColor: 'bg-orange-500/20 border-orange-500 ring-orange-500/30' },
  { value: 3, emoji: '😐', label: 'Okay', color: 'hover:bg-yellow-500/20 hover:border-yellow-500', activeColor: 'bg-yellow-500/20 border-yellow-500 ring-yellow-500/30' },
  { value: 4, emoji: '😊', label: 'Good', color: 'hover:bg-green-400/20 hover:border-green-400', activeColor: 'bg-green-400/20 border-green-400 ring-green-400/30' },
  { value: 5, emoji: '😄', label: 'Great', color: 'hover:bg-green-500/20 hover:border-green-500', activeColor: 'bg-green-500/20 border-green-500 ring-green-500/30' }
];

const MoodEmojiPicker = ({ value, onChange }) => (
  <div className="flex items-center justify-center gap-3">
    {moods.map((mood) => (
      <button
        key={mood.value}
        type="button"
        onClick={() => onChange(mood.value)}
        className={cn(
          'flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all duration-200',
          value === mood.value
            ? `${mood.activeColor} ring-4 scale-110`
            : `border-dark-600 ${mood.color} hover:scale-105`
        )}
      >
        <span className="text-4xl">{mood.emoji}</span>
        <span className={cn('text-xs font-medium', value === mood.value ? 'text-white' : 'text-dark-400')}>
          {mood.label}
        </span>
      </button>
    ))}
  </div>
);

export default MoodEmojiPicker;