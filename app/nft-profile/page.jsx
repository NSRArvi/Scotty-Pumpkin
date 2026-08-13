import ProfileClient from "./ProfileClient";

export const metadata = {
  title: "My Profile",
  description: "Manage your NFTs, listings, and SPUMP/USDC balance on Scotty Pumpkin.",
  // This is effectively a personal dashboard (shows whichever wallet is
  // connected) — not something search engines should index or that a
  // shared link's preview should promote as a landing page.
  robots: { index: false, follow: true },
};

export default function Page() {
  return <ProfileClient />;
}
