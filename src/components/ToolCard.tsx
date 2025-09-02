'use client';
import Link from 'next/link';
export default function ToolCard({title,href,description}:{title:string,href:string,description?:string}){
 return(<div className='border p-4 rounded bg-white shadow'><h3>{title}</h3>{description?<p>{description}</p>:null}<Link href={href} className='underline'>Open →</Link></div>);
}
 