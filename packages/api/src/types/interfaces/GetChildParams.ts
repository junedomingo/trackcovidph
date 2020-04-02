export interface GetChildParams {
  child: string;
  parent: string | null;
  features: any;
  caseIDFieldName: string;
  sexFieldName: string;
}

export interface GetSiblingParams {
  caseID: string;
  sibling: string | null;
  features: any;
  caseIDFieldName: string;
  sexFieldName: string;
}
