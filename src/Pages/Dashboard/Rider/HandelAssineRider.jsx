import { useCallback } from "react";

const useHandleAssignedRider = (axiosSecure, rider = {}) => {
  const riderId = rider?._id || rider?.id;

  const syncTracking = useCallback(
    async (parcel, event = {}) => {
      const trackingCode = parcel?._id || parcel?.id || parcel?.trackingCode;
      if (!trackingCode) return null;

      const isPaid =
        parcel?.paymentStatus === "Paid" || parcel?.paid === true;

      const payload = {
        trackingCode,
        parcelId: parcel?._id || parcel?.id,
        parcelName: parcel?.parcelName || parcel?.title || "Parcel",
        receiverName: parcel?.receiverName || parcel?.recipientName || "",
        receiverAddress:
          parcel?.receiverAddress || parcel?.deliveryAddress || "",
        amount: parcel?.deliveryCost || parcel?.amount?.cod || 0,
        paymentStatus: parcel?.paymentStatus || "Unpaid",
        paid: isPaid,
        paidAt: parcel?.paidAt || (isPaid ? new Date().toISOString() : null),
        status: event.status || (isPaid ? "Paid" : parcel?.status || "Pending"),
        assignmentStatus:
          parcel?.assignmentStatus || event.assignmentStatus || "",
        assignedRiderId: parcel?.assignedRiderId || riderId || "",
        assignedRiderName:
          parcel?.assignedRiderName || rider?.name || rider?.fullName || "",
        assignedRiderPhone:
          parcel?.assignedRiderPhone || rider?.phone || rider?.mobile || "",
        assignedRiderEmail:
          parcel?.assignedRiderEmail || rider?.email || "",
        event: {
          type: event.type || "update",
          assignmentStatus: event.assignmentStatus || "",
          message: event.message || "Tracking updated.",
          at: event.at || new Date().toISOString(),
        },
      };

      const res = await axiosSecure.post("/trackings", payload);
      return res.data;
    },
    [axiosSecure, riderId, rider]
  );

  const acceptDelivery = useCallback(
    async (parcel) => {
      const id = parcel?._id || parcel?.id || parcel?.trackingCode;
      if (!id) return null;
      const acceptedAt = new Date().toISOString();
      const updated = {
        ...parcel,
        assignmentStatus: "accepted",
        riderAcceptedAt: acceptedAt,
      };
      await axiosSecure.patch(`/parceals/${id}`, {
        assignmentStatus: "accepted",
        riderAcceptedAt: acceptedAt,
      });
      return syncTracking(updated, {
        type: "assignment",
        assignmentStatus: "accepted",
        message: "Rider accepted the delivery.",
      });
    },
    [axiosSecure, syncTracking]
  );

  const rejectDelivery = useCallback(
    async (parcel, rejectedRiderIds = []) => {
      const id = parcel?._id || parcel?.id || parcel?.trackingCode;
      if (!id) return null;
      const updated = { ...parcel, assignmentStatus: "rejected" };
      await axiosSecure.patch(`/parceals/${id}`, {
        assignedRiderId: null,
        assignedRiderName: null,
        assignedRiderPhone: null,
        assignedRiderEmail: null,
        riderAssignedAt: null,
        assignmentStatus: "rejected",
        rejectedRiderIds,
      });
      return syncTracking(updated, {
        type: "assignment",
        assignmentStatus: "rejected",
        message: "Rider rejected the delivery.",
      });
    },
    [axiosSecure, syncTracking]
  );

  const handlePaidDelivery = useCallback(
    async (parcel) => {
      const id = parcel?._id || parcel?.id || parcel?.trackingCode;
      const paidAt = new Date().toISOString();
      if (id) {
        await axiosSecure.patch(`/parceals/${id}`, {
          paymentStatus: "Paid",
          paid: true,
          paidAt,
        });
      }
      return syncTracking(
        { ...parcel, paymentStatus: "Paid", paid: true, paidAt },
        {
          type: "payment",
          status: "Paid",
          message: "Payment received for this delivery.",
        }
      );
    },
    [axiosSecure, syncTracking]
  );

  return { syncTracking, acceptDelivery, rejectDelivery, handlePaidDelivery };
};

export default useHandleAssignedRider;
export { useHandleAssignedRider };