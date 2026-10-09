export type RegistrationMode = 'listed' | 'karthub_booking';
export interface Track { id:string; name:string; city:string; region:string; lat:number; lng:number; imageUrl:string; }
export interface Race { id:string; title:string; track:Track; startsAt:string; format:'Sprint'|'Endurance'|'Ironman'; entryFee:number; registered:number; capacity:number; registrationMode:RegistrationMode; externalUrl?:string; }
export interface FeedItem { id:string; driver:string; action:string; detail:string; time:string; initials:string; }
