"use client"
import { usePathname } from "next/navigation";

const pathComponent = () => {
    const pathname = usePathname()
    const paths = ["/login", "/register"]

    const res = paths.includes(pathname)

    return res
}

export default pathComponent