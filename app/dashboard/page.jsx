"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import { Toaster, toast } from "sonner";
import Image from "next/image";

// Skeleton Loader Component
function SkeletonRow() {
  return (
    <tr className="animate-pulse border-b border-white/10">
      <td className="px-4 py-3">
        <div className="h-4 w-20 rounded bg-white/10"></div>
      </td>
      <td className="px-4 py-3">
        <div className="h-4 w-32 rounded bg-white/10"></div>
      </td>
      <td className="px-4 py-3">
        <div className="h-4 w-24 rounded bg-white/10"></div>
      </td>
      <td className="px-4 py-3">
        <div className="h-4 w-16 rounded bg-white/10"></div>
      </td>
      <td className="px-4 py-3">
        <div className="h-4 w-16 rounded bg-white/10"></div>
      </td>
      <td className="px-4 py-3">
        <div className="h-6 w-12 rounded-full bg-white/10"></div>
      </td>
      <td className="px-4 py-3">
        <div className="h-6 w-12 rounded-full bg-white/10"></div>
      </td>
      <td className="px-4 py-3">
        <div className="h-8 w-16 rounded bg-white/10"></div>
      </td>
      <td className="px-4 py-3">
        <div className="h-8 w-16 rounded bg-white/10"></div>
      </td>
      <td className="px-4 py-3">
        <div className="h-8 w-16 rounded bg-white/10"></div>
      </td>
    </tr>
  );
}

