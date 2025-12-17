import { useState } from "react";
import PropTypes from "prop-types";

export default function Input({
  label,
  type = "text",
  name,
  value,
  onChange,
  placeholder = "",
  error = "",
  className = "",
  ...props
}) {
  const [isFocused, setIsFocused] = useState(false);

  const inputStyles = `
    w-full bg-dark-secondary/50 border rounded-lg px-4 py-3 
    text-gray-100 placeholder-gray-500 font-mono outline-none transition-all duration-300
    backdrop-blur-sm
    ${
      error
        ? "border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]"
        : isFocused
        ? "border-neon-cyan shadow-[0_0_15px_rgba(0,255,255,0.3)] bg-dark-secondary/70"
        : "border-gray-700/50 hover:border-gray-600"
    }
    ${className}
  `;

  return (
    <div className="relative">
      {label && (
        <label
          htmlFor={name}
          className={`block text-xs font-medium mb-2 uppercase tracking-wider font-mono transition-colors duration-300 ${
            isFocused ? 'text-neon-cyan' : 'text-gray-400'
          }`}
        >
          {label}
        </label>
      )}
      <input
        id={name}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={inputStyles}
        {...props}
      />
      {error && (
        <p className="text-red-400 text-xs mt-2 animate-slide-down font-mono flex items-center gap-1">
          <span className="inline-block w-1 h-1 rounded-full bg-red-400"></span>
          {error}
        </p>
      )}
    </div>
  );
}

Input.propTypes = {
  label: PropTypes.string,
  type: PropTypes.string,
  name: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  error: PropTypes.string,
  className: PropTypes.string,
};
