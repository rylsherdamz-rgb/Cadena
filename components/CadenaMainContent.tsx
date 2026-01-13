"use client"

import TopHeaderCadenaComponent from "./TopHeaderCadenaComponent"
import VotingComponent from "./VotingComponent"

export default function CadenaMainContent() {
    return <div className="w-full h-[70vh] bg-gray-50 rounded-2xl overflow-y-auto">
        <div className="px-5 py-4">
            <TopHeaderCadenaComponent />
        </div>
        <div className="px-5 py-4 border-t border-gray-200">
            <VotingComponent />
        </div>
    </div>
}