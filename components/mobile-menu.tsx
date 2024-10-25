'use client'

import { useState } from 'react'
import { Menu } from 'lucide-react'
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[240px] sm:w-[300px]">
          <SheetHeader>
            <SheetTitle>Menu</SheetTitle>
          </SheetHeader>
          <nav className="flex flex-col space-y-4 mt-4">
            <a href="#" className="text-sm font-medium hover:underline">Home</a>
            <a href="#" className="text-sm font-medium hover:underline">About</a>
            <a href="#" className="text-sm font-medium hover:underline">Contact</a>
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  )
}