import acCleaning from "../../assets/services/ac-cleaning.png";
import gasRefill from "../../assets/services/gas-refill.png";
import jetCleaning from "../../assets/services/jet-cleaning.png";

export const services = [
    {
        id: 1,
        name: "Panel Foam Cleaning",
        price: 699,
        image: acCleaning
    },
    {
        id: 2,
        name: "Panel Jet Cleaning",
        price: 999,
        image: jetCleaning
    },
    {
        id: 3,
        name: "Panel Maintenance",
        price: 2499,
        image: gasRefill
    }
];

export const orders = [
    {
        id: "ORD001",
        service: "Panel Foam Cleaning",
        status: "Assigned",
        technician: "Rahul Kumar",
        date: "12 March",
        slot: "11:00 AM - 1:00 PM"
    }
];

export const jobs = [
    {
        id: "JOB101",
        customer: "Amit Sharma",
        service: "Panel Foam Cleaning",
        address: "Raj Nagar, Ghaziabad",
        payout: 550
    },
    {
        id: "JOB102",
        customer: "Neha Verma",
        service: "Panel Jet Cleaning",
        address: "Vaishali, Ghaziabad",
        payout: 700
    }
];

export const technicianStats = {
    earnings: 18450,
    acceptedJobs: 28,
    rejectedJobs: 5,
    completionRate: 85,
    weeklyEarnings: [3200, 4100, 2800, 5200, 3150],
    weeklyJobs: [4, 6, 3, 7, 5]
};

export const acceptedJobs = [
    {
        id: "JOB084",
        customer: "Sonia Arora",
        service: "Panel Foam Cleaning",
        address: "Indirapuram, Ghaziabad",
        payout: 650,
        status: "In Progress",
        scheduledTime: "Today, 4:00 PM"
    },
    {
        id: "JOB079",
        customer: "Rakesh Jain",
        service: "Panel Jet Cleaning",
        address: "Crossings Republik, Ghaziabad",
        payout: 780,
        status: "Accepted",
        scheduledTime: "Tomorrow, 10:30 AM"
    },
    {
        id: "JOB073",
        customer: "Priya Mehta",
        service: "Panel Maintenance",
        address: "Noida Extension",
        payout: 1200,
        status: "Completed",
        scheduledTime: "11 March, 1:00 PM"
    }
];
