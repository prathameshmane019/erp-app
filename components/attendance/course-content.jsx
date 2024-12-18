import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export function CourseContent({
  subjectDetails,
  selectedBatch,
  selectedContentIds,
  setSelectedContentIds
}) {
  const handleContentSelection = (contentId) => {
    setSelectedContentIds(prev =>
      prev.includes(contentId)
        ? prev.filter(id => id !== contentId)
        : [...prev, contentId]
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Course Content</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[100px]">Select</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {subjectDetails.content
              .filter((content) => {
                const batchStatus = subjectDetails.subType === 'practical'
                  ? content.batchStatus?.find(b => b.batchId === selectedBatch)
                  : null
                const isCovered = subjectDetails.subType === 'practical'
                  ? batchStatus?.status === 'covered'
                  : content.status === 'covered'
                return !isCovered
              })
              .map((content) => (
                <TableRow
                  key={content._id}
                  className="cursor-pointer"
                  onClick={() => handleContentSelection(content._id)}
                >
                  <TableCell>{content.title}</TableCell>
                  <TableCell>{content.description}</TableCell>
                  <TableCell>
                    {subjectDetails.subType === 'practical'
                      ? content.batchStatus?.find(b => b.batchId === selectedBatch)?.status || 'not_covered'
                      : content.status}
                  </TableCell>
                  <TableCell>
                    <Checkbox
                      checked={selectedContentIds.includes(content._id)}
                      onCheckedChange={() => handleContentSelection(content._id)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

