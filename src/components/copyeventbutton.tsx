"use client"

import { useState } from "react";
import { Button, ButtonProps } from "./ui/button";
import { Copy, CopyCheck, CopyX } from "lucide-react";
type CopyState = "idle" | "copied" | "error"
export default function CopyEventButton({
    eventId,
    clerkUserId,
    ...buttonProps
} : Omit<ButtonProps, "children"| "onclick"> & {eventId: string; clerkUserId: string} ) {
    const [copyState, setCopyState] = useState<CopyState>("idle")
    const CopyIcon = getCopyState(copyState) 
    return(
        <Button {...buttonProps} onClick={() => {
            navigator.clipboard.writeText(`${location.origin}/book/${clerkUserId}/${eventId}`)
            .then(() => {
                setCopyState("copied")
                setTimeout(() => setCopyState("idle"), 2000)
            }).catch((err) => {
                setCopyState("idle")
                setTimeout(() => setCopyState("idle"), 2000)
            })
        }}>
            <CopyIcon className="size-4"/>
            {getChildren(copyState)}
        </Button>
    )
}

function getCopyState(copyState: CopyState) {
    switch (copyState) {
        case "idle":
            return Copy
        case "copied":
            return CopyCheck
        case "error":
            return CopyX
    }
}

function getChildren(copyState: CopyState){
    switch (copyState) {
        case "idle":
            return "Copy"
        case "copied":
            return "Copied"
        case "error":
            return "Error Copying"
    }
}