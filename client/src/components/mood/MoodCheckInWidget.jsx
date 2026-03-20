import { useState } from 'react';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { submitMood, fetchMoodHistory } from '../../store/slices/moodSlice';
import MoodEmojiPicker from './MoodEmojiPicker';
import Button from '../common/Button';
import { MOOD_FACTORS } from '../../utils/constants';

const MoodCheckInWidget = ({ onSubmitted }) => {
  const dispatch = useDispatch();
  const [mood, setMood] = useState(null);
  const [selectedFactors, setSelectedFactors] = useState([]);
  const [note, setNote] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const toggleFactor = (factor) => {
    setSelectedFactors((prev) =>
      prev.includes(factor)
        ? prev.filter((f) => f !== factor)
        : [...prev, factor]
    );
  };

  const handleSubmit = async () => {
    if (!mood) { toast.error('Please select your mood'); return; }

    setIsLoading(true);
    try {
      await dispatch(submitMood({
        mood,
        factors: selectedFactors,
        note: note.trim()
      })).unwrap();

      toast.success('Mood recorded! 💚');
      dispatch(fetchMoodHistory({ range: 30 }));
      setMood(null);
      setSelectedFactors([]);
      setNote('');
      onSubmitted?.();
    } catch (err) {
      toast.error(err || 'Failed to submit');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-white mb-2">How are you feeling today?</h3>
      <p className="text-dark-400 text-sm mb-6">Your response helps us monitor team wellness</p>

      {/* Emoji Picker */}
      <MoodEmojiPicker value={mood} onChange={setMood} />

      {/* Factors */}
      {mood && (
        <div className="mt-6 animate-fade-in">
          <p className="text-sm text-dark-300 mb-3">What&apos;s affecting your mood? (optional)</p>
          <div className="flex flex-wrap gap-2">
            {MOOD_FACTORS.map((factor) => (
              <button
                key={factor.value}
                type="button"
                onClick={() => toggleFactor(factor.value)}
                className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                  selectedFactors.includes(factor.value)
                    ? 'bg-primary-500/20 border-primary-500/50 text-primary-400'
                    : 'border-dark-600 text-dark-400 hover:border-dark-500 hover:text-dark-300'
                }`}
              >
                {factor.icon} {factor.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Note */}
      {mood && (
        <div className="mt-4 animate-fade-in">
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Any additional notes? (optional)"
            rows={2}
            maxLength={500}
            className="w-full bg-dark-900 border border-dark-600 text-dark-200 rounded-lg
                       px-4 py-2.5 text-sm placeholder-dark-500 focus:border-primary-500
                       focus:ring-1 focus:ring-primary-500 focus:outline-none resize-none"
          />
        </div>
      )}

      {/* Submit */}
      {mood && (
        <div className="mt-4 flex justify-end animate-fade-in">
          <Button onClick={handleSubmit} isLoading={isLoading}>
            Submit Check-in
          </Button>
        </div>
      )}
    </div>
  );
};

export default MoodCheckInWidget;