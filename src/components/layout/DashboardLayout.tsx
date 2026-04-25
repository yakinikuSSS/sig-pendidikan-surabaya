import type { ReactNode } from "react";

interface Props{
    children: ReactNode;
}

export default function DashboardLayout({ children }: Props){
    return(
        <div style={{height: "100vh", width: "100%"}}>
            {children}
        </div>
    );
}