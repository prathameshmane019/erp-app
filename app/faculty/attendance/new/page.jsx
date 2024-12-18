'use client'

import { useState, useEffect, useMemo } from 'react'
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { AttendanceForm } from '@/components/attendance/attendance-form'
import { TGSessionContent } from '@/components/attendance/TGSessionContent'
import { CourseContent } from '@/components/attendance/course-content'
import { StudentListTable } from '@/components/attendance/student-list-table'
import { useAuth } from '@/lib/auth-context'
import api, { handleApiError } from '@/lib/api'

export default function AttendanceSystem() {
  const [profile, setProfile] = useState(null)
  const [selectedSubject, setSelectedSubject] = useState("")
  const [selectedBatch, setSelectedBatch] = useState(null)
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedSession, setSelectedSession] = useState([])
  const [isTableVisible, setIsTableVisible] = useState(false)
  const [students, setStudents] = useState([])
  const [selectedKeys, setSelectedKeys] = useState(new Set([]))
  const [selectedContentIds, setSelectedContentIds] = useState([])
  const [subjectDetails, setSubjectDetails] = useState(null)
  const [availableSessions, setAvailableSessions] = useState([])
  const [pointInputs, setPointInputs] = useState([{ id: Date.now(), value: '' }])
  const [tgSessions, setTgSessions] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      setProfile(user)
    }
  }, [user])

  const fetchSubjectDetails = async (subjectId, batchId) => {
    if (!subjectId) return

    setIsLoading(true)
    try {
      const response = await api.get('/v2/utils/attendance-data', {
        params: {
          _id: subjectId,
          batchId: batchId || ''
        }
      })

      const data = response.data
      if (data && data.subject) {
        setSubjectDetails(data.subject)
        setStudents(data.students || [])

        if (data.subject.subType === 'tg') {
          setTgSessions(data.subject.tgSessions || [])
          setPointInputs([{ id: Date.now(), value: '' }])
        }
      } else {
        throw new Error("Invalid response from server")
      }
    } catch (error) {
      handleApiError(error, "Failed to fetch subject details")
      setSubjectDetails(null)
      setStudents([])
      setTgSessions([])
      setPointInputs([{ id: Date.now(), value: '' }])
    } finally {
      setIsLoading(false)
    }
  }

  const fetchAvailableSessions = async (subjectId, batchId, date) => {
    if (!subjectId || !date) return

    setIsLoading(true)
    try {
      const response = await api.get('/utils/available-sessions', {
        params: {
          subjectId,
          batchId: batchId || '',
          date
        }
      })
      console.log(response);

      if (response.data && Array.isArray(response.data.availableSessions)) {
        setAvailableSessions(response.data.availableSessions)
      } else {
        throw new Error("Invalid response from server")
      }
    } catch (error) {
      handleApiError(error, "Failed to fetch available sessions")
      setAvailableSessions([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (selectedSubject && selectedDate) {
      fetchSubjectDetails(selectedSubject, selectedBatch)
      fetchAvailableSessions(selectedSubject, selectedBatch, selectedDate)
    }
  }, [selectedSubject, selectedBatch, selectedDate])

  const handleTakeAttendance = () => {
    setIsTableVisible(true)
  }

  const submitAttendance = async () => {
    // Validation checks
    if (!selectedSubject) {
      toast.error("Please select a subject")
      return
    }

    if (selectedSession.length === 0) {
      toast.error("Please select at least one session")
      return
    }

    // Prepare attendance data
    const presentStudentIds = Array.from(selectedKeys).filter(key => key !== "all")

    const attendanceData = {
      subject: selectedSubject,
      session: selectedSession,
      attendanceRecords: students.map(student => ({
        student: student._id,
        status: presentStudentIds.includes(student._id) ? 'present' : 'absent'
      })),
      batchId: selectedBatch,
      date: selectedDate,
      institute: profile?.institute._id,
      ...(subjectDetails.subType === 'tg'
        ? {
          pointsDiscussed: pointInputs
            .filter(point => point.value.trim())
            .map(point => point.value.trim())
        }
        : { contents: selectedContentIds })
    }

    setIsLoading(true)
    try {
      console.log(attendanceData);

      const response = await api.post('/v2/attendance', attendanceData)
      console.log(response.data);
      
      if (response.data ) {
        toast.success(response.data.message)
      } else {
        throw new Error("Unexpected response from server")
      }

      // Reset form state
      if (subjectDetails.subType === 'tg') {
        await fetchSubjectDetails(selectedSubject, selectedBatch)
      }
      
      setIsTableVisible(false)
      setSelectedKeys(new Set([]))
      setSelectedContentIds([])
      setSelectedSession([])
      setPointInputs([{ id: Date.now(), value: '' }])
    } catch (error) {
      handleApiError(error, "Failed to submit attendance")
    } finally {
      setIsLoading(false)
    }
  }

  // Memoize loading state to prevent unnecessary re-renders
  const isLoadingState = useMemo(() => isLoading, [isLoading])

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <AttendanceForm
        profile={profile}
        selectedSubject={selectedSubject}
        setSelectedSubject={setSelectedSubject}
        selectedBatch={selectedBatch}
        setSelectedBatch={setSelectedBatch}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        selectedSession={selectedSession}
        setSelectedSession={setSelectedSession}
        availableSessions={availableSessions}
        handleTakeAttendance={handleTakeAttendance}
        isLoading={isLoadingState}
      />

      {selectedSubject && subjectDetails && isTableVisible && (
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            {subjectDetails.subType === 'tg' ? (
              <TGSessionContent
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
                pointInputs={pointInputs}
                setPointInputs={setPointInputs}
                tgSessions={tgSessions}
              />
            ) : (
              <CourseContent
                subjectDetails={subjectDetails}
                selectedBatch={selectedBatch}
                selectedContentIds={selectedContentIds}
                setSelectedContentIds={setSelectedContentIds}
              />
            )}
          </div>
          <StudentListTable
            students={students}
            selectedKeys={selectedKeys}
            setSelectedKeys={setSelectedKeys}
          />
        </div>
      )}

      {isTableVisible && selectedSubject && subjectDetails && (
        <Button
          className="w-full md:w-auto"
          onClick={submitAttendance}
          disabled={isLoadingState}
        >
          {isLoadingState ? 'Submitting...' : 'Submit Attendance'}
        </Button>
      )}
    </div>
  )
}

