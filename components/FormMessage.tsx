type MessageType = "success" | "error";

type FormMessageProps = {
  type: MessageType;
  message: string;
};

const styles: Record<MessageType, string> = {
  success: "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  error: "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

export default function FormMessage({ type, message }: FormMessageProps) {
  return (
    <p role="alert" className={`rounded-md px-3 py-2 text-sm ${styles[type]}`}>
      {message}
    </p>
  );
}
