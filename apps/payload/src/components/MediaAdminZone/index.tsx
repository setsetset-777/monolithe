'use client'

import { useAuth } from '@payloadcms/ui'
import { AfterListClientProps } from 'payload'
import AdminZone from '@/components/AdminZone'
import RegenerateMediaButton from '@/components/RegenerateMediaButton'

export default function MediaAdminZone(props: AfterListClientProps) {
  const { user } = useAuth()

  if (!user || user.role !== 'admin') {
    return null
  }

  return (
    <AdminZone>
      <RegenerateMediaButton />
    </AdminZone>
  )
}
