// src/components/ui/input.tsx
export function Input(props) {
    return <input {...props} className={`border p-2 ${props.className}`} />;
  }
  