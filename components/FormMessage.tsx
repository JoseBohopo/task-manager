type MessageType = "success" | "error";

type FormMessageProps = {
  type: MessageType;
  message: string;
};

const config: Record<
  MessageType,
  { bg: string; text: string; icon: string; live: "assertive" | "polite" }
> = {
  error: {
    bg: "rgba(255, 59, 48, 0.1)",
    text: "var(--destructive)",
    live: "assertive",
    icon: "M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 5a1 1 0 0 1 1 1v4a1 1 0 1 1-2 0V8a1 1 0 0 1 1-1zm0 9a1.25 1.25 0 1 1 0-2.5A1.25 1.25 0 0 1 12 16z",
  },
  success: {
    bg: "rgba(52, 199, 89, 0.1)",
    text: "var(--success)",
    live: "polite",
    icon: "M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.707 7.293a1 1 0 0 1 0 1.414l-5 5a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L11 13.586l4.293-4.293a1 1 0 0 1 1.414 0z",
  },
};

export default function FormMessage({ type, message }: FormMessageProps) {
  const { bg, text, live, icon } = config[type];
  return (
    <div
      role="alert"
      aria-live={live}
      aria-atomic="true"
      className="flex items-center gap-2 rounded-[10px] px-3 py-2.5 text-[13px] font-medium"
      style={{ background: bg, color: text }}
    >
      <svg
        aria-hidden="true"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="shrink-0"
      >
        <path d={icon} />
      </svg>
      <span>{message}</span>
    </div>
  );
}
