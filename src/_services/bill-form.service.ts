import { useState } from "react";
import { BehaviorSubject } from "rxjs";

 class BillFormService {
    tgthdBillForm = new BehaviorSubject(0)
    
    getTgthdBillForm() {
        return this.tgthdBillForm.value
    }    
    setTgthdBillForm(v) {
        return this.tgthdBillForm.next(v)
    }
}

export const billFormService = new BillFormService()