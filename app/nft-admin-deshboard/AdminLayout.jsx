// app/nft-admin-deshboard/layout.jsx
// এই file টা তৈরি করুন — navbar/footer hide করবে

export default function AdminLayout({ children }) {
  return (
    <div className="fixed inset-0 z-[999] bg-gray-50 overflow-auto">
      {children}
    </div>
  );
}
