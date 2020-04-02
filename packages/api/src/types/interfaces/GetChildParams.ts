export interface GetChildParams {
  child: string;
  parent: string | null;
  features: any;
  idStrAttr: string;
  sexStrAttr: string;
}

export interface GetSiblingParams {
  id: string;
  sibling: string | null;
  features: any;
  idStrAttr: string;
  sexStrAttr: string;
}
