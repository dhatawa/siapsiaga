import { useRef } from 'react';

const OTP_LENGTH = 6;

/**
 * Input kode OTP 6 digit (satu kotak per digit, mendukung paste & backspace)
 */
export default function OtpInput({ value, onChange, disabled = false }) {
  const inputsRef = useRef([]);
  const digits = Array.from({ length: OTP_LENGTH }, (_, i) => value[i] || '');

  const focusAt = (index) => {
    inputsRef.current[Math.max(0, Math.min(OTP_LENGTH - 1, index))]?.focus();
  };

  const setDigits = (next) => onChange(next.join('').slice(0, OTP_LENGTH));

  const handleChange = (index) => (e) => {
    const typed = e.target.value.replace(/\D/g, '');
    if (!typed) return;

    const next = [...digits];
    typed.split('').forEach((d, i) => {
      if (index + i < OTP_LENGTH) next[index + i] = d;
    });
    setDigits(next);
    focusAt(index + typed.length);
  };

  const handleKeyDown = (index) => (e) => {
    if (e.key === 'Backspace') {
      e.preventDefault();
      const next = [...digits];
      if (next[index]) {
        next[index] = '';
      } else if (index > 0) {
        next[index - 1] = '';
        focusAt(index - 1);
      }
      setDigits(next);
    } else if (e.key === 'ArrowLeft') {
      focusAt(index - 1);
    } else if (e.key === 'ArrowRight') {
      focusAt(index + 1);
    }
  };

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH);
    if (!pasted) return;
    e.preventDefault();
    onChange(pasted);
    focusAt(pasted.length);
  };

  return (
    <div className="flex items-center justify-between gap-2" onPaste={handlePaste}>
      {digits.map((digit, i) => (
        <input
          key={i}
          ref={(el) => (inputsRef.current[i] = el)}
          type="text"
          inputMode="numeric"
          autoComplete={i === 0 ? 'one-time-code' : 'off'}
          maxLength={OTP_LENGTH}
          value={digit}
          disabled={disabled}
          autoFocus={i === 0}
          onChange={handleChange(i)}
          onKeyDown={handleKeyDown(i)}
          onFocus={(e) => e.target.select()}
          aria-label={`Digit OTP ke-${i + 1}`}
          className={`w-11 h-12 text-center text-lg font-bold rounded-lg border outline-none transition focus:ring-2 focus:ring-primary-700/20 focus:border-primary-700 disabled:opacity-60 ${
            digit ? 'border-primary-700 text-primary-700 bg-primary-50' : 'border-gray-300 text-gray-900'
          }`}
        />
      ))}
    </div>
  );
}

export { OTP_LENGTH };
