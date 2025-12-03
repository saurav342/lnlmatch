export interface PotentialInvestor {
    _id: string;
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
    batch: 'P1' | 'B1';
    status: 'pending' | 'reviewed' | 'approved' | 'rejected';
    createdAt: string;
}
