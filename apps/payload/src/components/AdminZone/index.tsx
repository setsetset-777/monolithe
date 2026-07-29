'use client'
import { PropsWithChildren } from 'react'
import './styles.scss'

export default function functionMediaAdminZone({ children }: PropsWithChildren) {
  return (
    <div className="admin-zone gutter gutter--left gutter--right">
      <div className="admin-zone__inner">
        <h3>Admin zone</h3>
        <div className="admin-zone__content">{children}</div>
      </div>
    </div>
  )
}
