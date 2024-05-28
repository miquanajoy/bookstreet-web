import { useEffect, useState } from "react";
import { alertService } from "../_services";

export default function AlertComponent(prop) {
    if (prop.onAlert) {
        
        return (<div className="p-4 mb-4 text-sm text-blue-800 rounded-lg bg-blue-50 dark:bg-gray-800 dark:text-blue-400" role="alert">
            <span className="font-medium">{prop.content}</span>
        </div>)
    } else {
        return (<></>)
    }
}
