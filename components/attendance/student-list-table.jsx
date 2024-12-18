import React, { useState } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp } from 'lucide-react'

export function StudentListTable({ students, selectedKeys, setSelectedKeys }) {
  const [isExpanded, setIsExpanded] = useState(true)

  const sortedStudents = [...students].sort((a, b) => {
    const aNum = parseInt(a.rollNumber.replace(/\D/g, ''), 10)
    const bNum = parseInt(b.rollNumber.replace(/\D/g, ''), 10)
    return aNum - bNum
  })

  const toggleExpand = () => {
    setIsExpanded(!isExpanded)
  }

  const toggleSelectAll = (checked) => {
    if (checked) {
      setSelectedKeys(new Set(students.map(student => student._id)))
    } else {
      setSelectedKeys(new Set())
    }
  }

  const toggleStudentSelection = (studentId) => {
    setSelectedKeys(prev => {
      const newSet = new Set(prev)
      if (newSet.has(studentId)) {
        newSet.delete(studentId)
      } else {
        newSet.add(studentId)
      }
      return newSet
    })
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>Students List</CardTitle>
        <Button
          variant="outline"
          size="sm"
          onClick={toggleExpand}
        >
          {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>
      </CardHeader>
      <CardContent>
        {isExpanded && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Roll Number</TableHead>
                <TableHead>Name</TableHead>
                <TableHead className="text-right">
                  <Checkbox
                    checked={selectedKeys.size === students.length}
                    onCheckedChange={toggleSelectAll}
                  />
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedStudents.map((student) => (
                <TableRow
                  key={student._id}
                  className="cursor-pointer"
                  onClick={() => toggleStudentSelection(student._id)}
                >
                  <TableCell>{student.rollNumber}</TableCell>
                  <TableCell>{student.name}</TableCell>
                  <TableCell className="text-right">
                    <Checkbox
                      checked={selectedKeys.has(student._id)}
                      onCheckedChange={(checked) => {
                        toggleStudentSelection(student._id)
                      }}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}

