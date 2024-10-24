'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Download, FileText } from "lucide-react"

// Sample data for VPN config files
const vpnConfigs = [
  { id: 1, name: "US-West.ovpn", size: "4.2 KB", date: "2023-10-15" },
  { id: 2, name: "US-East.ovpn", size: "4.1 KB", date: "2023-10-15" },
  { id: 3, name: "Europe-London.ovpn", size: "4.3 KB", date: "2023-10-16" },
  { id: 4, name: "Europe-Frankfurt.ovpn", size: "4.2 KB", date: "2023-10-16" },
  { id: 5, name: "Asia-Tokyo.ovpn", size: "4.1 KB", date: "2023-10-17" },
  { id: 6, name: "Australia-Sydney.ovpn", size: "4.2 KB", date: "2023-10-17" },
]

export function VpnConfigGridComponent() {
  return (
    <section className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">OpenVPN Configuration Files</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {vpnConfigs.map((config) => (
          <Card key={config.id} className="flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                {config.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Size: {config.size}</p>
              <p className="text-sm text-muted-foreground">Updated: {config.date}</p>
            </CardContent>
            <CardFooter className="mt-auto">
              <Button className="w-full">
                <Download className="mr-2 h-4 w-4" /> Download
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  )
}