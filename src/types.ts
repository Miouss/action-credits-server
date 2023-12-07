export enum ActionName {
  INVITE = "Invite",
  SEND_MESSAGE = "Send Message",
  VISIT = "Visit",
}

export interface Action {
  name: ActionName;
  credits: number;
}
