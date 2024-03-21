// enums.tsx

// Define the enum for chit statuses
export const ChitStatus = {
  UPCOMING: "UPCOMING",
  ONGOING: "ONGOING",
  COMPLETED: "COMPLETED",
  OPENED: "OPENED",
};

// Utility function to filter chit list by status
export const filterChitsByStatus = (chits: any[], status: any) => {
  return chits.filter((item) => item.chitStatus === status);
};

export const Transaction = {
  ALL: "ALL",
  DEPOSIT: "DEPOSIT",
  WITHDRAW: "WITHDRAW",
};

export const Referral = {
  Code: "Code",
  Contacts: "Contacts",
};

export enum FaqStatus {
  ChitFund = "Digital Chits",
  DigitalGold = "Digital Gold",
  FundGurus = "Fund Gurus",
};

export const TutorialStatus = {
  Video: "Video",
  Blogs: "Blogs",
};

export const countryCode = {
  Code: "+91",
};

export const paymentTypes = {
  dueAmount: "due Amount",
  chitJoin: "chit join",
};
