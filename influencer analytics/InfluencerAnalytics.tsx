import { useEffect } from 'react'
import { useInView } from 'react-intersection-observer'
import { useInfluencerData } from '../hooks/useInfluencerData'
import {
  useReactTable,
  getCoreRowModel,
  createColumnHelper
} from '@tanstack/react-table'
 
export const InfluencerAnalytics = () => {
  const { data, fetchNextPage, hasNextPage, isFetching } = useInfluencerData()
  const { ref, inView } = useInView()
  
  useEffect(() => {
    if (inView && hasNextPage && !isFetching) {
      fetchNextPage()
    }
  }, [inView, hasNextPage, isFetching])
  
  const columnHelper = createColumnHelper<any>()
  const columns = [
    columnHelper.accessor('name', {
      cell: info => info.getValue(),
      header: 'Name'
    }),
    columnHelper.accessor('followers', {
      cell: info => info.getValue().toLocaleString(),
      header: 'Followers'
    }),
    columnHelper.accessor('engagement_rate', {
      cell: info => `${info.getValue()}%`,
      header: 'Engagement'
    })
  ]
  
  const flatData = data?.pages.flatMap(page => page.data) ?? []
  
  const table = useReactTable({
    data: flatData,
    columns,
    getCoreRowModel: getCoreRowModel()
})
  
return (
  <div className="overflow-x-auto">
    <table className="w-full">
      {/* Table implementation */}
      <tbody>
      {table.getRowModel().rows.map(row => (
            <tr key={row.id}>
              {row.getVisibleCells().map(cell => (
                <td key={cell.id} className="p-2">
                  {cell.renderCell()}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div ref={ref} className="h-10" />
      {isFetching && (
        <div className="text-center p-4">Loading more...</div>
      )}
    </div>
  )
}