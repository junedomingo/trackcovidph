export interface GraphNode {
  id: string;
  group: string;
  color?: string;
  patientCaseID?: string;
  patientResidence?: string;
}

export interface GraphLink {
  source: string;
  target: string;
}
