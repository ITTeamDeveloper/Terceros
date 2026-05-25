import { useEffect, useState } from 'react'
import type { SidebarItem } from '../../../services/interfaces'
import { sidebarServices } from '../../../services/sidebarServices'


export function useSidebarNav() {
  const [primaryNav, setPrimaryNav] = useState<SidebarItem[]>([])
  
  const fetchSidebarItems = async () => {
    try {
      const items = await sidebarServices.listar()
      setPrimaryNav(items)
    } catch (error) {
      console.error('Error fetching sidebar items:', error)
    }
  }
  useEffect(() => {
    fetchSidebarItems()
  }, [])

  console.log('Sidebar items:', primaryNav)

  return { primaryNav }
}