// Document Viewer Component
function DocumentViewer({ path, type }) {
  if (!path) {
    return <div className="text-sm text-white/50">No document available</div>;
  }

  const fullUrl = `https://server.scottypumpkin.com/${path}`;
  const fileExtension = path?.split(".")?.pop()?.toLowerCase() || "";
  const isPdf = fileExtension === "pdf";
  const isImage = ["jpg", "jpeg", "png", "gif", "webp"].includes(fileExtension);

  return (
    <div className="space-y-3">
      <div className="text-xs text-white/50 break-all">
        <span className="font-semibold">File:</span> {path}
      </div>

      {isImage ? (
        <div className="rounded-lg border border-white/10 overflow-hidden bg-black/30">
          <Image
            width={1000}
            height={1000}
            src={fullUrl}
            alt="Document"
            className="w-full h-auto max-h-96 object-contain"
            onError={(e) => {
              e.target.style.display = "none";
              if (e.target.nextElementSibling) {
                e.target.nextElementSibling.style.display = "block";
              }
            }}
          />
          <div
            style={{ display: "none" }}
            className="flex items-center justify-center h-48 bg-black/50 text-white/50 text-sm">
            Failed to load image
          </div>
        </div>
      ) : isPdf ? (
        <div className="rounded-lg border border-white/10 overflow-hidden bg-black/30">
          <iframe
            src={fullUrl}
            title="Document PDF"
            className="w-full h-96 bg-white"
          />
        </div>
      ) : (
        <div className="rounded-lg border border-white/10 bg-black/30 p-4 space-y-3">
          <div className="flex items-center gap-3">
            <div className="text-3xl">📄</div>
            <div>
              <p className="text-sm font-semibold text-white">
                {path.split("/").pop()}
              </p>
              <p className="text-xs text-white/50">
                File type: {fileExtension.toUpperCase()}
              </p>
            </div>
          </div>
          <a
            href={fullUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block rounded-lg border border-blue-400/40 bg-blue-400/15 px-3 py-1.5 text-xs font-semibold text-blue-300 hover:bg-blue-400/25 transition-all">
            Download File →
          </a>
        </div>
      )}
    </div>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [transferForms, setTransferForms] = useState([]);
  const [selectedForm, setSelectedForm] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [actionState, setActionState] = useState({
    open: false,
    type: "",
    item: null,
    loading: false,
  });

  async function loadBankTransferForms() {
    try {
      const response = await fetch("/api/bank-transfer", {
        method: "GET",
        cache: "no-store",
      });

      if (response.status === 401) {
        router.replace("/dashboard/login");
        return;
      }

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.message || "Failed to load bank transfer forms.");
      }

      setTransferForms(Array.isArray(data?.data) ? data.data : []);
    } catch (fetchError) {
      setTransferForms([]);
      toast.error(fetchError?.message || "Failed to load bank transfer forms.");
      console.error("Failed to load bank transfer forms:", fetchError);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleLogout() {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      router.replace("/dashboard/login");
      router.refresh();
    }
  }

  useEffect(() => {
    loadBankTransferForms();
  }, []);

  function openActionWarning(type, item) {
    setActionState({ open: true, type, item, loading: false });
  }

  function closeActionWarning() {
    if (actionState.loading) return;
    setActionState({ open: false, type: "", item: null, loading: false });
  }

  function openDetails(item) {
    setSelectedForm(item);
    setDetailsOpen(true);
  }

  async function runAdminAction() {
    const item = actionState.item;
    if (!item?.id) return;

    try {
      setActionState((prev) => ({ ...prev, loading: true }));

      let response;
      if (actionState.type === "verify") {
        response = await fetch("/api/bank-transfer", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: item.id,
            userAmount: item.userAmount,
            spumpCount: item.spumpCount,
            formVerification: true,
          }),
        });
      } else {
        response = await fetch(`/api/bank-transfer/approve/${item.id}`, {
          method: "POST",
        });
      }

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result?.message || "Action failed.");
      }

      toast.success(result?.message || "Action completed successfully.");

      await loadBankTransferForms();
      closeActionWarning();
    } catch (actionError) {
      toast.error(actionError?.message || "Failed to complete admin action.");
      setActionState((prev) => ({ ...prev, loading: false }));
    }
  }

  return (
    <section className="min-h-screen px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-8xl p-5 sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-lg border border-white/20 bg-white/5 px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-white/70 hover:bg-white/10">
            Logout
          </button>
        </div>
        <p className="mt-2 text-sm text-white/60">
          Bank transfer requests submitted by users will appear here.
          <br />
          You can verify the details of each request and approve them once
          verified.
          <br />
          Click on details to view additional information about each transfer
          request.
        </p>

        {isLoading ? (
          <div className="mt-6 overflow-hidden rounded-2xl border border-white/10 bg-black/20">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-white/10 text-left text-sm">
                <thead className="bg-white/5 text-white/70">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Name</th>
                    <th className="px-4 py-3 font-semibold">Email</th>
                    <th className="px-4 py-3 font-semibold">Mobile</th>
                    <th className="px-4 py-3 font-semibold">Amount</th>
                    <th className="px-4 py-3 font-semibold">SPUMP</th>
                    <th className="px-4 py-3 font-semibold">Verified</th>
                    <th className="px-4 py-3 font-semibold">Approved</th>
                    <th className="px-4 py-3 font-semibold">
                      Verify Documents
                    </th>
                    <th className="px-4 py-3 font-semibold">
                      Approve Transfer
                    </th>
                    <th className="px-4 py-3 font-semibold">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10 text-white/80">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <SkeletonRow key={`skeleton-${i}`} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="mt-6 overflow-hidden rounded-2xl border border-white/10 bg-black/20">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-white/10 text-left text-sm">
                <thead className="bg-white/5 text-white/70">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Name</th>
                    <th className="px-4 py-3 font-semibold">Email</th>
                    <th className="px-4 py-3 font-semibold">Mobile</th>
                    <th className="px-4 py-3 font-semibold">Amount</th>
                    <th className="px-4 py-3 font-semibold">SPUMP</th>
                    <th className="px-4 py-3 font-semibold">Verified</th>
                    <th className="px-4 py-3 font-semibold">Approved</th>
                    <th className="px-4 py-3 font-semibold">
                      Verify Documents
                    </th>
                    <th className="px-4 py-3 font-semibold">
                      Approve Transfer
                    </th>
                    <th className="px-4 py-3 font-semibold">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10 text-white/80">
                  {transferForms.length ? (
                    transferForms.map((item) => (
                      <tr key={item.id} className="align-top hover:bg-white/5">
                        <td className="px-4 py-3">{item.name || "-"}</td>
                        <td className="px-4 py-3">{item.email || "-"}</td>
                        <td className="px-4 py-3">
                          <div>
                            {item.mobileCode || "-"} {item.mobile || ""}
                          </div>
                        </td>
                        <td className="px-4 py-3">{item.userAmount ?? "-"}</td>
                        <td className="px-4 py-3">{item.spumpCount ?? "-"}</td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${item.formVerification ? "bg-emerald-400/15 text-emerald-300" : "bg-white/10 text-white/50"}`}>
                            {item.formVerification ? "Yes" : "No"}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${item.approveTransfer ? "bg-emerald-400/15 text-emerald-300" : "bg-white/10 text-white/50"}`}>
                            {item.approveTransfer ? "Yes" : "No"}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <button
                            type="button"
                            onClick={() => openActionWarning("verify", item)}
                            disabled={item.formVerification}
                            className="rounded-lg border border-amber-300/30 bg-amber-300/10 px-2.5 py-1.5 text-xs font-semibold text-amber-200 disabled:cursor-not-allowed disabled:opacity-40">
                            Verify
                          </button>
                        </td>
                        <td className="px-4 py-3">
                          <button
                            type="button"
                            onClick={() => openActionWarning("approve", item)}
                            disabled={item.approveTransfer}
                            className="rounded-lg border border-emerald-300/30 bg-emerald-300/10 px-2.5 py-1.5 text-xs font-semibold text-emerald-200 disabled:cursor-not-allowed disabled:opacity-40">
                            Approve
                          </button>
                        </td>
                        <td className="px-4 py-3">
                          <button
                            type="button"
                            onClick={() => openDetails(item)}
                            className="rounded-lg border border-white/20 bg-white/10 px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-white/20">
                            Details
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        className="px-4 py-6 text-center text-white/50"
                        colSpan={10}>
                        No bank transfer forms found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="w-[95vw] max-h-[90vh] max-w-4xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Transfer Details</DialogTitle>
            <DialogDescription>
              Complete information about the transfer request
            </DialogDescription>
          </DialogHeader>

          <div className="mt-5 grid grid-cols-1 gap-4 text-sm text-white/80 md:grid-cols-2">
            <div className="rounded-lg bg-white/5 border border-white/10 p-3">
              <span className="text-xs text-white/50 uppercase tracking-wider">
                Name
              </span>
              <p className="mt-1 font-semibold text-white">
                {selectedForm?.name || "-"}
              </p>
            </div>
            <div className="rounded-lg bg-white/5 border border-white/10 p-3">
              <span className="text-xs text-white/50 uppercase tracking-wider">
                Email
              </span>
              <p className="mt-1 break-all font-semibold text-white">
                {selectedForm?.email || "-"}
              </p>
            </div>
            <div className="rounded-lg bg-white/5 border border-white/10 p-3">
              <span className="text-xs text-white/50 uppercase tracking-wider">
                Mobile
              </span>
              <p className="mt-1 font-semibold text-white">
                {selectedForm?.mobileCode} {selectedForm?.mobile || "-"}
              </p>
            </div>
            <div className="rounded-lg bg-white/5 border border-white/10 p-3">
              <span className="text-xs text-white/50 uppercase tracking-wider">
                Amount
              </span>
              <p className="mt-1 font-semibold text-amber-300">
                ${selectedForm?.userAmount ?? "-"}
              </p>
            </div>
            <div className="rounded-lg bg-white/5 border border-white/10 p-3">
              <span className="text-xs text-white/50 uppercase tracking-wider">
                SPUMP
              </span>
              <p className="mt-1 font-semibold text-amber-300">
                {selectedForm?.spumpCount ?? "-"}
              </p>
            </div>
            <div className="rounded-lg bg-white/5 border border-white/10 p-3">
              <span className="text-xs text-white/50 uppercase tracking-wider">
                Status
              </span>
              <div className="mt-2 flex gap-2">
                <span
                  className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${
                    selectedForm?.formVerification
                      ? "bg-emerald-400/15 text-emerald-300"
                      : "bg-white/10 text-white/50"
                  }`}>
                  Verified: {selectedForm?.formVerification ? "✓" : "✗"}
                </span>
                <span
                  className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${
                    selectedForm?.approveTransfer
                      ? "bg-emerald-400/15 text-emerald-300"
                      : "bg-white/10 text-white/50"
                  }`}>
                  Approved: {selectedForm?.approveTransfer ? "✓" : "✗"}
                </span>
              </div>
            </div>
            <div className="rounded-lg bg-white/5 border border-white/10 p-3">
              <span className="text-xs text-white/50 uppercase tracking-wider">
                ID
              </span>
              <p className="mt-1 break-all font-mono text-xs text-white">
                {selectedForm?.id || "-"}
              </p>
            </div>
            <div className="rounded-lg bg-white/5 border border-white/10 p-3">
              <span className="text-xs text-white/50 uppercase tracking-wider">
                Reference
              </span>
              <p className="mt-1 font-mono text-xs text-white">
                {selectedForm?.referenceNo || "-"}
              </p>
            </div>
            <div className="rounded-lg bg-white/5 border border-white/10 p-3 md:col-span-2">
              <span className="text-xs text-white/50 uppercase tracking-wider">
                Wallet Address
              </span>
              <p className="mt-1 break-all font-mono text-xs text-white">
                {selectedForm?.walletAddress || "-"}
              </p>
            </div>
            <div className="rounded-lg bg-white/5 border border-white/10 p-3">
              <span className="text-xs text-white/50 uppercase tracking-wider">
                Created
              </span>
              <p className="mt-1 text-xs text-white">
                {selectedForm?.created_at || "-"}
              </p>
            </div>
          </div>

          {/* Document Section */}
          <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-4">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.12em] text-white/50">
              Transfer Receipt Document
            </p>
            <DocumentViewer path={selectedForm?.receiptPath} type="receipt" />
          </div>

          <div className="mt-6 flex justify-end">
            <DialogClose asChild>
              <button
                type="button"
                className="rounded-lg border border-white/20 px-4 py-2 text-sm text-white/80 hover:bg-white/10">
                Close
              </button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={actionState.open}
        onOpenChange={(open) => {
          if (!open) {
            closeActionWarning();
          }
        }}>
        <DialogContent className="max-w-lg border-amber-300/30 bg-[#1a1020]">
          <DialogHeader>
            <DialogTitle className="text-amber-200">
              Warning: Confirm Admin Action
            </DialogTitle>
            <DialogDescription className="text-white/75">
              {actionState.type === "verify"
                ? "You are about to verify this bank transfer form."
                : "You are about to approve this bank transfer request."}
            </DialogDescription>
          </DialogHeader>

          <div className="mt-3 rounded-xl border border-white/10 bg-white/5 p-3 text-xs text-white/70">
            <div>Name: {actionState.item?.name || "-"}</div>
            <div>Email: {actionState.item?.email || "-"}</div>
            <div>Amount: {actionState.item?.userAmount ?? "-"}</div>
            <div>SPUMP: {actionState.item?.spumpCount ?? "-"}</div>
          </div>

          <div className="mt-5 flex justify-end gap-2">
            <button
              type="button"
              onClick={closeActionWarning}
              disabled={actionState.loading}
              className="rounded-lg border border-white/20 px-4 py-2 text-sm text-white/80 disabled:opacity-50">
              Cancel
            </button>
            <button
              type="button"
              onClick={runAdminAction}
              disabled={actionState.loading}
              className="rounded-lg border border-amber-300/40 bg-amber-300/15 px-4 py-2 text-sm font-semibold text-amber-100 disabled:opacity-50">
              {actionState.loading ? "Processing..." : "Confirm Action"}
            </button>
          </div>
        </DialogContent>
      </Dialog>

      <Toaster position="top-right" richColors closeButton />
    </section>
  );
}
