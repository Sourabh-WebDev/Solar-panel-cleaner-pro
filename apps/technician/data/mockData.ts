import { acceptedJobs, jobs, technicianStats } from "../../../shared/api/api";
import type { TechnicianJob } from "../navigation/types";

const fallbackPhone = "+91 98765 43000";

export const incomingRequests: TechnicianJob[] = jobs.map((job: any, index: number) => ({
    id: job.id,
    customer: job.customer,
    service: job.service,
    address: job.address,
    payout: job.payout,
    status: "New Request",
    scheduledTime: index === 0 ? "Today, 3:30 PM" : "Today, 5:15 PM",
    distance: index === 0 ? "2.8 km away" : "4.1 km away",
    phone: fallbackPhone,
    notes: "Customer prefers a quick inspection before wash.",
}));

export const assignedJobs: TechnicianJob[] = acceptedJobs.map((job: any, index: number) => ({
    id: job.id,
    customer: job.customer,
    service: job.service,
    address: job.address,
    payout: job.payout,
    status: job.status,
    scheduledTime: job.scheduledTime,
    distance: index === 0 ? "1.2 km away" : index === 1 ? "6.4 km away" : "Completed",
    phone: index === 0 ? "+91 98110 22011" : index === 1 ? "+91 99887 66554" : "+91 99224 81021",
    notes:
        index === 0
            ? "Panel access is through the rear gate."
            : index === 1
              ? "Customer requested pre-arrival call."
              : "Maintenance checklist already completed.",
}));

export const dashboardStats = [
    {
        label: "Today earnings",
        value: `Rs ${technicianStats.earnings.toLocaleString("en-IN")}`,
        helper: "Across all completed jobs",
    },
    {
        label: "Accepted jobs",
        value: `${technicianStats.acceptedJobs}`,
        helper: "Current success momentum",
    },
    {
        label: "Completion rate",
        value: `${technicianStats.completionRate}%`,
        helper: "Based on recent bookings",
    },
];

export const weeklyEarnings = technicianStats.weeklyEarnings;
export const weeklyJobs = technicianStats.weeklyJobs;
