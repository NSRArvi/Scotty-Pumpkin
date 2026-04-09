"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import { Toaster, toast } from "sonner";

export default function DashboardPage() {
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

      const data = await response.json();

      console.log("Bank transfer forms response:", data);

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
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="mt-2 text-sm text-white/60">
          Bank transfer requests submitted by users will appear here.
          <br />
          You can verify the details of each request and approve them once
          verified. 
          <br />
          Click on details to view additional information about each
          transfer request.
        </p>

        {isLoading ? (
          <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-5 text-sm text-white/70">
            Loading bank transfer forms...
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
                            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${item.formVerification ? "bg-emerald-400/15 text-emerald-300" : "bg-white/10 text-white/50"}`}
                          >
                            {item.formVerification ? "Yes" : "No"}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${item.approveTransfer ? "bg-emerald-400/15 text-emerald-300" : "bg-white/10 text-white/50"}`}
                          >
                            {item.approveTransfer ? "Yes" : "No"}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <button
                            type="button"
                            onClick={() => openActionWarning("verify", item)}
                            disabled={item.formVerification}
                            className="rounded-lg border border-amber-300/30 bg-amber-300/10 px-2.5 py-1.5 text-xs font-semibold text-amber-200 disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            Verify
                          </button>
                        </td>
                        <td className="px-4 py-3">
                          <button
                            type="button"
                            onClick={() => openActionWarning("approve", item)}
                            disabled={item.approveTransfer}
                            className="rounded-lg border border-emerald-300/30 bg-emerald-300/10 px-2.5 py-1.5 text-xs font-semibold text-emerald-200 disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            Approve
                          </button>
                        </td>
                        <td className="px-4 py-3">
                          <button
                            type="button"
                            onClick={() => openDetails(item)}
                            className="rounded-lg border border-white/20 bg-white/10 px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-white/20"
                          >
                            Details
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        className="px-4 py-6 text-center text-white/50"
                        colSpan={10}
                      >
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
        <DialogContent className="w-[95vw] max-w-2xl">
          <DialogHeader>
            <DialogTitle>Transfer Details</DialogTitle>
            <DialogDescription>
              Additional fields hidden from the table view.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-5 grid grid-cols-1 gap-3 text-sm text-white/80 sm:grid-cols-2">
            <div>
              <span className="text-white/50">Name:</span>{" "}
              {selectedForm?.name || "-"}
            </div>
            <div>
              <span className="text-white/50">Email:</span>{" "}
              {selectedForm?.email || "-"}
            </div>
            <div>
              <span className="text-white/50">Mobile:</span>{" "}
              {selectedForm?.mobile || "-"}
            </div>
            <div>
              <span className="text-white/50">Mobile Code:</span>{" "}
              {selectedForm?.mobileCode || "-"}
            </div>
            <div>
              <span className="text-white/50">Amount:</span>{" "}
              {selectedForm?.userAmount ?? "-"}
            </div>
            <div>
              <span className="text-white/50">SPUMP:</span>{" "}
              {selectedForm?.spumpCount ?? "-"}
            </div>
            <div>
              <span className="text-white/50">Verified:</span>{" "}
              {selectedForm?.formVerification ? "Yes" : "No"}
            </div>
            <div>
              <span className="text-white/50">Approved:</span>{" "}
              {selectedForm?.approveTransfer ? "Yes" : "No"}
            </div>
            <div>
              <span className="text-white/50">ID:</span>{" "}
              {selectedForm?.id || "-"}
            </div>
            <div>
              <span className="text-white/50">Reference No:</span>{" "}
              {selectedForm?.referenceNo || "-"}
            </div>
            <div className="sm:col-span-2 break-all">
              <span className="text-white/50">Wallet:</span>{" "}
              {selectedForm?.walletAddress || "-"}
            </div>
            <div>
              <span className="text-white/50">Created At:</span>{" "}
              {selectedForm?.created_at || "-"}
            </div>
          </div>

          <div className="mt-5 rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-white/80">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-white/50">
              Documents
            </p>
            {/* <p className="break-all text-white/70">
              {selectedForm?.receiptPath || "No document path available."}
            </p> */}
            <img
              src={`https://server.scottypumpkin.com/${selectedForm?.receiptPath}`}
              alt="Receipt"
              srcset=""
            />
          </div>

          <div className="mt-6 flex justify-end">
            <DialogClose asChild>
              <button
                type="button"
                className="rounded-lg border border-white/20 px-4 py-2 text-sm text-white/80 hover:bg-white/10"
              >
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
        }}
      >
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
              className="rounded-lg border border-white/20 px-4 py-2 text-sm text-white/80 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={runAdminAction}
              disabled={actionState.loading}
              className="rounded-lg border border-amber-300/40 bg-amber-300/15 px-4 py-2 text-sm font-semibold text-amber-100 disabled:opacity-50"
            >
              {actionState.loading ? "Processing..." : "Confirm Action"}
            </button>
          </div>
        </DialogContent>
      </Dialog>

      <Toaster position="top-right" richColors closeButton />
    </section>
  );
}
