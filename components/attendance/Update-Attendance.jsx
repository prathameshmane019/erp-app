'use client'
import { useState, useEffect, useCallback } from 'react' 
import { Button } from "@/components/ui/button"
import { toast } from "sonner" 
import { TGSessionContent } from './TGSessionContent'
import { CourseContent } from './course-content'
import { StudentListTable } from './student-list-table'
import { useAuth } from '@/lib/auth-context'
import { Card, CardContent } from "@/components/ui/card"
import { Loader2 } from 'lucide-react'
import api from '@/lib/api'
import { UpdateAttendanceForm } from './update-attendance-form'

export function UpdateAttendanceSystem() {
  const [profile, setProfile] = useState(null)
  const [selectedSubject, setSelectedSubject] = useState("")
  const [selectedBatch, setSelectedBatch] = useState(null)
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedSession, setSelectedSession] = useState(null)
  const [isTableVisible, setIsTableVisible] = useState(false)
  const [students, setStudents] = useState([])
  const [selectedKeys, setSelectedKeys] = useState(new Set([]))
  const [selectedContentIds, setSelectedContentIds] = useState([])
  const [subjectDetails, setSubjectDetails] = useState(null)
  const [availableSessions, setAvailableSessions] = useState([1,2,3,4,5,6,7])
  const [pointInputs, setPointInputs] = useState([{ id: Date.now(), value: '' }])
  const [tgSessions, setTgSessions] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [attendanceRecord, setAttendanceRecord] = useState(null)

  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      setProfile(user)
    }
  }, [user])

  const resetForm = useCallback(() => {
    setSelectedBatch(null)
    setIsTableVisible(false)
    setSelectedKeys(new Set([]))
    setSelectedContentIds([])
    setSubjectDetails(null)
    setSelectedSession(null)
    setSelectedSubject("")
    setPointInputs([{ id: Date.now(), value: '' }])
    setSelectedDate("")
    setAttendanceRecord(null)
  }, [])

  const fetchSubjectDetails = useCallback(async (subjectId, batchId, date, session) => {
    if (!subjectId || !date || !session) return

    setIsLoading(true)
    try {
      const response = await api.get('/v2/update-attendance', {
        params: {
          _id: subjectId,
          batchId: batchId || '',
          date,
          session
        }
      })
      const { subject, students, attendanceRecord } = response.data
      setSubjectDetails(subject)
      setStudents(students || [])
      setAttendanceRecord(attendanceRecord)
      if (attendanceRecord) {
        setSelectedKeys(new Set(attendanceRecord.records.map(r => r.status === "present" ? r.student : null).filter(Boolean)))
        setSelectedContentIds(attendanceRecord.contents || [])
        if (subject.subType === 'tg') {
          setPointInputs(attendanceRecord.pointsDiscussed.map((point, index) => ({ id: index, value: point })) || [{ id: Date.now(), value: '' }])
        }
      } else {
        setSelectedKeys(new Set())
        setSelectedContentIds([])
        setPointInputs([{ id: Date.now(), value: '' }])
      }
      if (subject.subType === 'tg') {
        setTgSessions(subject.tgSessions || [])
      }
    } catch (error) {
      console.error('Error fetching subject details:', error)
      toast.error("Failed to fetch subject details")
    } finally {
      setIsLoading(false)
    }
  }, [])

  const handleTakeAttendance = useCallback(() => {
    if (selectedSubject && selectedDate && selectedSession) {
      console.log(selectedDate,selectedSubject,selectedSession);
      setIsTableVisible(true)
      fetchSubjectDetails(selectedSubject, selectedBatch, selectedDate, selectedSession)
    } else {
      toast.error("Please select subject, date, and session before taking attendance.")
    }
  }, [selectedSubject, selectedBatch, selectedDate, selectedSession, fetchSubjectDetails])

  const validateTGSession = useCallback(() => {
    if (!selectedDate) {
      toast.error("Please select a date for the TG session")
      return false
    }

    const existingSession = tgSessions.find(session =>
      new Date(session.date).toISOString().split('T')[0] === selectedDate
    )

    if (existingSession) {
      toast.error("A TG session already exists for this date")
      return false
    }

    const validPoints = pointInputs.filter(point => point.value.trim())
    if (validPoints.length === 0) {
      toast.error("Please add at least one point discussed")
      return false
    }

    return true
  }, [selectedDate, tgSessions, pointInputs])

  const updateAttendance = useCallback(async () => {
    if (!selectedSubject) {
      toast.error("Please select a subject")
      return
    }

    if (!selectedSession) {
      toast.error("Please select a session")
      return
    }

    if (subjectDetails?.subType === 'tg' && !validateTGSession()) {
      return
    }

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
      const response = await api.put('/attendance', attendanceData)
      toast.success("Attendance updated successfully")
      setAttendanceRecord(response.data)
      if (subjectDetails.subType === 'tg') {
        await fetchSubjectDetails(selectedSubject, selectedBatch, selectedDate, selectedSession)
      }
      resetForm()
    } catch (error) {
      console.error('Failed to update attendance:', error)
      toast.error("Failed to update attendance")
    } finally {
      setIsLoading(false)
    }
  }, [selectedSubject, selectedSession, subjectDetails, validateTGSession, students, selectedKeys, selectedBatch, selectedDate, pointInputs, selectedContentIds, profile, fetchSubjectDetails, resetForm])

  return (
    <>
        <UpdateAttendanceForm
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
          isLoading={isLoading}
        />

        {selectedSubject && subjectDetails && isTableVisible && (
          <div className="grid md:grid-cols-2 gap-6"> 
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
            onClick={updateAttendance}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              attendanceRecord ? 'Update Attendance' : 'Submit Attendance'
            )}
          </Button>
        )}
        </>
  )
}

