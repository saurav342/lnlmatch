export interface PotentialInvestor {
    _id: string;
    serialNumber?: string;
    companyName: string;
    website: string;
    companyLinkedinUrl: string;
    twitterUrl: string;
    industry: string;
    stageOfInvestment: string;
    firstName: string;
    lastName: string;
    email: string;
    personLinkedinUrl: string;
    authentic: string;
    notes: string;
    adminNotes?: string;
    status: 'pending' | 'verified' | 'approved' | 'rejected';
    createdAt: string;
}
