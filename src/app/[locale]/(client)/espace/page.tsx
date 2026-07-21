import { useLocale } from "next-intl";
import Navbar from "@/components/home/Navbar";
import Footer from "@/components/home/Footer";
import AuthGate from "@/components/auth/AuthGate";
import UserSpace from "@/components/account/UserSpace";

export default function UserSpacePage() {
  const locale = useLocale();
  return <><Navbar /><AuthGate locale={locale}><UserSpace locale={locale} /></AuthGate><Footer /></>;
}
