import type {FeedItem,Race,Track} from '../types/domain';
export const tracks:Track[]=[
{id:'pomposa',name:'Circuito di Pomposa',city:'San Giuseppe di Comacchio',region:'Emilia-Romagna',lat:44.664,lng:12.184,imageUrl:'https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=1200&q=80'},
{id:'lonato',name:'South Garda Karting',city:'Lonato del Garda',region:'Lombardia',lat:45.447,lng:10.477,imageUrl:'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=1200&q=80'}];
export const races:Race[]=[
{id:'r1',title:'500 Miglia di Pomposa',track:tracks[0],startsAt:'2026-11-14T09:00:00+01:00',format:'Endurance',entryFee:600,registered:18,capacity:24,registrationMode:'karthub_booking'},
{id:'r2',title:'SWS Sprint Night',track:tracks[1],startsAt:'2026-11-28T18:30:00+01:00',format:'Sprint',entryFee:85,registered:20,capacity:30,registrationMode:'listed',externalUrl:'https://example.com'}];
export const feed:FeedItem[]=[
{id:'f1',driver:'Luca Bianchi',action:'ha conquistato il podio',detail:'2° posto alla Sprint Cup di Pomposa',time:'2 ore fa',initials:'LB'},
{id:'f2',driver:'Giulia Riva',action:'parteciperà a una gara',detail:'500 Miglia di Pomposa',time:'5 ore fa',initials:'GR'},
{id:'f3',driver:'Marco Ferri',action:'ha migliorato il ranking',detail:'Ora è #12 in Italia',time:'Ieri',initials:'MF'}];
