import {Flag,MapPinned,Medal,Radio,UserRound} from 'lucide-react';
import {NavLink,Outlet} from 'react-router-dom';
const nav=[['/',Radio,'Feed'],['/races',Flag,'Gare'],['/ranking',Medal,'Ranking'],['/map',MapPinned,'Mappa'],['/profile',UserRound,'Profilo']] as const;
export default function Layout(){return <div className="shell"><header><div className="brand"><span>K</span>KART<span>HUB</span></div><div className="status">ITALIA · BETA</div></header><main><Outlet/></main><nav>{nav.map(([to,Icon,label])=><NavLink key={to} to={to} end={to==='/' }><Icon size={21}/><small>{label}</small></NavLink>)}</nav></div>}
