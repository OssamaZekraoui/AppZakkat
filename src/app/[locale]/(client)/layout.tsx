import Chatbot from "@/components/chat/Chatbot";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}<Chatbot /></>;
}
