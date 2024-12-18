import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { CheckSquare } from 'lucide-react'

export function UpdateAttendanceForm({
  profile,
  selectedSubject,
  setSelectedSubject,
  selectedBatch,
  setSelectedBatch,
  selectedDate,
  setSelectedDate,
  selectedSession,
  setSelectedSession,
  handleTakeAttendance
}) {
  const sessions = [1, 2, 3, 4, 5, 6, 7]

  return (
    <Card>
      <CardContent className="space-y-4 pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Select
              value={selectedSubject}
              onValueChange={setSelectedSubject}
            >
              <SelectTrigger id="subject">
                <SelectValue placeholder="Select Subject" />
              </SelectTrigger>
              <SelectContent>
                {profile?.subjects.map((subject) => (
                  <SelectItem key={subject._id} value={subject._id}>
                    {subject.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedSubject && profile?.subjects.find(s => s._id === selectedSubject)?.subType !== 'theory' && (
            <div className="space-y-2">
              <Label htmlFor="batch">Batch</Label>
              <Select
                value={selectedBatch}
                onValueChange={setSelectedBatch}
              >
                <SelectTrigger id="batch">
                  <SelectValue placeholder="Select Batch" />
                </SelectTrigger>
                <SelectContent>
                  {profile?.subjects.find(s => s._id === selectedSubject)?.batch.map((batch) => (
                    <SelectItem key={batch} value={batch}>
                      {batch}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="date">Session Date</Label>
            <Input
              id="date"
              type="date"
              value={selectedDate}
              onChange={(e) => {
                setSelectedDate(e.target.value)
                setSelectedSession(null)
              }}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="session">Session</Label>
            <Select
              value={selectedSession}
              onValueChange={setSelectedSession}
            >
              <SelectTrigger id="session">
                <SelectValue placeholder="Select Session" />
              </SelectTrigger>
              <SelectContent>
                {sessions.map((session) => (
                  <SelectItem key={session} value={session.toString()}>
                    Session {session}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button onClick={handleTakeAttendance} className="w-full md:w-auto">
          <CheckSquare className="mr-2 h-4 w-4" /> Update Attendance
        </Button>
      </CardContent>
    </Card>
  )
}

